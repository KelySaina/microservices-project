import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getAllOrders, updateOrderStatus } from "../../api/order";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    const res = await getAllOrders();
    setOrders(res || []);
    setFilteredOrders(res || []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  // Apply filters dynamically
  useEffect(() => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    // Search by user name or email
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((o) =>
        `${o.user?.username}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchQuery, orders]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by customer..."
            className="border rounded px-3 py-2 w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={fetchOrders}
            className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded text-sm"
          >
            Refresh
          </button>
        </div>

        {/* Orders Table */}
        <table className="w-full bg-white shadow rounded text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Order ID</th>
              <th className="p-2">Customer</th>
              <th className="p-2">Status</th>
              <th className="p-2">Total</th>
              <th className="p-2">Items</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((o) => (
              <tr key={o.id} className="border-t align-top hover:bg-gray-50">
                <td className="p-2 font-mono text-gray-700">{o.id}</td>
                <td className="p-2">
                  <div className="font-medium">{o.user?.username}</div>
                  <div className="text-gray-500 text-xs">{o.user?.email}</div>
                </td>
                <td className="p-2 capitalize font-semibold">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      o.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : o.status === "paid"
                        ? "bg-blue-100 text-blue-700"
                        : o.status === "shipped"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="p-2 font-semibold">${o.total_amount?.toFixed(2)}</td>
                <td className="p-2">
                  <ul className="list-disc ml-4 text-gray-600">
                    {o.items.map((item) => (
                      <li key={item.id}>
                        {item.product?.name} × {item.quantity} ($
                        {item.unit_price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 space-x-2">
                  {o.status === "paid" && (
                    <button
                      onClick={() => handleStatus(o.id, "shipped")}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Ship
                    </button>
                  )}
                  {o.status !== "cancelled" && (
                    <button
                      onClick={() => handleStatus(o.id, "cancelled")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <p className="text-gray-500 mt-6 text-center">No orders found.</p>
        )}
      </div>
    </div>
  );
}
