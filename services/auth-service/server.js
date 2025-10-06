import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => "Hello from Auth Service YO",
};

const app = express();
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

app.listen(4001, "0.0.0.0", () => console.log("Auth Service running on 0.0.0.0:4001"));
