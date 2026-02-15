import React, { useState } from "react";
import Modal from "components/modal/Modal";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdInfo,
  MdWarning,
  MdCancel,
  MdPhone,
  MdEmail,
  MdDirections,
  MdPrint,
  MdDownload,
  MdVideocam,
} from "react-icons/md";

export const DetailsModal = ({
  isOpen,
  onClose,
  appointment,
  getStatusColor,
  getStatusDisplay,
}) => {
  if (!appointment) return null;

  const appointmentDate = new Date(appointment.appointment_datetime);
  const isVirtual =
    appointment.appointment_type === "virtual" ||
    (appointment.notes && appointment.notes.toLowerCase().includes("virtual"));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Appointment Details
            </h3>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(
                  appointment.status
                )}`}
              >
                {getStatusDisplay(appointment.status)}
              </span>
              {isVirtual && (
                <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                  <MdVideocam className="h-3 w-3" />
                  Virtual
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Provider Info */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
            <h4 className="mb-3 font-semibold text-navy-700 dark:text-white">
              Healthcare Provider
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Name:</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {appointment.doctor_name || "Not specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Clinic:</span>
                <span className="text-gray-700 dark:text-gray-300">
                  {appointment.clinic_name || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
            <h4 className="mb-3 font-semibold text-navy-700 dark:text-white">
              Date & Time
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MdCalendarToday className="h-5 w-5 text-brand-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {appointmentDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MdAccessTime className="h-5 w-5 text-green-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {appointmentDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          {!isVirtual && (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
              <h4 className="mb-3 font-semibold text-navy-700 dark:text-white">
                Location
              </h4>
              <div className="flex items-start gap-3">
                <MdLocationOn className="mt-1 h-5 w-5 text-red-500" />
                <span className="flex-1 text-gray-700 dark:text-gray-300">
                  {appointment.clinic_address || "Address not available"}
                </span>
              </div>
            </div>
          )}

          {/* Reason */}
          {appointment.reason_for_visit && (
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h4 className="mb-2 font-semibold text-blue-800 dark:text-blue-300">
                Reason for Visit
              </h4>
              <p className="text-blue-900 dark:text-blue-200">
                {appointment.reason_for_visit}
              </p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
              <h4 className="mb-2 font-semibold text-navy-700 dark:text-white">
                Notes
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {appointment.notes}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 p-3 font-medium transition-all hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-navy-600">
              <MdPhone className="h-5 w-5" />
              Call Clinic
            </button>
            <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 p-3 font-medium transition-all hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-navy-600">
              <MdEmail className="h-5 w-5" />
              Email
            </button>
            {!isVirtual && (
              <>
                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 p-3 font-medium transition-all hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-navy-600">
                  <MdDirections className="h-5 w-5" />
                  Directions
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 p-3 font-medium transition-all hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-navy-600">
                  <MdPrint className="h-5 w-5" />
                  Print
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const CancelModal = ({ isOpen, onClose, appointment, onConfirm }) => {
  const [reason, setReason] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <MdCancel className="text-2xl text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Cancel Appointment
          </h3>
        </div>

        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Are you sure you want to cancel your appointment with{" "}
          <span className="font-medium">{appointment?.doctor_name}</span> on{" "}
          <span className="font-medium">
            {new Date(appointment?.appointment_datetime).toLocaleDateString()}
          </span>
          ?
        </p>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reason for Cancellation (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            rows="4"
            placeholder="Let us know why you're cancelling..."
          />
        </div>

        <div className="rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <div className="flex items-start">
            <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              Please note: Frequent cancellations may affect your ability to
              book future appointments.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
          >
            Keep Appointment
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Cancel Appointment
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const RescheduleModal = ({
  isOpen,
  onClose,
  appointment,
  onConfirm,
  showToast,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <MdCalendarToday className="text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Reschedule Appointment
          </h3>
        </div>

        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Select a new date and time for your appointment with{" "}
          <span className="font-medium">{appointment?.doctor_name}</span>
        </p>

        <div className="mb-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Date
            </label>
            <input
              type="date"
              id="rescheduleDate"
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              New Time
            </label>
            <input
              type="time"
              id="rescheduleTime"
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            />
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="flex items-start">
            <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              The clinic will confirm your new appointment time via SMS or
              email.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-navy-700"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const date = document.getElementById("rescheduleDate")?.value;
              const time = document.getElementById("rescheduleTime")?.value;
              if (date && time) {
                onConfirm(date, time);
              } else {
                showToast("Please select both date and time", "warning");
              }
            }}
            className="flex-1 rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
          >
            Confirm Reschedule
          </button>
        </div>
      </div>
    </Modal>
  );
};
