import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated, getUser, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between shadow-md">
      {/* Left side */}
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

      {/* Right side */}
      <div className="relative" ref={menuRef}>
        {isAuthenticated() ? (
          <>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded"
            >
              <div className="text-sm text-left">
                <p className="font-semibold">{user?.username || "User"}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-lg z-50">
                <div className="px-4 py-2 border-b text-sm">
                  <p className="font-semibold">{user?.username}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </>
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
