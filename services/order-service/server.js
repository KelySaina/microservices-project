import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    orders: [String],
    healthz: Striing
  }
`);

const root = {
  orders: () => ["Order-1", "Order-2", "Order-3"],
  healthz: () => "Order server is healthy!!!"
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4002, "0.0.0.0", () => console.log("Order Service running on 0.0.0.0:4002"));
