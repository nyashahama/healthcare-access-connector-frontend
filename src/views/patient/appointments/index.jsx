import React, { useState, useEffect } from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdEdit,
  MdCancel,
  MdCheckCircle,
  MdWarning,
  MdHistory,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdPrint,
  MdDownload,
  MdPhone,
  MdEmail,
  MdDirections,
  MdInfo,
  MdClose,
  MdVideocam,
} from "react-icons/md";
import { FaCalendarAlt, FaRegCalendarCheck } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useAppointment } from "hooks/useAppointment";
import { usePatient } from "hooks/usePatient";

const PatientAppointments = () => {
  const [view, setView] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalState, setModalState] = useState({
    details: false,
    cancel: false,
    reschedule: false,
  });
  const { showToast } = useToast();

  const { patient } = usePatient();
  const {
    // Appointment CRUD Methods

    getAppointmentsByPatient,

    // Appointment Action Methods
    rescheduleAppointment,

    cancelAppointment,

    // Utility Methods

    clearError,

    // State
    loading,
    error,

    appointments,
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
      await getAppointmentsByPatient(patient?.user_id);
    }
  };

  // Categorize appointments based on status and date
  const categorizeAppointments = (allAppointments) => {
    const now = new Date();

    return {
      upcoming: allAppointments.filter((apt) => {
        const appointmentDate = new Date(apt.appointment_datetime);
        const isUpcoming = appointmentDate > now;
        const isConfirmed =
          apt.status === "confirmed" || apt.status === "pending";
        return isUpcoming && isConfirmed;
      }),
      past: allAppointments.filter((apt) => {
        const appointmentDate = new Date(apt.appointment_datetime);
        const isPast = appointmentDate <= now;
        const isCompleted =
          apt.status === "completed" || apt.status === "no_show";
        return isPast && isCompleted;
      }),
      cancelled: allAppointments.filter((apt) => apt.status === "cancelled"),
    };
  };

  const categorizedAppointments = categorizeAppointments(appointments);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, details: true });
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, cancel: true });
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, reschedule: true });
  };

  const confirmReschedule = async (newDate, newTime) => {
    if (!selectedAppointment) return;

    const appointmentDatetime = new Date(newDate);
    const [hours, minutes] = newTime.split(":");
    appointmentDatetime.setHours(parseInt(hours), parseInt(minutes));

    const result = await rescheduleAppointment(selectedAppointment.id, {
      appointment_date: newDate,
      appointment_time: newTime,
      appointment_datetime: appointmentDatetime.toISOString(),
    });

    if (result.success) {
      setModalState({ ...modalState, reschedule: false });
      showToast("Appointment rescheduled successfully", "success");
      await loadPatientAppointments();
    }
  };

  const confirmCancel = async (cancellationReason) => {
    if (!selectedAppointment) return;

    const result = await cancelAppointment(selectedAppointment.id, {
      cancellation_reason: cancellationReason,
      cancelled_by: patient?.user_id, // Assuming user.id is a UUID
    });

    if (result.success) {
      setModalState({ ...modalState, cancel: false });
      showToast("Appointment cancelled successfully", "success");
      await loadPatientAppointments();
    }
  };

  const handleBookNew = () => {
    window.location.href = "/patient/find-clinic";
  };

  const handlePrintAppointment = () => {
    showToast("Downloading appointment details...", "info");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "pending":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "no_show":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusDisplay = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending";
      case "confirmed":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      case "no_show":
        return "No Show";
      default:
        return status;
    }
  };

  console.log("patient: ", patient);
  console.log("appointments: ", appointments);

  const AppointmentCard = ({ appointment, showActions = true }) => {
    const isVirtual =
      appointment.appointment_type === "virtual" ||
      (appointment.notes &&
        appointment.notes.toLowerCase().includes("virtual"));
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
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    isVirtual
                      ? "bg-purple-100 dark:bg-purple-900"
                      : "bg-brand-100 dark:bg-brand-900"
                  }`}
                >
                  {isVirtual ? (
                    <MdVideocam className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                  ) : (
                    <MdCalendarToday className="h-6 w-6 text-brand-600 dark:text-brand-300" />
                  )}
                </div>
                <div>
                  <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                    {appointment.reason_for_visit || "Appointment"}
                  </h5>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {appointment.patient_name}
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

          {/* Date & Time - Prominent Display */}
          <div className="mb-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Date
                  </div>
                  <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                    {appointmentDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Time
                  </div>
                  <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                    {appointmentDate.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {appointment.clinic_name && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                  <MdLocationOn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Clinic
                  </div>
                  <div className="mt-1 text-sm font-semibold text-navy-700 dark:text-white">
                    {appointment.clinic_name}
                  </div>
                </div>
              </div>
            )}

            {appointment.doctor_name && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                  <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Doctor
                  </div>
                  <div className="mt-1 text-sm font-semibold text-navy-700 dark:text-white">
                    {appointment.doctor_name}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reason */}
          {appointment.reason_for_visit && (
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-navy-900">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Reason for visit
              </div>
              <div className="mt-1 text-sm text-navy-700 dark:text-white">
                {appointment.reason_for_visit}
              </div>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="text-xs font-medium text-blue-800 dark:text-blue-300">
                Notes
              </div>
              <div className="mt-1 text-sm text-blue-900 dark:text-blue-200">
                {appointment.notes}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && appointment.status === "confirmed" && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleViewDetails(appointment)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
              >
                <MdInfo className="h-4 w-4" />
                Details
              </button>
              <button
                onClick={() => handleRescheduleAppointment(appointment)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
              >
                <MdEdit className="h-4 w-4" />
                Reschedule
              </button>
              <button
                onClick={() => handleCancelAppointment(appointment)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
              >
                <MdCancel className="h-4 w-4" />
                Cancel
              </button>
            </div>
          )}

          {/* Download for past appointments */}
          {appointment.status === "completed" && (
            <button
              onClick={handlePrintAppointment}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
            >
              <MdDownload className="h-4 w-4" />
              Download Summary
            </button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="h-full">
      {/* Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-6 dark:from-brand-900/20 dark:to-purple-900/20">
              <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                {selectedAppointment.reason_for_visit || "Appointment"}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Patient
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.patient_name}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                        selectedAppointment.status
                      )}`}
                    >
                      {getStatusDisplay(selectedAppointment.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdCalendarToday className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Date & Time
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {new Date(
                      selectedAppointment.appointment_datetime
                    ).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    at{" "}
                    {new Date(
                      selectedAppointment.appointment_datetime
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>

              {selectedAppointment.clinic_name && (
                <div className="flex items-start gap-3">
                  <MdLocationOn className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Clinic
                    </div>
                    <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                      {selectedAppointment.clinic_name}
                    </div>
                  </div>
                </div>
              )}

              {selectedAppointment.patient_phone && (
                <div className="flex items-start gap-3">
                  <MdPhone className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Contact Phone
                    </div>
                    <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                      {selectedAppointment.patient_phone}
                    </div>
                  </div>
                </div>
              )}

              {selectedAppointment.patient_email && (
                <div className="flex items-start gap-3">
                  <MdEmail className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Email
                    </div>
                    <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                      {selectedAppointment.patient_email}
                    </div>
                  </div>
                </div>
              )}

              {selectedAppointment.notes && (
                <div className="border-t pt-4">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Notes
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-navy-700 dark:bg-navy-900 dark:text-white">
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}

              {selectedAppointment.cancellation_reason && (
                <div className="border-t pt-4">
                  <div className="mb-2 text-sm font-medium text-gray-500">
                    Cancellation Reason
                  </div>
                  <div className="rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {selectedAppointment.cancellation_reason}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalState({ ...modalState, details: false })}
                className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={modalState.cancel}
        onClose={() => setModalState({ ...modalState, cancel: false })}
        title="Cancel Appointment"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <MdCancel className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Cancel This Appointment?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to cancel your appointment for{" "}
                <strong>{selectedAppointment.reason_for_visit}</strong>?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Cancellation Reason
                </label>
                <textarea
                  id="cancellationReason"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  rows="3"
                  placeholder="Please provide a reason for cancellation..."
                />
              </div>

              <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <div className="flex items-start gap-3">
                  <MdWarning className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Please note:</strong> Cancellations less than 24
                    hours before the appointment may incur a fee. We recommend
                    rescheduling instead.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalState({ ...modalState, cancel: false })}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => {
                  const reason =
                    document.getElementById("cancellationReason")?.value;
                  if (reason) {
                    confirmCancel(reason);
                  } else {
                    showToast(
                      "Please provide a cancellation reason",
                      "warning"
                    );
                  }
                }}
                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalState.reschedule}
        onClose={() => setModalState({ ...modalState, reschedule: false })}
        title="Reschedule Appointment"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                <MdEdit className="h-8 w-8 text-purple-600 dark:text-purple-300" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Reschedule Appointment
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Choose a new date and time for your appointment
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  New Date
                </label>
                <input
                  id="rescheduleDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  New Time
                </label>
                <select
                  id="rescheduleTime"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState({ ...modalState, reschedule: false })
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const date = document.getElementById("rescheduleDate")?.value;
                  const time = document.getElementById("rescheduleTime")?.value;
                  if (date && time) {
                    confirmReschedule(date, time);
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
        )}
      </Modal>

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          My Appointments
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage and track all your healthcare appointments
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="mb-6 py-12 text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading appointments...
          </p>
        </div>
      )}

      {!loading && (
        <>
          {/* Quick Stats */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
                <FaCalendarAlt className="h-full w-full text-green-500" />
              </div>
              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
                  <FaCalendarAlt className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Upcoming
                  </div>
                  <div className="text-3xl font-bold text-navy-700 dark:text-white">
                    {categorizedAppointments.upcoming.length}
                  </div>
                </div>
              </div>
            </Card>

            <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
                <MdHistory className="h-full w-full text-blue-500" />
              </div>
              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                  <MdHistory className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Past Visits
                  </div>
                  <div className="text-3xl font-bold text-navy-700 dark:text-white">
                    {categorizedAppointments.past.length}
                  </div>
                </div>
              </div>
            </Card>

            <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
              <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
                <MdCheckCircle className="h-full w-full text-brand-500" />
              </div>
              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600">
                  <MdCheckCircle className="h-7 w-7 text-white" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Next Visit
                  </div>
                  <div className="text-sm font-bold text-navy-700 dark:text-white">
                    {categorizedAppointments.upcoming[0]
                      ? `${new Date(
                          categorizedAppointments.upcoming[0].appointment_datetime
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })} at ${new Date(
                          categorizedAppointments.upcoming[0].appointment_datetime
                        ).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`
                      : "None scheduled"}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="flex-1">
              <div className="relative">
                <MdSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by doctor, clinic, or reason..."
                  className="w-full rounded-xl border-2 border-gray-300 bg-white py-3 pl-12 pr-4 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:hover:bg-navy-700"
              >
                <MdFilterList className="h-5 w-5" />
                Filter
              </button>
              <button
                onClick={handleBookNew}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
              >
                <MdAdd className="h-5 w-5" />
                New Appointment
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="mb-6">
            <div className="inline-flex w-full rounded-xl bg-gray-100 p-1 dark:bg-navy-700 lg:w-auto">
              {["upcoming", "past", "cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setView(tab)}
                  className={`min-w-[140px] rounded-lg px-6 py-3 text-sm font-bold capitalize transition-all ${
                    view === tab
                      ? "bg-white text-brand-500 shadow-lg dark:bg-navy-800"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
                  }`}
                >
                  {tab}
                  <span className="ml-2 text-xs">
                    ({categorizedAppointments[tab].length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {categorizedAppointments[view].length === 0 ? (
              <Card extra="p-12 text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-navy-700">
                  <FaRegCalendarCheck className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                  No {view} appointments
                </h4>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  {view === "upcoming"
                    ? "You don't have any upcoming appointments scheduled"
                    : `No ${view} appointments found`}
                </p>
                <button
                  onClick={handleBookNew}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
                >
                  <MdAdd className="h-5 w-5" />
                  Book New Appointment
                </button>
              </Card>
            ) : (
              categorizedAppointments[view]
                .filter((appointment) => {
                  if (!searchQuery) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    appointment.patient_name?.toLowerCase().includes(query) ||
                    appointment.doctor_name?.toLowerCase().includes(query) ||
                    appointment.clinic_name?.toLowerCase().includes(query) ||
                    appointment.reason_for_visit?.toLowerCase().includes(query)
                  );
                })
                .map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    showActions={view === "upcoming"}
                  />
                ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PatientAppointments;
