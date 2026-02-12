import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import providerService from "api/services/providerService";

/**
 * ClinicRegistrationGuard
 *
 * This guard checks if a clinic_admin user has a registered clinic.
 * If they don't, they are redirected to the clinic registration page.
 * Other roles (provider_staff, caregiver) can access without a clinic.
 *
 * States:
 * - No clinic: Redirect to registration
 * - Clinic pending: Allow access with limited features
 * - Clinic approved: Full access
 */
const ClinicRegistrationGuard = ({ children }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [clinicStatus, setClinicStatus] = useState({
    hasClinic: false,
    isApproved: false,
    isPending: false,
  });

  // Use ref to prevent multiple simultaneous checks
  const isCheckingRef = useRef(false);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    const checkClinicStatus = async () => {
      // Prevent multiple simultaneous checks
      if (isCheckingRef.current || hasCheckedRef.current) {
        return;
      }

      // Only clinic admins need to have a clinic registered
      if (user?.role !== "clinic_admin") {
        setClinicStatus({
          hasClinic: true,
          isApproved: true,
          isPending: false,
        });
        setIsLoading(false);
        hasCheckedRef.current = true;
        return;
      }

      isCheckingRef.current = true;

      try {
        const response = await providerService.getMyClinic();

        if (response && response.clinic) {
          setClinicStatus({
            hasClinic: true,
            isApproved: response.clinic.verification_status === "approved",
            isPending: response.clinic.verification_status === "pending",
          });
        } else {
          // No clinic found
          setClinicStatus({
            hasClinic: false,
            isApproved: false,
            isPending: false,
          });
        }
      } catch (error) {
        // Check if it's a 404 error (no clinic found)
        if (error.response?.status === 404) {
          setClinicStatus({
            hasClinic: false,
            isApproved: false,
            isPending: false,
          });
        } else {
          // For other errors, fail open (allow access)
          // This prevents blocking users due to temporary network issues
          console.warn(
            "Failing open due to error checking clinic status:",
            error.message
          );
          setClinicStatus({
            hasClinic: true,
            isApproved: true,
            isPending: false,
          });
        }
      } finally {
        setIsLoading(false);
        isCheckingRef.current = false;
        hasCheckedRef.current = true;
      }
    };

    if (user && !hasCheckedRef.current) {
      checkClinicStatus();
    } else if (!user) {
      setIsLoading(false);
    }
  }, [user?.id]); // Only depend on user ID, not entire user object

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 animate-spin text-brand-500"
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
          <p className="mt-4 text-navy-700 dark:text-white">
            Checking clinic status...
          </p>
        </div>
      </div>
    );
  }

  // If clinic admin without clinic, redirect to registration (unless already on that page)
  if (
    user?.role === "clinic_admin" &&
    !clinicStatus.hasClinic &&
    location.pathname !== "/provider/clinic-registration"
  ) {
    return <Navigate to="/provider/clinic-registration" replace />;
  }

  // If clinic is pending approval, show limited access notice on dashboard
  if (
    user?.role === "clinic_admin" &&
    clinicStatus.isPending &&
    location.pathname === "/provider/dashboard"
  ) {
    // Allow access but the dashboard will show the pending approval banner
    return children;
  }

  // Allow access
  return children;
};

export default ClinicRegistrationGuard;
