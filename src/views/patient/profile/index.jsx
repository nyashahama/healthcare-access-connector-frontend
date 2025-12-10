import React from "react";
import Card from "components/card";
import PatientBanner from "./components/PatientBanner";
import ContactInformation from "./components/ContactInformation";
import MyChildren from "./components/MyChildren";
import MedicalInformation from "./components/MedicalInformation";
import NotificationPreferences from "./components/NotificationPreferences";
import EmergencyContact from "./components/EmergencyContact";
import PrivacyData from "./components/PrivacyData";

const PatientProfile = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Banner Section */}
      <div className="mt-3 w-full">
        <PatientBanner />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-5 lg:col-span-2">
          <ContactInformation />
          <MyChildren />
          <MedicalInformation />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <EmergencyContact />
          <NotificationPreferences />
          <PrivacyData />
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
