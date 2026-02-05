import React, { useState } from "react";
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

  const appointments = {
    upcoming: [
      {
        id: 1,
        type: "General Check-up",
        patient: "Sarah Johnson (Child)",
        date: "2024-01-16",
        time: "10:00 AM",
        clinic: "Community Health Clinic",
        clinicAddress: "123 Main St, Pretoria",
        doctor: "Dr. Sarah Johnson",
        specialty: "General Practitioner",
        status: "confirmed",
        reason: "6-month check-up and vaccinations",
        duration: "30 minutes",
        preparation: "Bring vaccination card and ID",
        phone: "+27 12 345 6789",
        appointmentType: "in-person",
      },
      {
        id: 2,
        type: "Follow-up",
        patient: "Sarah Johnson",
        date: "2024-12-20",
        time: "2:30 PM",
        clinic: "City Hospital",
        clinicAddress: "456 Hospital Rd, Pretoria",
        doctor: "Dr. Michael Smith",
        specialty: "Cardiologist",
        status: "confirmed",
        reason: "Follow-up on previous treatment",
        duration: "20 minutes",
        preparation: "Bring current medications",
        phone: "+27 12 987 6543",
        appointmentType: "in-person",
      },
      {
        id: 6,
        type: "Telemedicine",
        patient: "Sarah Johnson",
        date: "2024-12-18",
        time: "4:00 PM",
        clinic: "Virtual Consultation",
        clinicAddress: "Online",
        doctor: "Dr. Jane Williams",
        specialty: "General Practitioner",
        status: "confirmed",
        reason: "Prescription renewal consultation",
        duration: "15 minutes",
        meetingLink: "https://meet.clinic.com/abc123",
        appointmentType: "virtual",
      },
    ],
    past: [
      {
        id: 3,
        type: "Vaccination",
        patient: "Sarah Johnson (Child)",
        date: "2024-11-15",
        time: "11:00 AM",
        clinic: "Public Health Center",
        clinicAddress: "789 Health Ave, Pretoria",
        doctor: "Nurse Lerato Molefe",
        status: "completed",
        reason: "6-month vaccination",
        notes: "Vaccines administered: DTaP, Hib, PCV13",
        followUp: "Next due: 9 months",
        appointmentType: "in-person",
      },
      {
        id: 4,
        type: "Telemedicine",
        patient: "Sarah Johnson",
        date: "2024-11-10",
        time: "3:00 PM",
        clinic: "Virtual Consultation",
        clinicAddress: "Online",
        doctor: "Dr. Online Consultant",
        status: "completed",
        reason: "Cough and cold symptoms",
        notes: "Prescribed: Paracetamol, Rest",
        appointmentType: "virtual",
      },
    ],
    cancelled: [
      {
        id: 5,
        type: "Dental Check-up",
        patient: "Sarah Johnson",
        date: "2024-11-05",
        time: "9:00 AM",
        clinic: "Dental Clinic",
        clinicAddress: "321 Smile St, Pretoria",
        doctor: "Dr. Dental Expert",
        status: "cancelled",
        reason: "Schedule conflict",
        cancellationReason: "Unexpected work meeting",
        appointmentType: "in-person",
      },
    ],
  };

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

  const confirmReschedule = () => {
    setModalState({ ...modalState, reschedule: false });
    showToast("Appointment rescheduled successfully", "success");
  };

  const confirmCancel = () => {
    setModalState({ ...modalState, cancel: false });
    showToast("Appointment cancelled successfully", "success");
  };

  const handleBookNew = () => {
    window.location.href = "/patient/find-clinic";
  };

  const handlePrintAppointment = () => {
    showToast("Downloading appointment details...", "info");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const AppointmentCard = ({ appointment, showActions = true }) => {
    const isVirtual = appointment.appointmentType === "virtual";

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
                    {appointment.type}
                  </h5>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {appointment.patient}
                  </div>
                </div>
              </div>
            </div>
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status}
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
                    {new Date(appointment.date).toLocaleDateString("en-US", {
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
                    {appointment.time}
                  </div>
                </div>
                {appointment.duration && (
                  <>
                    <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                        Duration
                      </div>
                      <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                        {appointment.duration}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                <MdLocationOn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Location
                </div>
                <div className="mt-1 text-sm font-semibold text-navy-700 dark:text-white">
                  {appointment.clinic}
                </div>
                {appointment.clinicAddress && (
                  <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                    {appointment.clinicAddress}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Doctor
                </div>
                <div className="mt-1 text-sm font-semibold text-navy-700 dark:text-white">
                  {appointment.doctor}
                </div>
                {appointment.specialty && (
                  <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
                    {appointment.specialty}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reason */}
          {appointment.reason && (
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-navy-900">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Reason for visit
              </div>
              <div className="mt-1 text-sm text-navy-700 dark:text-white">
                {appointment.reason}
              </div>
            </div>
          )}

          {/* Virtual Meeting Link */}
          {isVirtual &&
            appointment.meetingLink &&
            appointment.status === "confirmed" && (
              <div className="mb-4 rounded-lg border-2 border-purple-200 bg-purple-50 p-3 dark:border-purple-800 dark:bg-purple-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MdVideocam className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                    <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">
                      Virtual Consultation
                    </span>
                  </div>
                  <a
                    href={appointment.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
                  >
                    Join Meeting
                  </a>
                </div>
              </div>
            )}

          {/* Notes for past appointments */}
          {appointment.status === "completed" && appointment.notes && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <div className="text-xs font-medium text-blue-800 dark:text-blue-300">
                Visit Notes
              </div>
              <div className="mt-1 text-sm text-blue-900 dark:text-blue-200">
                {appointment.notes}
              </div>
              {appointment.followUp && (
                <div className="mt-2 text-xs text-blue-700 dark:text-blue-400">
                  Follow-up: {appointment.followUp}
                </div>
              )}
            </div>
          )}

          {/* Preparation instructions for upcoming */}
          {appointment.status === "confirmed" && appointment.preparation && (
            <div className="mb-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-2">
                <MdWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
                <div>
                  <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                    Preparation Required
                  </div>
                  <div className="mt-1 text-sm text-yellow-900 dark:text-yellow-200">
                    {appointment.preparation}
                  </div>
                </div>
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
              {!isVirtual && (
                <button
                  onClick={() =>
                    window.open(
                      `https://maps.google.com/?q=${appointment.clinicAddress}`,
                      "_blank"
                    )
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  <MdDirections className="h-4 w-4" />
                  Directions
                </button>
              )}
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
                {selectedAppointment.type}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Patient
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.patient}
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
                      {selectedAppointment.status}
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
                    {new Date(selectedAppointment.date).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}{" "}
                    at {selectedAppointment.time}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MdLocationOn className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Location
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.clinic}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.clinicAddress}
                  </div>
                </div>
              </div>

              {selectedAppointment.phone && (
                <div className="flex items-start gap-3">
                  <MdPhone className="mt-1 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-500">
                      Contact
                    </div>
                    <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                      {selectedAppointment.phone}
                    </div>
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
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <MdCancel className="h-8 w-8 text-red-600 dark:text-red-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Cancel This Appointment?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Are you sure you want to cancel your appointment with{" "}
              {selectedAppointment?.doctor}?
            </p>
          </div>

          <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <MdWarning className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Please note:</strong> Cancellations less than 24 hours
                before the appointment may incur a fee. We recommend
                rescheduling instead.
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
              onClick={confirmCancel}
              className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={modalState.reschedule}
        onClose={() => setModalState({ ...modalState, reschedule: false })}
        title="Reschedule Appointment"
        size="md"
      >
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
                type="date"
                className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                New Time
              </label>
              <select className="w-full rounded-lg border-2 border-gray-300 px-4 py-2 focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800">
                <option>09:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
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
              onClick={confirmReschedule}
              className="flex-1 rounded-xl bg-purple-600 py-3 font-semibold text-white hover:bg-purple-700"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
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
                {appointments.upcoming.length}
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
                {appointments.past.length}
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
                {appointments.upcoming[0]
                  ? `${new Date(
                      appointments.upcoming[0].date
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
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
              placeholder="Search by doctor, clinic, or type..."
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
              <span className="ml-2 text-xs">({appointments[tab].length})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments[view].length === 0 ? (
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
          appointments[view].map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              showActions={view === "upcoming"}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default PatientAppointments;
