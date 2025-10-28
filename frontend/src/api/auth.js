import { API_URLS } from "../utils/config";
import { graphqlRequest } from "./graphqlClient";
import { setToken, setUser } from "../utils/auth";

/**
 * login: performs login, stores token+user in localStorage
 * register: user registration (if supported)
 * me: fetch current user profile
 */

export async function login({ email, password }) {
  const query = `
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user { id email role name }
      }
    }
  `;
  const variables = { email, password };

  const data = await graphqlRequest(API_URLS.auth, { query, variables });
  if (!data?.login) throw new Error("Invalid login response");

  const { token, user } = data.login;
  setToken(token);
  setUser(user);
  return { token, user };
}

export async function register({ name, email, password }) {
  const query = `
    mutation Register($name: String!, $email: String!, $password: String!) {
      register(input: { name: $name, email: $email, password: $password }) {
        token
        user { id email role name }
      }
    }
  `;
  const variables = { name, email, password };
  const data = await graphqlRequest(API_URLS.auth, { query, variables });
  if (data?.register?.token) {
    setToken(data.register.token);
    setUser(data.register.user);
  }
  return data.register;
}

export async function me() {
  const query = `
    query {
      me { id email name role }
    }
  `;
  const data = await graphqlRequest(API_URLS.auth, { query });
  return data.me;
}
