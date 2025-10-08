import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    orders: [String]
  }
`);

const root = {
  orders: () => ["Order-1", "Order-2", "Order-3"]
};

const app = express();

// GraphQL endpoint
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

// Health check endpoint (HTTP)
app.get("/healthz", (_, res) => {
  res.status(200).send("Order Service is healthy!!!");
});

app.listen(4002, "0.0.0.0", () => console.log("Order Service running on 0.0.0.0:4002"));
