import React from "react";
import Card from "components/card";

const PatientQueue = ({ patients, activePatient, onAcceptPatient }) => {
  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Patient Queue
        </h4>
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
          {patients.filter((p) => p.status === "waiting").length} waiting
        </span>
      </div>
      <div className="space-y-3">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition-all ${
              activePatient?.id === patient.id
                ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
                : "border-gray-200 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-700 dark:hover:border-brand-700"
            }`}
            onClick={() => onAcceptPatient(patient)}
          >
            <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-2xl dark:bg-navy-700">
              {patient.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h5 className="font-medium text-navy-700 dark:text-white">
                  {patient.name}
                </h5>
                <div className="flex items-center gap-2">
                  {patient.priority === "urgent" && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Urgent
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {patient.waitTime}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Age {patient.age} · {patient.chiefComplaint}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                {patient.medaidScheme}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PatientQueue;
