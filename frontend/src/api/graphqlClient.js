import { getToken } from "../utils/auth";

/**
 * Basic GraphQL client for POSTing queries/mutations.
 * - attaches Authorization header when token exists
 * - throws an Error with {message, graphQLErrors, status} on failure
 */
export async function graphqlRequest(
  url,
  { query, variables = {}, headers = {} } = {}
) {
  const token = getToken();

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
  });

  // network error status
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Network error: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = text;
    throw err;
  }

  const payload = await res.json();

  if (payload.errors && payload.errors.length) {
    const err = new Error(payload.errors[0].message || "GraphQL error");
    err.graphQLErrors = payload.errors;
    throw err;
  }

  return payload.data;
}
