import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "context/AuthContext";

/**
 * PublicRoute - Shows message for authenticated users
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  const [state, setState] = useState({
    isChecking: true,
    shouldBlock: false,
  });

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (hasCheckedRef.current) return;

    if (loading) return;

    hasCheckedRef.current = true;

    // Block if authenticated
    if (isAuthenticated && user) {
      setState({ isChecking: false, shouldBlock: true });
      return;
    }

    // Allow access
    setState({ isChecking: false, shouldBlock: false });
  }, [loading, isAuthenticated, user?.id]);

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
            Loading
          </h3>
        </div>
      </div>
    );
  }

  // Already logged in
  if (state.shouldBlock) {
    const dashboardPath = getRoleBasedDashboard(user.role);

    return (
      <div className="flex h-screen w-full items-center justify-center bg-lightPrimary p-4 dark:bg-navy-900">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-xl dark:bg-navy-800">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Already Logged In
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-300">
            You're already logged in as {user.email || user.phone_number}
          </p>
          <a
            href={dashboardPath}
            className="inline-block rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
};

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
