import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContexts";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    console.warn("Protected route access attempted without user. Redirecting to /login.");
    return <Navigate to="/login" replace />;
  }

  // Support both 'role' state and 'user.role'
  const currentUserRole = (role || user.role)?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  // Logged in but not allowed
  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(currentUserRole)) {
    console.warn(`User role '${currentUserRole}' not allowed for this route. Allowed roles: ${normalizedAllowedRoles.join(", ")}`);
    // Redirect to unauthorized page (we'll ensure this route exists)
    return <Navigate to="/error/403" replace />;
  }

  return children;
};

export default ProtectedRoute;
