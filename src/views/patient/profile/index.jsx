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
    <div className="flex h-full w-full flex-col">
      {/* Banner Section */}
      <div className="w-full">
        <PatientBanner />
      </div>

      {/* Main Content Grid - Use flex-1 to take remaining space */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-3">
          {/* Left Column */}
          <div className="space-y-5 lg:col-span-2">
            <div className="h-fit">
              <ContactInformation />
            </div>
            <div className="h-fit">
              <MyChildren />
            </div>
            <div className="h-fit">
              <MedicalInformation />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-5">
            <div className="h-fit">
              <EmergencyContact />
            </div>
            <div className="h-fit">
              <NotificationPreferences />
            </div>
            <div className="h-fit">
              <PrivacyData />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
