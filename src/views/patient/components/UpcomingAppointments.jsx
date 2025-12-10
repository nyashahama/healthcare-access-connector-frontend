import React from "react";
import { MdCalendarToday, MdLocationOn } from "react-icons/md";

const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      patient: "Sarah M. (Child Check-up)",
      date: "Tomorrow, 10:00 AM",
      clinic: "Community Health Clinic",
      status: "confirmed",
    },
    {
      id: 2,
      patient: "Dr. Smith (Follow-up)",
      date: "Dec 20, 2:30 PM",
      clinic: "City Hospital",
      status: "confirmed",
    },
    {
      id: 3,
      patient: "Vaccination Appointment",
      date: "Dec 25, 11:00 AM",
      clinic: "Public Health Center",
      status: "pending",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Upcoming Appointments
        </h5>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <h6 className="font-bold text-navy-700 dark:text-white">
                  {appointment.patient}
                </h6>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdCalendarToday className="mr-2 h-4 w-4" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdLocationOn className="mr-2 h-4 w-4" />
                    {appointment.clinic}
                  </div>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  appointment.status === "confirmed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingAppointments;
