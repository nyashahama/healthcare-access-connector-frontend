import React, { useMemo, useState } from "react";
import {
  MdCalendarToday,
  MdPerson,
  MdPhone,
  MdNote,
  MdCheckCircle,
  MdAccessTime,
} from "react-icons/md";
import Card from "components/card";

/**
 * UpcomingList - Provider/Doctor-focused view
 * Shows appointments with emphasis on clinical workflow and patient management
 */
const UpcomingList = ({
  appointments = [],
  onStart,
  onReschedule,
  onCancel,
}) => {
  const [expandedId, setExpandedId] = useState(null);

  // Filter and format upcoming appointments for providers
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
        patientEmail: apt.patient_email,
        time: formatDateTime(apt.appointment_datetime),
        date: apt.appointment_date,
        type: apt.reason_for_visit || "Consultation",
        status: apt.status,
        notes: apt.notes,
        daysUntil: getDaysUntil(apt.appointment_date),
        isUrgent: isUrgent(apt),
        checkedIn: apt.status === "checked_in",
        rawAppointment: apt,
      }));
  }, [appointments]);

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

  function isUrgent(apt) {
    // Mark as urgent if notes contain urgent keywords
    const urgentKeywords = ["urgent", "emergency", "asap", "priority"];
    const notes = (apt.notes || "").toLowerCase();
    return urgentKeywords.some((keyword) => notes.includes(keyword));
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Upcoming Appointments
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Next scheduled patients
          </p>
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-600 dark:bg-brand-900 dark:text-brand-300">
          {upcomingAppointments.length}
        </span>
      </div>

      <div className="space-y-3">
        {upcomingAppointments.length === 0 ? (
          <div className="rounded-lg border border-gray-200 p-6 text-center dark:border-navy-600">
            <MdCheckCircle className="mx-auto mb-2 h-10 w-10 text-green-500" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No upcoming appointments
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              You're all caught up!
            </p>
          </div>
        ) : (
          upcomingAppointments.map((apt) => (
            <div
              key={apt.id}
              className={`rounded-lg border p-3 transition-all ${
                apt.isUrgent
                  ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10"
                  : "border-gray-200 bg-white dark:border-navy-600 dark:bg-navy-800"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <MdPerson className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <button
                      onClick={() => toggleExpand(apt.id)}
                      className="text-left font-semibold text-navy-700 hover:text-brand-500 dark:text-white"
                    >
                      {apt.patient}
                    </button>
                    {apt.isUrgent && (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        URGENT
                      </span>
                    )}
                    {apt.checkedIn && (
                      <span className="rounded-full bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
                        CHECKED IN
                      </span>
                    )}
                  </div>
                  <p className="ml-6 text-xs text-gray-600 dark:text-gray-400">
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

              {/* Appointment Time & Days Until */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MdCalendarToday className="mr-1 h-3.5 w-3.5" />
                  <span>{apt.time}</span>
                </div>
                {apt.daysUntil !== null && (
                  <span className="font-medium text-brand-500">
                    {apt.daysUntil === 1
                      ? "Tomorrow"
                      : `in ${apt.daysUntil} days`}
                  </span>
                )}
              </div>

              {/* Expanded Details */}
              {expandedId === apt.id && (
                <div className="mt-3 space-y-2 border-t border-gray-200 pt-3 dark:border-navy-600">
                  {apt.patientPhone && (
                    <div className="flex items-center text-xs">
                      <MdPhone className="mr-2 h-4 w-4 text-gray-600" />
                      <a
                        href={`tel:${apt.patientPhone}`}
                        className="text-brand-500 hover:underline"
                      >
                        {apt.patientPhone}
                      </a>
                    </div>
                  )}
                  {apt.notes && (
                    <div className="flex items-start text-xs">
                      <MdNote className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-gray-600" />
                      <p className="text-gray-600 dark:text-gray-400">
                        {apt.notes}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              {onStart && onReschedule && onCancel && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onStart(apt.id)}
                    disabled={apt.daysUntil > 1}
                    className={`rounded-lg py-1.5 text-sm font-medium text-white transition-colors ${
                      apt.daysUntil > 1
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-brand-500 hover:bg-brand-600"
                    }`}
                    title={
                      apt.daysUntil > 1
                        ? "Can only start appointments within 24 hours"
                        : ""
                    }
                  >
                    {apt.daysUntil > 1 ? (
                      <>
                        <MdAccessTime className="mr-1 inline h-4 w-4" />
                        Not Ready
                      </>
                    ) : (
                      "Start"
                    )}
                  </button>
                  <button
                    onClick={() => onReschedule(apt.rawAppointment)}
                    className="rounded-lg border border-gray-300 py-1.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => onCancel(apt.rawAppointment)}
                    className="col-span-2 rounded-lg border border-red-300 bg-red-50 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Cancel Appointment
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
