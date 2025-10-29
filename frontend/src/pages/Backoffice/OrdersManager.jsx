import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { getAllOrders, updateOrderStatus } from "../../api/order";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await getAllOrders();
    setOrders(res || []);
  };

  useEffect(() => {
    console.log("Orders page")
    fetchOrders();
  }, []);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    fetchOrders();
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Order ID</th>
              <th className="p-2 text-left">Customer</th>
              <th className="p-2 text-left">Total</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Items</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t align-top">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{o.user?.name} ({o.user?.email})</td>
                <td className="p-2">${o.total_amount?.toFixed(2)}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2">
                  <ul className="list-disc ml-4">
                    {o.items.map((item) => (
                      <li key={item.id}>
                        {item.product?.name} x {item.quantity} ($
                        {item.unit_price.toFixed(2)})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleStatus(o.id, "SHIPPED")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Ship
                  </button>
                  <button
                    onClick={() => handleStatus(o.id, "CANCELLED")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
