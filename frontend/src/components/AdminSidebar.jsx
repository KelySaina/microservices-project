import React from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/backoffice/dashboard", label: "Dashboard" },
  { to: "/backoffice/products", label: "Products" },
  { to: "/backoffice/orders", label: "Orders" },
];

export default function AdminSidebar() {
  return (
    <aside className="bg-gray-800 text-white w-60 min-h-screen p-5 flex flex-col">
      <h2 className="text-xl font-semibold mb-6 text-blue-400">Backoffice</h2>
      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded ${
                isActive ? "bg-blue-600" : "hover:bg-gray-700"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
