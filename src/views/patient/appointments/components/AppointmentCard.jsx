import React from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdEdit,
  MdCancel,
  MdPhone,
  MdEmail,
  MdDirections,
  MdVideocam,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";

const AppointmentCard = ({
  appointment,
  showActions = true,
  onViewDetails,
  onReschedule,
  onCancel,
  getStatusColor,
  getStatusDisplay,
}) => {
  const isVirtual =
    appointment.appointment_type === "virtual" ||
    (appointment.notes && appointment.notes.toLowerCase().includes("virtual"));
  const appointmentDate = new Date(appointment.appointment_datetime);

  return (
    <Card extra="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-brand-500">
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 opacity-5">
        <MdCalendarToday className="h-full w-full text-brand-500" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                {appointment.doctor_name || "Healthcare Provider"}
              </h4>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                  appointment.status
                )}`}
              >
                {getStatusDisplay(appointment.status)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {appointment.clinic_name || "Clinic"}
            </p>
          </div>
          {isVirtual && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <MdVideocam className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          )}
        </div>

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
            <MdCalendarToday className="h-5 w-5 text-brand-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Date
              </div>
              <div className="font-semibold text-navy-700 dark:text-white">
                {appointmentDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
            <MdAccessTime className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Time
              </div>
              <div className="font-semibold text-navy-700 dark:text-white">
                {appointmentDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>

          {!isVirtual && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-navy-700 md:col-span-2">
              <MdLocationOn className="h-5 w-5 text-red-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Location
                </div>
                <div className="font-semibold text-navy-700 dark:text-white">
                  {appointment.clinic_address || "Address not available"}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Reason */}
        {appointment.reason_for_visit && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div className="flex items-start gap-2">
              <MdInfo className="mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300">
                  Reason for Visit
                </div>
                <div className="mt-1 text-sm text-blue-900 dark:text-blue-200">
                  {appointment.reason_for_visit}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewDetails(appointment)}
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-600"
          >
            <MdInfo className="h-4 w-4" />
            View Details
          </button>

          {showActions && (
            <>
              <button
                onClick={() => onReschedule(appointment)}
                className="flex items-center gap-2 rounded-lg border-2 border-purple-500 bg-white px-4 py-2 text-sm font-semibold text-purple-500 transition-all hover:bg-purple-50 dark:bg-navy-800 dark:hover:bg-purple-900/20"
              >
                <MdEdit className="h-4 w-4" />
                Reschedule
              </button>

              <button
                onClick={() => onCancel(appointment)}
                className="flex items-center gap-2 rounded-lg border-2 border-red-500 bg-white px-4 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 dark:bg-navy-800 dark:hover:bg-red-900/20"
              >
                <MdCancel className="h-4 w-4" />
                Cancel
              </button>
            </>
          )}

          {!isVirtual && (
            <button className="ml-auto flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-300 dark:hover:bg-navy-700">
              <MdDirections className="h-4 w-4" />
              Directions
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AppointmentCard;
