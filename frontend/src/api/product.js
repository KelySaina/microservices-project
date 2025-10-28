import { API_URLS } from "../utils/config";
import { graphqlRequest } from "./graphqlClient";

/* Public: list products (no auth needed) */
export async function getAllProducts() {
  const query = `
    query GetProducts {
      products {
        id
        name
        description
        price
        stock
      }
    }
  `;
  const data = await graphqlRequest(API_URLS.product, { query });
  return data || [];
}

/* Public: single product */
export async function getProductById(id) {
  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id name description price sku image
      }
    }
  `;
  const variables = { id };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data;
}

/* Admin: create product (requires auth) */
export async function createProduct({ name, price, stock }) {
  const query = `
    mutation AddProduct($name: String!, $description: String!, $price: Float!, $stock: Int!) {
      addProduct(name: $name, description: $description, price: $price, stock: $stock) {
        id
        name
        description
        price
        stock
      }
    }
  `;
  const variables = { name, price, stock };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data.addProduct;
}

/* Admin: update product */
export async function updateProduct(id, input) {
  const query = `
    mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
      updateProduct(id: $id, input: $input) {
        id name price
      }
    }
  `;
  const variables = { id, input };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data;
}

/* Admin: delete product */
export async function deleteProduct(id) {
  const query = `
    mutation DeleteProduct($id: ID!) {
      deleteProduct(id: $id) { success message }
    }
  `;
  const variables = { id };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data;
}
