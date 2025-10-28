import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Dashboard from "./pages/Backoffice/Dashboard";
import ProductManager from "./pages/Backoffice/ProductManager";
import OrdersManager from "./pages/Backoffice/OrdersManager";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto p-4">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private User Pages */}
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />

            {/* Backoffice (Admin only) */}
            <Route
              path="/backoffice/dashboard"
              element={
                <PrivateRoute role="admin">
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/backoffice/products"
              element={
                <PrivateRoute role="admin">
                  <ProductManager />
                </PrivateRoute>
              }
            />
            <Route
              path="/backoffice/orders"
              element={
                <PrivateRoute role="admin">
                  <OrdersManager />
                </PrivateRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
