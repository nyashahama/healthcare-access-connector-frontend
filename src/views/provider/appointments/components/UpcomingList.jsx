import React from "react";
import { MdCalendarToday } from "react-icons/md";
import Card from "components/card";

const UpcomingList = ({ appointments, onStart, onReschedule, onCancel }) => {
  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Upcoming
        </h4>
        <span className="text-sm text-gray-600">Next 2 hours</span>
      </div>
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No upcoming appointments
          </p>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="rounded-lg border border-gray-200 p-3 dark:border-navy-600"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium text-navy-700 dark:text-white">
                    {apt.patient}
                  </h5>
                  <p className="text-sm text-gray-600">
                    ID: {apt.patientId} • {apt.doctor}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    apt.status === "confirmed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600">
                  <MdCalendarToday className="mr-1 h-4 w-4" />
                  {apt.time}
                </span>
                <span className="text-gray-600">{apt.type}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onStart(apt.id)}
                  className="rounded-lg bg-brand-500 py-1.5 text-sm text-white hover:bg-brand-600"
                >
                  Start
                </button>
                <button
                  onClick={() => onReschedule(apt)}
                  className="rounded-lg border border-gray-300 py-1.5 text-sm hover:bg-gray-50 dark:border-navy-600"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => onCancel(apt)}
                  className="col-span-2 rounded-lg border border-red-300 bg-red-50 py-1.5 text-sm text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default UpcomingList;
