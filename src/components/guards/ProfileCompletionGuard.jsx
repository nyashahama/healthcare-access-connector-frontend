import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import patientService from "api/services/patientService";
import { useAuth } from "context/AuthContext";

/**
 * ProfileCompletionGuard - Shows modal instead of redirecting
 * This prevents navigation loops
 */
const ProfileCompletionGuard = ({ children, minCompletion = 50 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [state, setState] = useState({
    isChecking: true,
    showModal: false,
    completion: 0,
  });

  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Only check once
    if (hasCheckedRef.current) return;

    // Skip if on completion page
    if (location.pathname === "/auth/complete-patient-profile") {
      setState({ isChecking: false, showModal: false, completion: 100 });
      hasCheckedRef.current = true;
      return;
    }

    // Wait for auth
    if (authLoading) return;

    // Only for patients
    if (!isAuthenticated || !user || user.role !== "patient") {
      setState({ isChecking: false, showModal: false, completion: 100 });
      hasCheckedRef.current = true;
      return;
    }

    hasCheckedRef.current = true;

    // Check cache
    const cacheKey = `profile_check_${user.id}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { completion, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60000) {
          setState({
            isChecking: false,
            showModal: completion < minCompletion,
            completion,
          });
          return;
        }
      } catch (e) {
        // Invalid cache
      }
    }

    // Fetch profile
    patientService
      .getPatientProfileByUserId(user.id)
      .then((profile) => {
        const completion = patientService.calculateProfileCompletion(profile);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            completion,
            timestamp: Date.now(),
          })
        );

        setState({
          isChecking: false,
          showModal: completion < minCompletion,
          completion,
        });
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              completion: 0,
              timestamp: Date.now(),
            })
          );

          setState({
            isChecking: false,
            showModal: true,
            completion: 0,
          });
        } else {
          console.error("Profile check error:", error);
          setState({ isChecking: false, showModal: false, completion: 100 });
        }
      });
  }, [
    authLoading,
    isAuthenticated,
    user?.id,
    user?.role,
    location.pathname,
    minCompletion,
  ]);

  // Show loading
  if (authLoading || state.isChecking) {
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
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Modal for incomplete profile */}
      {state.showModal && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
          <div className="max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-navy-800">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                <svg
                  className="h-8 w-8 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Complete Your Profile
              </h3>
              <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
                Your profile is {state.completion}% complete
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Please complete your profile to access all features
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/auth/complete-patient-profile")}
                className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600"
              >
                Complete Profile Now
              </button>
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, showModal: false }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-navy-700"
              >
                Remind Me Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const clearProfileCompletionCache = (userId) => {
  localStorage.removeItem(`profile_check_${userId}`);
};

export default ProfileCompletionGuard;
