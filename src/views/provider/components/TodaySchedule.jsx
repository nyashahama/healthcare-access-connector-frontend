import React from "react";
import { MdAccessTime, MdPerson } from "react-icons/md";

const TodaySchedule = () => {
  const schedule = [
    {
      time: "09:00 AM",
      patient: "John Doe",
      reason: "Routine Check-up",
      status: "completed",
    },
    {
      time: "10:30 AM",
      patient: "Sarah Johnson",
      reason: "Fever & Cough",
      status: "completed",
    },
    {
      time: "12:00 PM",
      patient: "Michael Brown",
      reason: "Vaccination",
      status: "in-progress",
    },
    {
      time: "02:00 PM",
      patient: "Lisa Anderson",
      reason: "Follow-up Visit",
      status: "upcoming",
    },
    {
      time: "03:30 PM",
      patient: "Robert Wilson",
      reason: "Child Health",
      status: "upcoming",
    },
    {
      time: "05:00 PM",
      patient: "Emily Davis",
      reason: "Consultation",
      status: "upcoming",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "upcoming":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Today's Schedule
        </h5>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-brand-500">12</span> appointments
        </div>
      </div>

      <div className="space-y-3">
        {schedule.map((appointment, index) => (
          <div
            key={index}
            className="flex items-center rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex w-24 items-center text-sm font-medium text-navy-700 dark:text-white">
              <MdAccessTime className="mr-2 h-4 w-4" />
              {appointment.time}
            </div>

            <div className="ml-4 flex-1">
              <div className="flex items-center">
                <MdPerson className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                <span className="font-medium text-navy-700 dark:text-white">
                  {appointment.patient}
                </span>
              </div>
              <div className="ml-6 text-sm text-gray-600 dark:text-gray-300">
                {appointment.reason}
              </div>
            </div>

            <div className="ml-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            <button className="ml-4 text-sm font-medium text-brand-500 hover:text-brand-600">
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaySchedule;
