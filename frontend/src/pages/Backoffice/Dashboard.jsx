import React from "react";
import AdminSidebar from "../../components/AdminSidebar";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>Welcome, Admin! Manage your platform from here.</p>
      </div>
    </div>
  );
}
