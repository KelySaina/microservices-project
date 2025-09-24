import { ApolloServer } from "apollo-server";
import { wrapSchema } from "@graphql-tools/wrap";
import { stitchSchemas } from "@graphql-tools/stitch";
import fetch from "cross-fetch"; // more compatible than node-fetch
import { print } from "graphql";

// Helper to create remote executors
const createRemoteExecutor =
  (url) =>
  async ({ document, variables }) => {
    const query = print(document);

    let retries = 5;
    let delay = 2000; // 2 seconds
    while (retries > 0) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, variables }),
        });
        if (!response.ok) throw new Error(`Status ${response.status}`);
        return response.json();
      } catch (err) {
        console.warn(
          `Failed to reach ${url}, retrying in ${delay}ms... (${retries} left)`
        );
        retries--;
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error(`Cannot reach ${url} after multiple retries`);
  };

async function startServer() {
  console.log("Starting gateway, waiting for dependent services...");

  // Wrap remote schemas
  const authSchema = wrapSchema({
    schema: await createRemoteExecutor("http://auth-service:4001/graphql")({
      document: { kind: "Document", definitions: [] },
    }),
    executor: createRemoteExecutor("http://auth-service:4001/graphql"),
  });

  const orderSchema = wrapSchema({
    schema: await createRemoteExecutor("http://order-service:4002/graphql")({
      document: { kind: "Document", definitions: [] },
    }),
    executor: createRemoteExecutor("http://order-service:4002/graphql"),
  });

  const productSchema = wrapSchema({
    schema: await createRemoteExecutor("http://product-service:4003/graphql")({
      document: { kind: "Document", definitions: [] },
    }),
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
startServer().catch((err) => {
  console.error("Failed to start gateway:", err);
  process.exit(1);
});
