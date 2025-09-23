import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    orders: [String]
  }
`);

const root = {
  orders: () => ["Order-1", "Order-2", "Order-3"],
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4002, () => {
  console.log("Order Service running on http://localhost:4002/graphql");
});