import React from "react";
import Card from "components/card";
import { FaStethoscope } from "react-icons/fa";
import { MdSchedule, MdPhone } from "react-icons/md";

export const QuickActionsCard = () => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Quick Actions
      </h4>
      <div className="space-y-3">
        <button
          onClick={() => (window.location.href = "/patient/symptom-checker")}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center">
            <FaStethoscope className="mr-3 text-brand-500" />
            <span>Symptom Checker</span>
          </div>
          <span>→</span>
        </button>
        <button
          onClick={() => (window.location.href = "/patient/find-clinic")}
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700"
        >
          <div className="flex items-center">
            <MdSchedule className="mr-3 text-green-500" />
            <span>Book Appointment</span>
          </div>
          <span>→</span>
        </button>
      </div>
    </Card>
  );
};

export const SMSAlternativeBanner = () => {
  return (
    <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
      <div className="flex items-start">
        <MdPhone className="mr-3 mt-1 h-5 w-5 text-purple-600 dark:text-purple-400" />
        <div>
          <p className="text-sm text-purple-800 dark:text-purple-300">
            <strong>Phone Consultation Available:</strong> Prefer to speak on
            the phone? Text "CALLBACK" to 12345 to schedule a phone consultation
            with a nurse.
          </p>
        </div>
      </div>
    </div>
  );
};
