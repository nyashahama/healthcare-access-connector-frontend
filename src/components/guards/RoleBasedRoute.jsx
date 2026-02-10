import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

/**
 * RoleBasedRoute component to guard routes based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if role matches
 * @param {Array<string>} props.allowedRoles - Array of allowed user roles
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { getCurrentUser, isAuthenticated } = useAuth();
  const currentUser = getCurrentUser();

  // If not authenticated, this should be caught by ProtectedRoute
  if (!isAuthenticated()) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if user has one of the allowed roles
  const userRole = currentUser?.role;
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    // Redirect to unauthorized page or user's dashboard
    return <Navigate to={getRoleBasedDashboard(userRole)} replace />;
  }

  return children;
};

/**
 * Get dashboard path based on user role
 * @param {string} role - User role
 * @returns {string} Dashboard path
 */
const getRoleBasedDashboard = (role) => {
  switch (role) {
    case "patient":
      return "/patient/dashboard";
    case "clinic_admin":
    case "doctor":
    case "nurse":
      return "/provider/dashboard";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/auth/sign-in";
  }
};

export default RoleBasedRoute;
