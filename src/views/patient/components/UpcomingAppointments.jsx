import React, { useMemo, useState } from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdPhone,
  MdDirections,
  MdNotifications,
  MdEmail,
  MdCheckCircle,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";

/**
 * UpcomingAppointments - Patient-focused view
 * Shows appointments with basic info and allows viewing details
 *
 * Note: To avoid infinite loops, this component doesn't automatically fetch
 * related data. Instead, clinic/staff data should be passed in via props
 * or fetched when the user clicks "View Details"
 */
const UpcomingAppointments = ({
  appointments = [],
  onViewDetails, // Callback to fetch full details when needed
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Filter and format upcoming appointments
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (appointments || [])
      .filter((apt) => {
        const appointmentDate = parseLocalDate(apt.appointment_date);
        if (!appointmentDate) return false;
        appointmentDate.setHours(0, 0, 0, 0);

        return (
          appointmentDate >= today && // Include today
          apt.status !== "cancelled" &&
          apt.status !== "completed"
        );
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
      )
      .slice(0, 5) // Show next 5 appointments
      .map((apt) => ({
        ...apt,
        formattedDate: formatDate(apt.appointment_date),
        formattedTime: formatTime(apt.appointment_time),
        daysUntil: getDaysUntil(apt.appointment_date),
        isToday: isToday(apt.appointment_date),
        isTomorrow: isTomorrow(apt.appointment_date),
      }));
  }, [appointments]);

  // Date-only strings (YYYY-MM-DD) are parsed as UTC midnight by the JS spec,
  // which shifts the displayed date by one day in UTC- timezones. Appending
  // T00:00:00 forces the engine to treat it as local time instead.
  function parseLocalDate(str) {
    if (!str) return null;
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(str)
      ? `${str}T00:00:00`
      : str;
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }

  function formatDate(isoString) {
    if (!isoString) return "N/A";
    const date = parseLocalDate(isoString);
    if (!date) return "N/A";
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(timeString) {
    if (!timeString) return "N/A";
    // appointment_time is a time-only string (HH:MM:SS); prefix a dummy date
    // so the Date constructor produces a valid object in all browsers.
    const d = new Date(`1970-01-01T${timeString}`);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDateTime(isoString) {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  function getDaysUntil(isoString) {
    const appointmentDate = parseLocalDate(isoString);
    if (!appointmentDate) return null;
    const today = new Date();
    appointmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = appointmentDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  function isToday(isoString) {
    const appointmentDate = parseLocalDate(isoString);
    if (!appointmentDate) return false;
    const today = new Date();
    appointmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  }

  function isTomorrow(isoString) {
    const appointmentDate = parseLocalDate(isoString);
    if (!appointmentDate) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDate.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === tomorrow.getTime();
  }

  const handleViewDetails = (apt) => {
    setSelectedAppointment(apt);
    setDetailsModalOpen(true);
    // Call callback if provided to fetch additional details
    if (onViewDetails) {
      onViewDetails(apt);
    }
  };

  const getTimingBadge = (apt) => {
    if (apt.isToday) {
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 dark:bg-red-900 dark:text-red-300">
          TODAY
        </span>
      );
    }
    if (apt.isTomorrow) {
      return (
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800 dark:bg-orange-900 dark:text-orange-300">
          TOMORROW
        </span>
      );
    }
    if (apt.daysUntil !== null && apt.daysUntil <= 7) {
      return (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
          in {apt.daysUntil} day{apt.daysUntil !== 1 ? "s" : ""}
        </span>
      );
    }
    return null;
  };

  return (
    <>
      {/* Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Timing Alert */}
            {selectedAppointment.isToday && (
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                <div className="flex items-start">
                  <MdNotifications className="mr-2 mt-0.5 h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-800 dark:text-red-300">
                      Your appointment is TODAY
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      Please arrive 15 minutes early at{" "}
                      {selectedAppointment.formattedTime}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date & Time
                </label>
                <p className="text-lg font-semibold text-navy-700 dark:text-white">
                  {selectedAppointment.formattedDate}
                </p>
                <p className="font-medium text-brand-500">
                  {selectedAppointment.formattedTime}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Reason for Visit
                </label>
                <p className="text-base text-navy-700 dark:text-white">
                  {selectedAppointment.reason_for_visit ||
                    "General Consultation"}
                </p>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Notes
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedAppointment.notes}
                  </p>
                </div>
              )}

              {/* Confirmation Info */}
              {selectedAppointment.confirmed_at && (
                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                  <div className="flex items-start">
                    <MdCheckCircle className="mr-2 mt-0.5 h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800 dark:text-green-300">
                        Appointment Confirmed
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-400">
                        on {formatDateTime(selectedAppointment.confirmed_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment ID for reference */}
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Appointment ID: {selectedAppointment.id.slice(0, 8)}...
              </p>
            </div>

            {/* What to Bring */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
              <h4 className="mb-2 font-semibold text-navy-700 dark:text-white">
                What to Bring
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li>• Your ID document</li>
                <li>• Medical aid card (if applicable)</li>
                <li>• Any current medication</li>
                <li>• Previous medical records (if first visit)</li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="flex-1 rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Card */}
      <Card extra="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Your Upcoming Appointments
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Next scheduled visits
            </p>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {upcomingAppointments.length > 0
              ? `${upcomingAppointments.length} scheduled`
              : "None scheduled"}
          </span>
        </div>

        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center dark:border-navy-600">
              <MdCalendarToday className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400">
                You have no upcoming appointments
              </p>
              <button className="mt-4 rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600">
                Book an Appointment
              </button>
            </div>
          ) : (
            upcomingAppointments.map((apt) => (
              <div
                key={apt.id}
                className={`rounded-lg border p-4 transition-all hover:shadow-md ${
                  apt.isToday
                    ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/10"
                    : "border-gray-200 bg-white dark:border-navy-600 dark:bg-navy-800"
                }`}
              >
                {/* Header with timing badge */}
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <MdCalendarToday className="h-5 w-5 text-brand-500" />
                      <h5 className="font-semibold text-navy-700 dark:text-white">
                        {apt.reason_for_visit || "General Consultation"}
                      </h5>
                    </div>
                    <p className="ml-7 text-sm text-gray-600 dark:text-gray-400">
                      Appointment #{apt.id.slice(0, 8)}
                    </p>
                  </div>
                  {getTimingBadge(apt)}
                </div>

                {/* Date and Time */}
                <div className="mb-3 ml-7 space-y-1">
                  <div className="flex items-center text-sm">
                    <MdCalendarToday className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="font-medium text-navy-700 dark:text-white">
                      {apt.formattedDate}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MdAccessTime className="mr-2 h-4 w-4 text-gray-600" />
                    <span className="font-medium text-brand-500">
                      {apt.formattedTime}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                {apt.status === "confirmed" && apt.confirmed_at && (
                  <div className="mb-3 ml-7 flex items-center text-xs text-green-600 dark:text-green-400">
                    <MdCheckCircle className="mr-1 h-4 w-4" />
                    <span>Confirmed</span>
                  </div>
                )}

                {/* Action Button */}
                <div className="ml-7">
                  <button
                    onClick={() => handleViewDetails(apt)}
                    className="w-full rounded-lg bg-brand-500 py-2 text-sm font-medium text-white hover:bg-brand-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
};

export default UpcomingAppointments;
