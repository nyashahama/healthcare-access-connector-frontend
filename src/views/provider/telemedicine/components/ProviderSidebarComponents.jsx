import React from "react";
import Card from "components/card";
import { FaStethoscope, FaFileMedical } from "react-icons/fa";
import { MdSchedule, MdAssignment } from "react-icons/md";

export const ProviderQuickActionsCard = () => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Quick Actions
      </h4>
      <div className="space-y-3">
        <button
          onClick={() => (window.location.href = "/provider/patient-records")}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center">
            <FaFileMedical className="mr-3 text-brand-500" />
            <span>Patient Records</span>
          </div>
          <span>→</span>
        </button>
        <button
          onClick={() => (window.location.href = "/provider/schedule")}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center">
            <MdSchedule className="mr-3 text-green-500" />
            <span>My Schedule</span>
          </div>
          <span>→</span>
        </button>
        <button
          onClick={() => (window.location.href = "/provider/prescriptions")}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center">
            <MdAssignment className="mr-3 text-blue-500" />
            <span>Prescriptions Log</span>
          </div>
          <span>→</span>
        </button>
      </div>
    </Card>
  );
};

export const PrescriptionPadCard = ({ onIssuePrescription }) => {
  return (
    <Card extra="p-6">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Prescription Pad
        </h4>
        <FaStethoscope className="text-brand-500" />
      </div>
      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Issue a prescription to your active patient securely and electronically.
      </p>
      <button
        onClick={onIssuePrescription}
        className="linear w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
      >
        Issue Prescription
      </button>
    </Card>
  );
};
