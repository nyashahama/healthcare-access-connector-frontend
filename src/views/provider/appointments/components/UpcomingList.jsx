import React, { useMemo } from "react";
import { MdCalendarToday, MdPerson } from "react-icons/md";
import Card from "components/card";

const UpcomingList = ({
  appointments = [],
  onStart,
  onReschedule,
  onCancel,
}) => {
  // Filter and format upcoming appointments (exclude today and past, exclude completed/cancelled)
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (appointments || [])
      .filter((apt) => {
        const appointmentDate = new Date(apt.appointment_date);
        appointmentDate.setHours(0, 0, 0, 0);
        // Only show future appointments (after today)
        return (
          appointmentDate > today &&
          apt.status !== "cancelled" &&
          apt.status !== "completed"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
      )
      .slice(0, 10) // Show next 10 appointments
      .map((apt) => ({
        id: apt.id,
        patient: apt.patient_name || "Unknown Patient",
        patientId: apt.patient_id,
        patientPhone: apt.patient_phone,
        doctor: "Clinic Staff", // You can customize this
        time: formatDateTime(apt.appointment_datetime),
        date: apt.appointment_date,
        type: apt.reason_for_visit || "Consultation",
        status: apt.status,
        daysUntil: getDaysUntil(apt.appointment_date),
        rawAppointment: apt,
      }));
  }, [appointments]);

  // Format date and time together
  function formatDateTime(isoString) {
    if (!isoString) return "N/A";
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return "N/A";
    }
  }

  // Get days until appointment
  function getDaysUntil(isoString) {
    if (!isoString) return null;
    try {
      const appointmentDate = new Date(isoString);
      const today = new Date();
      appointmentDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = appointmentDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  }

  console.log("UpcomingList - all appointments:", appointments);
  console.log("UpcomingList - filtered upcoming:", upcomingAppointments);

  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Upcoming Appointments
        </h4>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {upcomingAppointments.length > 0
            ? `Next ${upcomingAppointments.length}`
            : "None scheduled"}
        </span>
      </div>
      <div className="space-y-4">
        {upcomingAppointments.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No upcoming appointments
          </p>
        ) : (
          upcomingAppointments.map((apt) => (
            <div
              key={apt.id}
              className="rounded-lg border border-gray-200 p-3 dark:border-navy-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <MdPerson className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <h5 className="font-medium text-navy-700 dark:text-white">
                      {apt.patient}
                    </h5>
                  </div>
                  <p className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                    {apt.type}
                  </p>
                </div>
                <div className="flex flex-col items-end">
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
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="flex items-center text-gray-600 dark:text-gray-400">
                  <MdCalendarToday className="mr-1 h-4 w-4" />
                  {apt.time}
                </span>
                {apt.daysUntil !== null && (
                  <span className="text-xs font-medium text-brand-500">
                    in {apt.daysUntil} day{apt.daysUntil !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {onStart && onReschedule && onCancel && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onStart(apt.id)}
                    className="rounded-lg bg-brand-500 py-1.5 text-sm text-white hover:bg-brand-600"
                  >
                    Start
                  </button>
                  <button
                    onClick={() => onReschedule(apt.rawAppointment)}
                    className="rounded-lg border border-gray-300 py-1.5 text-sm hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onCancel(apt.rawAppointment)}
                    className="col-span-2 rounded-lg border border-red-300 bg-red-50 py-1.5 text-sm text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default UpcomingList;
