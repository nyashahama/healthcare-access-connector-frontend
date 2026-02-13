import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import patientService from "api/services/patientService";
import { useAuth } from "context/AuthContext";

/**
 * ProfileCompletionGuard
 * Checks if patient has completed their profile and redirects if not
 * This should wrap patient dashboard and other protected patient routes
 */
const ProfileCompletionGuard = ({ children, minCompletion = 50 }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  // Use refs to prevent multiple simultaneous checks
  const isCheckingRef = useRef(false);
  const lastCheckedUserIdRef = useRef(null);
  const checkCountRef = useRef(0);

  useEffect(() => {
    const checkProfileCompletion = async () => {
      // Skip if we're on the profile completion page
      if (location.pathname === "/auth/complete-patient-profile") {
        setIsAllowed(true);
        setIsChecking(false);
        return;
      }

      // Prevent multiple simultaneous checks
      if (isCheckingRef.current) {
        return;
      }

      // Only check for authenticated patient users
      if (!isAuthenticated || !user || user.role !== "patient") {
        setIsAllowed(true);
        setIsChecking(false);
        return;
      }

      // If we've already checked this user, skip
      if (
        lastCheckedUserIdRef.current === user.id &&
        checkCountRef.current > 0
      ) {
        setIsChecking(false);
        return;
      }

      isCheckingRef.current = true;
      lastCheckedUserIdRef.current = user.id;
      checkCountRef.current++;

      try {
        // Get patient profile
        const profile = await patientService.getPatientProfileByUserId(user.id);
        const completion = patientService.calculateProfileCompletion(profile);

        if (completion < minCompletion) {
          // Profile incomplete, redirect to complete profile
          navigate("/auth/complete-patient-profile", { replace: true });
          setIsAllowed(false);
        } else {
          // Profile complete enough
          setIsAllowed(true);
        }
      } catch (error) {
        // If 404, user has no profile - redirect to complete profile
        if (error.response?.status === 404) {
          navigate("/auth/complete-patient-profile", { replace: true });
          setIsAllowed(false);
        } else {
          // For other errors, allow access (fail open)
          console.error("Error checking profile completion:", error);
          setIsAllowed(true);
        }
      } finally {
        setIsChecking(false);
        isCheckingRef.current = false;
      }
    };

    // Reset check count when user changes
    if (user?.id !== lastCheckedUserIdRef.current) {
      checkCountRef.current = 0;
    }

    checkProfileCompletion();
  }, [
    navigate,
    user?.id,
    user?.role,
    isAuthenticated,
    minCompletion,
    location.pathname,
  ]);

  // Show loading state while checking
  if (isChecking) {
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
            Loading Your Profile
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please wait while we verify your information...
          </p>
        </div>
      </div>
    );
  }

  // Render children if allowed
  return isAllowed ? children : null;
};

export default ProfileCompletionGuard;
