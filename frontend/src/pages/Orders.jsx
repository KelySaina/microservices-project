import React, { useEffect, useState } from "react";
import { getMyOrders, createOrder } from "../api/order";
import { useCart } from "../components/CartContext";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { cart, updateQuantity, removeFromCart, clearCart, checkout } = useCart();

  // Fetch past orders
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyOrders();
        setOrders(res || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setCheckoutLoading(true);
    try {
      const order = await checkout(); // calls CartContext.checkout
      alert(`Order #${order.id} created!`);
      setOrders((prev) => [order, ...prev]); // prepend new order
    } catch (err) {
      console.error(err);
      alert("Failed to create order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading)
    return <div className="text-center mt-10">Loading orders...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Current Cart */}
      {cart.length > 0 && (
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-2">Current Cart</h2>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex justify-between items-center bg-white p-2 rounded"
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="w-16 border rounded px-1"
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value, 10))
                    }
                  />
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2 font-bold">
            Total: $
            {cart
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2)}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              onClick={clearCart}
            >
              Clear Cart
            </button>
            <button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </div>
      )}

      {/* Past Orders */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        {orders.length > 0 ? (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="p-4 bg-white shadow rounded flex flex-col"
              >
                <p className="font-semibold">Order #{order.id}</p>
                <p>Status: {order.status}</p>
                <p>
                  Date:{" "}
                  {new Date(order.created_at || order.createdAt).toLocaleString()}
                </p>
                {order.items && order.items.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc">
                    {order.items.map((item) => (
                      <li key={item.product_id}>
                        {item.product_id} x {item.quantity} ($
                        {item.unit_price})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders yet.</p>
        )}
      </div>
    </div>
  );
}
