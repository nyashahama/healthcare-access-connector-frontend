import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

/**
 * RoleBasedRoute component to guard routes based on user roles
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if role matches
 * @param {Array<string>} props.allowedRoles - Array of allowed user roles
 */
const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  // Re-evaluate authentication whenever auth state changes
  useEffect(() => {
    if (!loading) {
      setShouldRender(true);
    }
  }, [loading, isAuthenticated, user?.id, user?.role]);

  // Show loading while checking
  if (loading || !shouldRender) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-lightPrimary dark:bg-navy-900">
        <div className="text-center">
          <div className="relative mx-auto mb-6 h-16 w-16">
            <svg
              className="h-full w-full animate-spin text-brand-500"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-navy-700 dark:text-white">
            Verifying Access
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // If not authenticated, this should be caught by ProtectedRoute
  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // Check if user has one of the allowed roles
  const userRole = user.role;
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
    case "caregiver":
    case "provider_staff":
    case "clinic_manager":
      return "/provider/dashboard";
    case "admin":
    case "system_admin":
    case "ngo_partner":
      return "/admin/dashboard";
    default:
      return "/auth/sign-in";
  }
};

export default RoleBasedRoute;
