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
  return data.products || [];
}

/* Public: single product */
export async function getProductById(id) {
  const query = `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        name
        description
        price
        stock
      }
    }
  `;
  const variables = { id };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data.product;
}

/* Admin: create product */
export async function createProduct({ name, description, price, stock }) {
  const query = `
    mutation AddProduct($name: String!, $description: String, $price: Float!, $stock: Int) {
      addProduct(name: $name, description: $description, price: $price, stock: $stock) {
        id
        name
        description
        price
        stock
      }
    }
  `;
  const variables = { name, description, price, stock };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data.addProduct;
}

/* Admin: update stock only */
export async function updateProductStock(id, stock) {
  const query = `
    mutation UpdateStock($id: ID!, $stock: Int!) {
      updateStock(id: $id, stock: $stock) {
        id
        name
        description
        price
        stock
      }
    }
  `;
  const variables = { id, stock };
  const data = await graphqlRequest(API_URLS.product, { query, variables });
  return data.updateStock;
}

/* Admin: "delete" = set stock to 0 */
export async function deleteProduct(id) {
  return updateProductStock(id, 0);
}
