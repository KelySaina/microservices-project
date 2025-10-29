import fs from "fs";

// Try reading version.json
let VERSION = "v-unknown";
let BUILD_DATE = new Date().toISOString().split("T")[0];

try {
  const data = JSON.parse(fs.readFileSync("/app/version.json", "utf-8"));
  VERSION = data.version;
  BUILD_DATE = data.date;
} catch (err) {
  console.warn("Could not read version.json, using defaults");
}

import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLInputObjectType,
} from "graphql";
import pool from "./db.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// --- Input type for order items ---
const OrderItemInputType = new GraphQLInputObjectType({
  name: "OrderItemInput",
  fields: {
    product_id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
  },
});

// --- Order Item Type ---
const OrderItemType = new GraphQLObjectType({
  name: "OrderItem",
  fields: () => ({
    id: { type: GraphQLID },
    product_id: { type: GraphQLID },
    quantity: { type: GraphQLInt },
    unit_price: { type: GraphQLFloat },
  }),
});

// --- Order Type ---
const OrderType = new GraphQLObjectType({
  name: "Order",
  fields: () => ({
    id: { type: GraphQLID },
    user_id: { type: GraphQLID },
    total_amount: { type: GraphQLFloat },
    status: { type: GraphQLString },
    items: {
      type: new GraphQLList(OrderItemType),
      resolve: async (parent) => {
        const [rows] = await pool.query(
          "SELECT * FROM order_items WHERE order_id = ?",
          [parent.id]
        );
        return rows;
      },
    },
    created_at: { type: GraphQLString },
    updated_at: { type: GraphQLString },
  }),
});

// --- Root Query ---
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    myOrders: {
      type: new GraphQLList(OrderType),
      resolve: async (_, __, context) => {
        if (!context.user) throw new Error("Unauthorized");
        const [rows] = await pool.query(
          "SELECT * FROM orders WHERE user_id = ?",
          [context.user.id]
        );
        return rows;
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve: async (_, __, context) => {
        if (!context.user) throw new Error("Unauthorized");
        const [rows] = await pool.query("SELECT * FROM orders", [
          context.user.id,
        ]);
        return rows;
      },
    },
    healthz: {
      type: GraphQLString,
      resolve: () =>
        `Order Service is healthy!!! ${BUILD_DATE} #${VERSION}`,
    },

  },
});

// --- Mutations ---
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createOrder: {
      type: OrderType,
      args: {
        items: { type: new GraphQLList(OrderItemInputType) },
      },
      resolve: async (_, { items }, context) => {
        if (!context.user) throw new Error("Unauthorized");

        const conn = await pool.getConnection();
        let totalAmount = 0;

        try {
          await conn.beginTransaction();

          // 1️⃣ Fetch product info from product-service
          for (const item of items) {
            const query = `
              query($id: ID!) {
                product(id: $id) {
                  id
                  price
                  stock
                }
              }
            `;
            const response = await axios.post(process.env.PRODUCT_SERVICE_URL, {
              query,
              variables: { id: item.product_id },
            });

            const product = response.data.data.product;
            if (!product)
              throw new Error(`Product ${item.product_id} not found`);
            if (product.stock < item.quantity)
              throw new Error(
                `Not enough stock for product ${item.product_id}`
              );

            item.unit_price = product.price;
            totalAmount += product.price * item.quantity;
          }

          // 2️⃣ Insert into orders
          const [orderResult] = await conn.query(
            "INSERT INTO orders (user_id, total_amount) VALUES (?, ?)",
            [context.user.id, totalAmount]
          );
          const orderId = orderResult.insertId;

          // 3️⃣ Insert order_items
          for (const item of items) {
            await conn.query(
              "INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)",
              [orderId, item.product_id, item.quantity, item.unit_price]
            );
          }

          await conn.commit();
          return {
            id: orderId,
            user_id: context.user.id,
            total_amount: totalAmount,
            status: "pending",
          };
        } catch (err) {
          await conn.rollback();
          throw err;
        } finally {
          conn.release();
        }
      },
    },
  },
});

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
