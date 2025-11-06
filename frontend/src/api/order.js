import { API_URLS } from "../utils/config";
import { graphqlRequest } from "./graphqlClient";

/* Create an order from cart items */
export async function createOrder(items) {
  // items = [{ product_id, quantity }]
  const query = `
    mutation CreateOrder($items: [OrderItemInput!]!) {
      createOrder(items: $items) {
        id
        status
        total_amount
        user { id username email }
        items {
          id
          quantity
          unit_price
          product { id name price description stock }
        }
        created_at
        updated_at
      }
    }
  `;
  const variables = { items };
  const data = await graphqlRequest(API_URLS.order, { query, variables });
  return data.createOrder;
}

/* Get orders for current user */
export async function getMyOrders() {
  const query = `
    query {
      myOrders {
        id
        status
        total_amount
        items {
          id
          quantity
          unit_price
          product { id name price description stock }
        }
        created_at
        updated_at
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
        id
        status
        total_amount
        user { id username email }
        items {
          id
          quantity
          unit_price
          product { id name price stock }
        }
        created_at
        updated_at
      }
    }
  `;
  const data = await graphqlRequest(API_URLS.order, { query });
  return data.orders || [];
}

export async function updateOrderStatus(orderId, status) {
  const query = `
    mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
      updateOrderStatus(orderId: $orderId, status: $status) {
        id
        status
        items {
          quantity
          product {
            id
            name
            stock
          }
        }
      }
    }
  `;

  const variables = { orderId, status };

  const data = await graphqlRequest(API_URLS.order, { query, variables });
  return data.updateOrderStatus;
}
