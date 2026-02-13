import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import providerService from "api/services/providerService";

/**
 * ClinicRegistrationGuard - Shows modal instead of redirecting
 */
const ClinicRegistrationGuard = ({ children }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const location = useLocation();

  const [state, setState] = useState({
    isChecking: true,
    showModal: false,
  });

  const hasCheckedRef = useRef(false);
  const checkedUserIdRef = useRef(null);

  useEffect(() => {
    // Reset check if user changed (e.g., after logout/login)
    if (user?.id !== checkedUserIdRef.current) {
      hasCheckedRef.current = false;
      checkedUserIdRef.current = user?.id;
    }

    // Only check once per user
    if (hasCheckedRef.current) return;

    // Skip if on registration page
    if (location.pathname === "/provider/clinic-registration") {
      setState({ isChecking: false, showModal: false });
      hasCheckedRef.current = true;
      return;
    }

    if (authLoading) return;

    // Only for clinic_admin
    if (!user || user.role !== "clinic_admin") {
      setState({ isChecking: false, showModal: false });
      hasCheckedRef.current = true;
      return;
    }

    hasCheckedRef.current = true;

    // Check cache
    const cacheKey = `clinic_check_${user.id}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      try {
        const { hasClinic, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60000) {
          setState({
            isChecking: false,
            showModal: !hasClinic,
          });
          return;
        }
      } catch (e) {
        // Invalid cache
      }
    }

    // Fetch clinic
    providerService
      .getMyClinic()
      .then((response) => {
        const hasClinic = !!(response && (response.clinic || response.id));

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            hasClinic,
            timestamp: Date.now(),
          })
        );

        setState({
          isChecking: false,
          showModal: !hasClinic,
        });
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              hasClinic: false,
              timestamp: Date.now(),
            })
          );

          setState({
            isChecking: false,
            showModal: true,
          });
        } else {
          console.warn("Clinic check error:", error.message);
          setState({ isChecking: false, showModal: false });
        }
      });
  }, [authLoading, isAuthenticated, user?.id, user?.role, location.pathname]);

  // Show loading
  if (authLoading || state.isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-lightPrimary dark:bg-navy-900">
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
            Checking Clinic Status
          </h3>
        </div>
      </div>
    );
  }

  return (
    <>
      {children}

      {/* Modal for clinic registration */}
      {state.showModal && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 p-4">
          <div className="max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-navy-800">
            <div className="mb-4 text-center">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Register Your Clinic
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Please register your clinic to access provider features
              </p>
            </div>

            <button
              onClick={() => navigate("/provider/clinic-registration")}
              className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600"
            >
              Register Clinic Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const clearClinicRegistrationCache = (userId) => {
  localStorage.removeItem(`clinic_check_${userId}`);
};

export default ClinicRegistrationGuard;
