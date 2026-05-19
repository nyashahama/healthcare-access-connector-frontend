import React, { useEffect } from "react";
import { useProvider } from "hooks/useProvider";
import ClinicBanner from "./components/ClinicBanner";
import ClinicInformation from "./components/ClinicInformation";
import OperatingHours from "./components/OperatingHours";
import ServicesOffered from "./components/ServicesOffered";
import MedicalStaff from "./components/MedicalStaff";
import Credentials from "./components/Credentials";
import AppointmentSettings from "./components/AppointmentSettings";
import PerformanceMetrics from "./components/PerformanceMetrics";

const ProviderProfile = () => {
  const { clinic, getMyClinic, loading } = useProvider();
  const clinicId = clinic?.id;

  useEffect(() => {
    getMyClinic();
  }, [getMyClinic]);

  if (loading || !clinicId) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="border-t-transparent h-12 w-12 animate-spin rounded-full border-4 border-brand-500" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      {/* Clinic Banner */}
      <div className="w-full">
        <ClinicBanner clinicId={clinicId} />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-3">
          {/* Left Column - Clinic Details */}
          <div className="space-y-5">
            <div className="h-fit">
              <ClinicInformation clinicId={clinicId} />
            </div>
            <div className="h-fit">
              <OperatingHours clinicId={clinicId} />
            </div>
            <div className="h-fit">
              <ServicesOffered clinicId={clinicId} />
            </div>
          </div>

          {/* Middle Column - Staff & Credentials */}
          <div className="space-y-5">
            <div className="h-fit">
              <MedicalStaff clinicId={clinicId} />
            </div>
            <div className="h-fit">
              <Credentials clinicId={clinicId} />
            </div>
          </div>

          {/* Right Column - Settings & Metrics */}
          <div className="space-y-5">
            <div className="h-fit">
              <AppointmentSettings />
            </div>
            <div className="h-fit">
              <PerformanceMetrics />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
