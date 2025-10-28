export const API_URLS = {
  auth: "http://myapp.local:30080/auth",
  product: "http://myapp.local:30080/products",
  order: "http://myapp.local:30080/orders",
};

export const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        role
      }
    }
  }
`;

export const GET_PRODUCTS = `
  query {
    products {
      id
      name
      description
      price
    }
  }
`;

export const CREATE_ORDER = `
  mutation CreateOrder($productId: ID!, $quantity: Int!) {
    createOrder(productId: $productId, quantity: $quantity) {
      id
      status
      total
    }
  }
`;
