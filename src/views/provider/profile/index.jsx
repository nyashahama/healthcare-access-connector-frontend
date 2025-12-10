// views/provider/profile/index.jsx
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
    <div className="flex w-full flex-col gap-5">
      {/* Clinic Banner */}
      <div className="mt-3 w-full">
        <ClinicBanner />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left Column - Clinic Details */}
        <div className="space-y-5">
          <ClinicInformation />
          <OperatingHours />
          <ServicesOffered />
        </div>

        {/* Middle Column - Staff & Credentials */}
        <div className="space-y-5">
          <MedicalStaff />
          <Credentials />
        </div>

        {/* Right Column - Settings & Metrics */}
        <div className="space-y-5">
          <AppointmentSettings />
          <PerformanceMetrics />
        </div>
      </div>
    </div>
  );
};

export default ProviderProfile;
