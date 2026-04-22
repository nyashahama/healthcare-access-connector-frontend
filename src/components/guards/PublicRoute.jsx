import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { getDashboardPath } from "utils/roleUtils";

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

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
        </div>
      </div>
    );
  }

  if (location.pathname === "/auth/complete-patient-profile") return children;

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default PublicRoute;
