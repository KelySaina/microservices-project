import React, { useEffect, useState } from "react";
import { getMyOrders, updateOrderStatus } from "../api/order";
import { getProductById, updateProductStock } from "../api/product";
import { useCart } from "../components/CartContext";

const ORDERS_PER_PAGE = 3;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const { cart, updateQuantity, removeFromCart, clearCart, checkout } =
    useCart();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let res = await getMyOrders();
      res = res || [];
      res.sort((a, b) => Number(b.created_at) - Number(a.created_at));
      setOrders(res);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);
    try {
      const order = await checkout();
      alert(`Order #${order.id} created!`);

      for (const item of cart) {
        const newStock = Math.max(item.stock - item.quantity, 0);
        await updateProductStock(item.id, newStock);
      }

      await fetchOrders();
      clearCart();
    } catch (err) {
      console.error("Failed to create order:", err);
      alert("Failed to create order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const updatedOrder = await updateOrderStatus(id, status);

      if (status === "cancelled" && updatedOrder.items) {
        for (const item of updatedOrder.items) {
          const productId = item.product?.id;
          if (!productId) continue;
          const currentProduct = await getProductById(productId);
          const restoredStock = (currentProduct?.stock || 0) + item.quantity;
          await updateProductStock(productId, restoredStock);
        }
      }

      await fetchOrders();
      return updatedOrder;
    } catch (error) {
      console.error("Order status update failed:", error);
      alert("Failed to update order status");
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Loading orders...</div>;

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Enhanced Cart */}
      {cart.length > 0 && (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
            🛍️ Current Cart
          </h2>

          <ul className="divide-y divide-gray-100">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between py-3 hover:bg-gray-50 transition rounded-lg px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">
                    {item.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {item.name} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-500">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
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
                <span className="text-gray-700 font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center mt-4">
            <span className="text-lg font-bold text-gray-800">
              Total: <span className="text-green-600">${totalAmount.toFixed(2)}</span>
            </span>
            <div className="flex gap-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <label className="font-medium">Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setCurrentPage(1);
            setStatusFilter(e.target.value);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders */}
      <div className="space-y-4">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order) => (
            <div
              key={order.id}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-100"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800">Order #{order.id}</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Date: {new Date(Number(order.created_at)).toLocaleString()}
              </p>
              {order.items && order.items.length > 0 && (
                <ul className="mt-2 ml-4 list-disc text-gray-700">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.product?.name} × {item.quantity} ($
                      {item.unit_price})
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex gap-2 mt-3">
                {order.status === "pending" && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                    onClick={() => handleStatusUpdate(order.id, "paid")}
                  >
                    Pay
                  </button>
                )}
                {!["shipped", "cancelled", "paid"].includes(order.status) && (
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleStatusUpdate(order.id, "cancelled")}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
