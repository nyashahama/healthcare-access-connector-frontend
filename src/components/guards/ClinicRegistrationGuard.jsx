import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "hooks/useAuth";

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

  useEffect(() => {
    const checkClinicStatus = async () => {
      // Only clinic admins need to have a clinic registered
      if (user?.role !== "clinic_admin") {
        setClinicStatus({
          hasClinic: true,
          isApproved: true,
          isPending: false,
        });
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has a clinic registered
        const response = await fetch("/api/clinics/my-clinic", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.clinic) {
            setClinicStatus({
              hasClinic: true,
              isApproved: data.clinic.verification_status === "approved",
              isPending: data.clinic.verification_status === "pending",
            });
          } else {
            setClinicStatus({
              hasClinic: false,
              isApproved: false,
              isPending: false,
            });
          }
        } else if (response.status === 404) {
          // No clinic found
          setClinicStatus({
            hasClinic: false,
            isApproved: false,
            isPending: false,
          });
        } else {
          console.error("Error checking clinic status");
          setClinicStatus({
            hasClinic: false,
            isApproved: false,
            isPending: false,
          });
        }
      } catch (error) {
        console.error("Error checking clinic status:", error);
        setClinicStatus({
          hasClinic: false,
          isApproved: false,
          isPending: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      checkClinicStatus();
    } else {
      setIsLoading(false);
    }
  }, [user]);

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
