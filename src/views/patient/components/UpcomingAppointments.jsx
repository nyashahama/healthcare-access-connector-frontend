import React, { useState, useEffect } from "react";
import {
  MdCalendarToday,
  MdLocationOn,
  MdEdit,
  MdCancel,
  MdInfo,
  MdWarning,
  MdCheckCircle,
  MdAccessTime,
  MdPhone,
  MdDirections,
  MdClose,
  MdNotifications,
  MdPerson,
} from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useAppointment } from "hooks/useAppointment";
import { usePatient } from "hooks/usePatient";

const UpcomingAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalState, setModalState] = useState({
    details: false,
    edit: false,
    cancel: false,
  });
  const { showToast } = useToast();
  const { patient } = usePatient();
  const {
    getAppointmentsByPatient,
    rescheduleAppointment,
    cancelAppointment,
    loading,
    error,
    appointments,
    clearError,
  } = useAppointment();

  // Load appointments on component mount
  useEffect(() => {
    if (patient?.user_id) {
      loadPatientAppointments();
    }
  }, [patient?.user_id]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [error]);

  const loadPatientAppointments = async () => {
    if (patient?.user_id) {
      await getAppointmentsByPatient(patient.user_id);
    }
  };

  // Filter for upcoming appointments (not cancelled and in future)
  const upcomingAppointments = appointments.filter((appointment) => {
    const now = new Date();
    const appointmentDate = new Date(appointment.appointment_datetime);
    const isUpcoming = appointmentDate > now;
    const isNotCancelled = appointment.status !== "cancelled";
    return isUpcoming && isNotCancelled;
  });

  // Sort by date (soonest first)
  const sortedAppointments = [...upcomingAppointments].sort((a, b) => {
    return new Date(a.appointment_datetime) - new Date(b.appointment_datetime);
  });

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState((prev) => ({ ...prev, details: true }));
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState((prev) => ({ ...prev, edit: true }));
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState((prev) => ({ ...prev, cancel: true }));
  };

  const confirmEdit = () => {
    setModalState((prev) => ({ ...prev, edit: false }));
    showToast(`Redirecting to edit appointment...`, "info");
    setTimeout(() => {
      window.location.href = `/patient/appointments/edit/${selectedAppointment.id}`;
    }, 1000);
  };

  const confirmCancel = async () => {
    if (!selectedAppointment) return;

    const result = await cancelAppointment(selectedAppointment.id, {
      cancellation_reason: "User requested cancellation",
      cancelled_by: patient?.user_id,
    });

    if (result.success) {
      setModalState((prev) => ({ ...prev, cancel: false }));
      showToast(`Appointment cancelled successfully`, "success");
      await loadPatientAppointments();
    }
  };

  const handleViewAll = () => {
    window.location.href = "/patient/appointments";
  };

  const getStatusColor = (status) => {
    if (status === "confirmed")
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    if (status === "pending")
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      case "completed":
        return "Completed";
      case "no_show":
        return "No Show";
      default:
        return status;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    // Check if it's tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format date without time
  const formatSimpleDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Get appointment duration (default 30 minutes)
  const getDuration = (appointment) => {
    // You might want to adjust this based on your data
    return "30 minutes";
  };

  return (
    <>
      {/* Appointment Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState((prev) => ({ ...prev, details: false }))}
        title=""
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
                <MdCalendarToday className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
                {selectedAppointment.patient_name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Appointment Details
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <span
                className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide ${getStatusColor(
                  selectedAppointment.status
                )}`}
              >
                {getStatusDisplay(selectedAppointment.status)}
              </span>
            </div>

            {/* Date & Time - Prominent */}
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-6 dark:from-brand-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Date & Time
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-700 dark:text-white">
                    {formatDate(selectedAppointment.appointment_datetime)}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Duration
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-700 dark:text-white">
                    {getDuration(selectedAppointment)}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MdPerson className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Patient Details
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedAppointment.patient_name}
                  </div>
                  {selectedAppointment.patient_phone && (
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedAppointment.patient_phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <MdInfo className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Reason for Visit
                  </div>
                  <div className="mt-1 text-sm text-navy-700 dark:text-white">
                    {selectedAppointment.reason_for_visit || "Not specified"}
                  </div>
                </div>
              </div>

              {selectedAppointment.patient_phone && (
                <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                    <MdPhone className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Contact Number
                    </div>
                    <div className="mt-1 font-bold text-navy-700 dark:text-white">
                      {selectedAppointment.patient_phone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Appointment ID for reference */}
            <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Appointment ID
              </div>
              <div className="mt-1 font-mono text-sm text-gray-700 dark:text-gray-300">
                {selectedAppointment.id}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, details: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Close
              </button>
              {selectedAppointment.clinic_id && (
                <button
                  onClick={() => {
                    // You might want to implement a clinic details page or directions
                    showToast("Clinic location details coming soon", "info");
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
                >
                  <MdDirections className="h-5 w-5" />
                  Get Directions
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={modalState.edit}
        onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
        title=""
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <MdEdit className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Reschedule Appointment
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Request a change to your appointment time
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current Date
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {formatDate(selectedAppointment.appointment_datetime)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reason
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.reason_for_visit || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <MdWarning className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Please note:</strong> Rescheduling less than 24 hours
                  before the appointment may incur a fee.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, edit: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
              >
                Continue
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={modalState.cancel}
        onClose={() => setModalState((prev) => ({ ...prev, cancel: false }))}
        title=""
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600">
                <MdCancel className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Cancel Appointment?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to cancel this appointment?
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Date</span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {formatDate(selectedAppointment.appointment_datetime)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Patient
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.patient_name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Reason
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.reason_for_visit || "Not specified"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reason for Cancellation *
              </label>
              <select className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800">
                <option value="">Select a reason</option>
                <option>No longer needed</option>
                <option>Found alternative clinic</option>
                <option>Schedule conflict</option>
                <option>Transportation issue</option>
                <option>Health improvement</option>
                <option>Other</option>
              </select>
            </div>

            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <MdWarning className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-500" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Cancellation Policy:</strong> Cancellations less than
                  24 hours in advance may result in a cancellation fee.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, cancel: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Component */}
      <div className="rounded-[20px] bg-white p-6 shadow-sm dark:bg-navy-800">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h5 className="text-xl font-bold text-navy-700 dark:text-white">
              Upcoming Appointments
            </h5>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {sortedAppointments.length} appointment
              {sortedAppointments.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            View All
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Loading appointments...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-xl bg-red-50 p-6 text-center dark:bg-red-900/20">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-800">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <h4 className="mb-2 text-lg font-bold text-red-800 dark:text-red-300">
              Error Loading Appointments
            </h4>
            <p className="text-red-700 dark:text-red-400">{error}</p>
            <button
              onClick={loadPatientAppointments}
              className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Appointments List */}
        {!loading && !error && (
          <div className="space-y-4">
            {sortedAppointments.map((appointment, index) => (
              <div
                key={appointment.id}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-brand-500 hover:shadow-lg dark:border-navy-700 dark:hover:border-brand-500"
              >
                {/* Gradient accent on hover */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

                {/* Background pattern */}
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-5">
                  <MdCalendarToday className="h-full w-full text-brand-500" />
                </div>

                <div className="relative">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
                          <MdCalendarToday className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h6 className="text-lg font-bold text-navy-700 dark:text-white">
                            {appointment.patient_name}
                          </h6>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {appointment.reason_for_visit || "Appointment"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {getStatusDisplay(appointment.status)}
                    </span>
                  </div>

                  {/* Date & Time Banner */}
                  <div className="mb-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                            Date & Time
                          </div>
                          <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                            {formatDate(appointment.appointment_datetime)}
                          </div>
                        </div>
                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div>
                          <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                            Duration
                          </div>
                          <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                            {getDuration(appointment)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                        <MdPerson className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Patient
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                          {appointment.patient_name}
                        </div>
                      </div>
                    </div>

                    {appointment.patient_phone && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                          <MdPhone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            Contact
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                            {appointment.patient_phone}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
                    >
                      <MdInfo className="h-4 w-4" />
                      Details
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      <MdEdit className="h-4 w-4" />
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                    >
                      <MdCancel className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && sortedAppointments.length === 0 && (
          <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-navy-700">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-navy-600">
              <MdCalendarToday className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
              No Upcoming Appointments
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any appointments scheduled
            </p>
            <button
              onClick={() => (window.location.href = "/patient/find-clinic")}
              className="mt-4 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              Book New Appointment
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UpcomingAppointments;
