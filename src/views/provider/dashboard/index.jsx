import React, { useState, useEffect } from "react";
import { useAuth } from "hooks/useAuth";
import { useProvider } from "hooks/useProvider";
import ClinicAdminDashboard from "./ClinicAdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import NurseDashboard from "./NurseDashboard";
import ManagerDashboard from "./ManagerDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";

/**
 * Main Provider Dashboard - Routes to role-specific dashboards
 * Determines user's staff role and renders appropriate dashboard
 */
const ProviderDashboard = () => {
  const { getCurrentUser } = useAuth();
  const { getClinics, loading: clinicsLoading } = useProvider();

  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [clinicId, setClinicId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);

        // Get current user
        const currentUser = getCurrentUser();
        if (!currentUser) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // Get user's clinics to determine role
        const { success, data, error: clinicsError } = await getClinics();

        if (!success || !data?.clinics || data.clinics.length === 0) {
          setError(clinicsError || "No clinic found for this user");
          setLoading(false);
          return;
        }

        // Get the first clinic (users typically belong to one clinic)
        const clinic = data.clinics[0];
        setClinicId(clinic.id);

        // Determine staff role from clinic data or user role
        // The clinic response should include the user's staff role
        const staffRole = currentUser?.role || "doctor";
        setUserRole(staffRole);

        setLoading(false);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
        setError("Failed to load dashboard");
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [getCurrentUser, getClinics]);

  if (loading || clinicsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="border-t-transparent mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-navy-700 dark:text-white">
            Unable to Load Dashboard
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Route to appropriate dashboard based on role
  const renderDashboard = () => {
    switch (userRole) {
      case "owner":
      case "admin":
        return <ClinicAdminDashboard clinicId={clinicId} />;

      case "manager":
      case "clinic_admin":
        return <ManagerDashboard clinicId={clinicId} />;

      case "doctor":
      case "provider_staff":
        return <DoctorDashboard clinicId={clinicId} />;

      case "nurse":
        return <NurseDashboard clinicId={clinicId} />;

      case "receptionist":
        return <ReceptionistDashboard clinicId={clinicId} />;

      default:
        return (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Unknown role: {userRole}. Please contact support.
            </p>
          </div>
        );
    }
  };

  return <div className="h-full">{renderDashboard()}</div>;
};

export default ProviderDashboard;
