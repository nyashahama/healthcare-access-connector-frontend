import React from "react";
import Card from "components/card";
import ClinicBanner from "./components/ClinicBanner";
import ClinicInformation from "./components/ClinicInformation";
import OperatingHours from "./components/OperatingHours";
import ServicesOffered from "./components/ServicesOffered";
import MedicalStaff from "./components/MedicalStaff";
import Credentials from "./components/Credentials";
import AppointmentSettings from "./components/AppointmentSettings";
import PerformanceMetrics from "./components/PerformanceMetrics";

const ProviderProfile = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* Clinic Banner */}
      <div className="w-full">
        <ClinicBanner />
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-3">
          {/* Left Column - Clinic Details */}
          <div className="space-y-5">
            <div className="h-fit">
              <ClinicInformation />
            </div>
            <div className="h-fit">
              <OperatingHours />
            </div>
            <div className="h-fit">
              <ServicesOffered />
            </div>
          </div>

          {/* Middle Column - Staff & Credentials */}
          <div className="space-y-5">
            <div className="h-fit">
              <MedicalStaff />
            </div>
            <div className="h-fit">
              <Credentials />
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
