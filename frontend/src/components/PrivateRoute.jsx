import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../utils/auth";

/**
 * Usage:
 * <PrivateRoute element={<AdminPage />} roles={['ADMIN']} />
 */
export default function PrivateRoute({ element, roles }) {
  const authed = isAuthenticated();
  const user = getUser();

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
}
