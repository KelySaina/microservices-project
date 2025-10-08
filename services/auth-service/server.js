import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
  type Query {
    loggedIn: Boolean
  }
`);

const root = {
  loggedIn: () => {
    // Implement your logic to check if the user is logged in
    return true; // or false based on the user's authentication status
  }
};

const app = express();

// GraphQL endpoint (if needed)
app.use("/graphql", graphqlHTTP({ schema, rootValue: root, graphiql: true }));

// Health check endpoint
app.get("/healthz", (_, res) => {
  res.status(200).send("Auth Service is healthy!!!");
});

app.listen(4001, "0.0.0.0", () => console.log("Auth Service running on 0.0.0.0:4001"));
