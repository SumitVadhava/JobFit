import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Support both 'role' and 'UserRole' (some tokens use one or the other)
  const userRole = (user.role)?.toLowerCase();
  const allowedRoles = roles.map(r => r.toLowerCase());

  // Logged in but not allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
