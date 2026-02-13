import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";

/**
 * ProtectedRoute - Simple version that just blocks unauthorized access
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  const [state, setState] = useState({
    isChecking: true,
    isAuthorized: false,
  });

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;

    if (loading) return;

    hasCheckedRef.current = true;

    // Not authenticated - show login message
    if (!isAuthenticated || !user) {
      setState({ isChecking: false, isAuthorized: false });
      return;
    }

    // Check roles
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      setState({ isChecking: false, isAuthorized: false });
      return;
    }

    // Authorized
    setState({ isChecking: false, isAuthorized: true });
  }, [loading, isAuthenticated, user?.id, user?.role, allowedRoles]);

  // Show loading
  if (loading || state.isChecking) {
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
        </div>
      </div>
    );
  }

  // Not authorized - show message with link
  if (!state.isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-lightPrimary p-4 dark:bg-navy-900">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-xl dark:bg-navy-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Access Denied
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            You need to be logged in to access this page.
          </p>
          <a
            href="/auth/sign-in"
            className="inline-block rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
