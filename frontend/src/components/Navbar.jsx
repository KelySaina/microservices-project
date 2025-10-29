import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUser, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center space-x-6">
        <Link to="/" className="text-lg font-bold text-blue-400">
          🛒 MyShop
        </Link>
        {isAuthenticated() && (
          <Link to="/orders" className="hover:text-blue-300">
            My Orders
          </Link>
        )}
        {user?.role === "admin" && (
          <Link to="/backoffice/dashboard" className="hover:text-blue-300">
            Admin Dashboard
          </Link>
        )}
      </div>
      <div>
        {isAuthenticated() ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-sm"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
