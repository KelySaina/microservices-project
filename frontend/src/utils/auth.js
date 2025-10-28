// small token helpers (localStorage). Replace with cookie storage if you prefer.
const TOKEN_KEY = "app_token";
const USER_KEY = "app_user";

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

export function getUser() {
  const s = localStorage.getItem(USER_KEY);
  return s ? JSON.parse(s) : null;
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function logout() {
  setToken(null);
  setUser(null);
}
