import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

/**
 * PublicRoute component for routes that should only be accessible when NOT authenticated
 * (e.g., sign-in, sign-up pages)
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
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
            Loading
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to their dashboard
  if (isAuthenticated && user) {
    const redirectPath = getRoleBasedDashboard(user.role);
    return <Navigate to={redirectPath} replace />;
  }

  // User is not authenticated, render the auth page
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
      return "/";
  }
};

export default PublicRoute;
