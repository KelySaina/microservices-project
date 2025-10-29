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
      login(email: $email, password: $password){
        token,
        user { id username email role }
      }
    }
  `;

  const variables = { email, password };

  const token = await graphqlRequest(API_URLS.auth, { query, variables })
    .then(data => data.login); // login returns the string token

  if (!token) throw new Error("Invalid login response");

  setToken(token);
  return { token };
}


export async function register({ username, email, password }) {
  const query = `
    mutation Register($username: String!, $email: String!, $password: String!) {
      register( username: $username, email: $email, password: $password ) {
        id email role username
      }
    }
  `;
  const variables = { username, email, password };
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
      me { id email username role }
    }
  `;
  const data = await graphqlRequest(API_URLS.auth, { query });
  return data.me;
}
