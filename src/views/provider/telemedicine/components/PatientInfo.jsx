import React from "react";
import Card from "components/card";

const PatientInfo = ({ patient }) => {
  if (!patient) return null;

  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Patient Overview
      </h4>
      <div className="space-y-3">
        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <h5 className="font-medium text-blue-800 dark:text-blue-300">
            Current Complaint
          </h5>
          <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
            {patient.chiefComplaint}
          </p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
          <h5 className="mb-2 font-medium text-gray-800 dark:text-gray-300">
            Details
          </h5>
          <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <span className="font-medium">Age:</span> {patient.age}
            </li>
            <li>
              <span className="font-medium">Medical Aid:</span>{" "}
              {patient.medaidScheme}
            </li>
            <li>
              <span className="font-medium">Wait time:</span> {patient.waitTime}
            </li>
            <li>
              <span className="font-medium">Priority:</span>{" "}
              <span
                className={
                  patient.priority === "urgent"
                    ? "font-bold text-red-600 dark:text-red-400"
                    : "capitalize"
                }
              >
                {patient.priority}
              </span>
            </li>
          </ul>
        </div>
        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <h5 className="font-medium text-yellow-800 dark:text-yellow-300">
            Reminders
          </h5>
          <ul className="mt-2 space-y-1 text-sm text-yellow-700 dark:text-yellow-400">
            <li>• Check for known allergies before prescribing</li>
            <li>• Confirm medical aid authorisation if needed</li>
            <li>• Document all findings in patient records</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PatientInfo;
