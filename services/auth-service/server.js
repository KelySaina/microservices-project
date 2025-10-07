import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    healthz: String
  }
`);

const root = {
  healthz: () => "Auth Service is healthy!!!",
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4001, "0.0.0.0", () => console.log("Auth Service running on 0.0.0.0:4001"));
