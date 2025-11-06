import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { DollarSign, ShoppingBag, Package, AlertTriangle, TrendingUp, Clock } from "lucide-react";
import { getAllOrders } from "../../api/order";
import { getAllProducts } from "../../api/product";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    outOfStock: 0,
    pendingOrders: 0,
    topProduct: "N/A",
  });

  useEffect(() => {
    (async () => {
      try {
        const [orders, products] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
        ]);

        const paidOrShipped = orders.filter(
          (o) => o.status === "paid" || o.status === "shipped"
        );

        const totalRevenue = paidOrShipped.reduce(
          (acc, o) => acc + o.total_amount,
          0
        );
        const totalOrders = orders.length;
        const avgOrderValue =
          paidOrShipped.length > 0
            ? totalRevenue / paidOrShipped.length
            : 0;
        const outOfStock = products.filter((p) => p.stock <= 0).length;
        const pendingOrders = orders.filter((o) => o.status === "pending").length;

        // Find the top-selling product
        const productSales = {};
        orders.forEach((o) => {
          o.items.forEach((item) => {
            if (!productSales[item.product?.name]) productSales[item.product?.name] = 0;
            productSales[item.product?.name] += item.quantity;
          });
        });
        const topProduct =
          Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "N/A";

        setStats({
          totalRevenue,
          totalOrders,
          avgOrderValue,
          outOfStock,
          pendingOrders,
          topProduct,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    })();
  }, []);

  const cards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: <DollarSign className="text-green-600" size={22} />,
      color: "bg-green-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag className="text-blue-600" size={22} />,
      color: "bg-blue-50",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: <Clock className="text-yellow-600" size={22} />,
      color: "bg-yellow-50",
    },
    {
      title: "Out of Stock",
      value: stats.outOfStock,
      icon: <AlertTriangle className="text-red-600" size={22} />,
      color: "bg-red-50",
    },
    {
      title: "Average Order Value",
      value: `$${stats.avgOrderValue.toFixed(2)}`,
      icon: <TrendingUp className="text-purple-600" size={22} />,
      color: "bg-purple-50",
    },
    {
      title: "Top Product",
      value: stats.topProduct,
      icon: <Package className="text-orange-600" size={22} />,
      color: "bg-orange-50",
    },
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`${card.color} rounded-xl shadow p-5 flex items-center justify-between hover:shadow-lg transition`}
            >
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {card.title}
                </h3>
                <p className="text-xl font-bold text-gray-800 mt-1">
                  {card.value}
                </p>
              </div>
              <div className="bg-white p-3 rounded-full shadow-sm">
                {card.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
