import React, { useEffect, useState } from "react";
import { Navigate } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import {
  getDashboardPath,
  isAdminRole,
  isPatientRole,
  isProviderRole,
} from "utils/roleUtils";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      setShouldRender(true);
    }
  }, [loading, isAuthenticated, user?.id, user?.role]);

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

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  const userRole = user.role as string;
  const hasPermission = allowedRoles.includes(userRole);

  if (!hasPermission) {
    return <Navigate to={getRoleBasedDashboard(userRole)} replace />;
  }

  return children;
};

const getRoleBasedDashboard = (role: string): string => {
  if (isPatientRole(role)) {
    return "/patient/dashboard";
  }

  if (isProviderRole(role)) {
    return "/provider/dashboard";
  }

  if (isAdminRole(role)) {
    return "/admin/dashboard";
  }

  const fallbackPath = getDashboardPath(role);
  return fallbackPath === "/" ? "/auth/sign-in" : fallbackPath;
};

export default RoleBasedRoute;
