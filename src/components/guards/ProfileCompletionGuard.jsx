import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { usePatient } from "hooks/usePatient";

const ProfileCompletionGuard = ({ children, minCompletion = 50 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    patient,
    profileCompletion,
    loading: profileLoading,
    getCurrentPatientProfile,
  } = usePatient();

  useEffect(() => {
    if (isAuthenticated && user?.role === "patient") {
      getCurrentPatientProfile();
    }
  }, [getCurrentPatientProfile, isAuthenticated, user?.role]);

  if (authLoading || profileLoading) {
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

  if (!isAuthenticated || user?.role !== "patient") return children;

  const completion = patient ? profileCompletion : 0;
  const showModal = location.pathname !== "/auth/complete-patient-profile" && completion < minCompletion;

  return (
    <>
      {children}

      {showModal && (
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
                Your profile is {completion}% complete
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileCompletionGuard;
