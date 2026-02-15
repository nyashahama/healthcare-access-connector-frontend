import React from "react";
import { IoMdMedical } from "react-icons/io";

const HealthProfileCard = ({ patient, onViewProfile }) => {
  if (!patient) return null;

  const profileItems = [];

  if (patient.blood_type) {
    profileItems.push({
      label: "Blood Type",
      value: patient.blood_type,
    });
  }

  if (patient.allergies) {
    profileItems.push({
      label: "Allergies",
      value: `${patient.allergies.split(",").length} recorded`,
    });
  }

  if (patient.medications) {
    profileItems.push({
      label: "Medications",
      value: `${patient.medications.split(",").length} active`,
    });
  }

  return (
    <div className="rounded-[20px] bg-gradient-to-r from-green-500 to-teal-400 p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="text-xl font-bold">Health Profile</h5>
          <p className="mt-2 text-green-100">
            Your health information at a glance
          </p>
        </div>
        <IoMdMedical className="h-12 w-12 opacity-80" />
      </div>
      {profileItems.length > 0 && (
        <div className="mt-4 space-y-2">
          {profileItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.label}</span>
              <span className="font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={onViewProfile}
        className="linear mt-4 w-full rounded-xl bg-white py-3 font-medium text-green-600 transition duration-200 hover:bg-gray-100"
      >
        View Full Profile
      </button>
    </div>
  );
};

export default HealthProfileCard;
