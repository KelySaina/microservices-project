import { API_URLS } from "../utils/config";
import { graphqlRequest } from "./graphqlClient";

/* Create an order (requires Authorization header) */
export async function createOrder({ productId, quantity }) {
  const query = `
    mutation CreateOrder($productId: ID!, $quantity: Int!) {
      createOrder(input: { productId: $productId, quantity: $quantity }) {
        id status total createdAt
      }
    }
  `;
  const variables = { productId, quantity };
  const data = await graphqlRequest(API_URLS.order, { query, variables });
  return data.createOrder;
}

/* Get orders for current user */
export async function getMyOrders() {
  const query = `
    query {
      myOrders {
        id status items { product_id  quantity unit_price }
      }
    }
  `;
  const data = await graphqlRequest(API_URLS.order, { query });
  return data.myOrders || [];
}

/* Admin: get all orders */
export async function getAllOrders() {
  const query = `
    query {
      orders {
        id user { id email }
        status total items { productId quantity price }
        createdAt
      }
    }
  `;
  const data = await graphqlRequest(API_URLS.order, { query });
  return data.orders || [];
}

/* Admin: update order status */
export async function updateOrderStatus(orderId, status) {
  const query = `
    mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
      updateOrderStatus(orderId: $orderId, status: $status) {
        id status
      }
    }
  `;
  const variables = { orderId, status };
  const data = await graphqlRequest(API_URLS.order, { query, variables });
  return data.updateOrderStatus;
}
