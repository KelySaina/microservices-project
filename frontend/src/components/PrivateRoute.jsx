import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../utils/auth";

export default function PrivateRoute({ children, roles }) {
  const authed = isAuthenticated();
  const user = getUser();

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin to backoffice
  if (user?.role === "admin") {
    return <Navigate to="/backoffice/dashboard" replace />;
  }

  // Check allowed roles if specified
  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
