// index.js
import { ApolloServer } from "apollo-server";
import { introspectSchema, wrapSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import fetch from "cross-fetch"; // more compatible than node-fetch
import { print } from "graphql";

// Helper to create remote executors
const createRemoteExecutor =
  (url) =>
  async ({ document, variables }) => {
    const query = print(document);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return response.json();
  };

async function startServer() {
  // Wrap remote schemas
  const authSchema = wrapSchema({
    schema: await introspectSchema(
      createRemoteExecutor("http://auth-service:4001/graphql")
    ),
    executor: createRemoteExecutor("http://auth-service:4001/graphql"),
  });

  const orderSchema = wrapSchema({
    schema: await introspectSchema(
      createRemoteExecutor("http://order-service:4002/graphql")
    ),
    executor: createRemoteExecutor("http://order-service:4002/graphql"),
  });

  const productSchema = wrapSchema({
    schema: await introspectSchema(
      createRemoteExecutor("http://product-service:4003/graphql")
    ),
    executor: createRemoteExecutor("http://product-service:4003/graphql"),
  });

  // Stitch all schemas together
  const gatewaySchema = stitchSchemas({
    subschemas: [authSchema, orderSchema, productSchema],
  });

  // Start Apollo server
  const server = new ApolloServer({ schema: gatewaySchema });

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Gateway running at ${url}`);
  });
}

// Start the gateway
startServer();
