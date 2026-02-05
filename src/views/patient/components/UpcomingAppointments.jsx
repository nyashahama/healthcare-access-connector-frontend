import React, { useState } from "react";
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
} from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const UpcomingAppointments = () => {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalState, setModalState] = useState({
    details: false,
    edit: false,
    cancel: false,
  });
  const { showToast } = useToast();

  const appointments = [
    {
      id: 1,
      patient: "Sarah M. (Child Check-up)",
      date: "Tomorrow, 10:00 AM",
      time: "10:00 AM",
      dateFull: "2024-01-16",
      clinic: "Community Health Clinic",
      clinicAddress: "123 Health St, Johannesburg",
      doctor: "Dr. Sarah Johnson",
      specialty: "Pediatrician",
      reason: "6-month check-up and vaccinations",
      status: "confirmed",
      duration: "30 minutes",
      phone: "+27 12 345 6789",
      preparation: [
        "Bring vaccination card",
        "Fast for 2 hours if blood test needed",
        "Bring previous medical records",
      ],
    },
    {
      id: 2,
      patient: "Dr. Smith (Follow-up)",
      date: "Dec 20, 2:30 PM",
      time: "2:30 PM",
      dateFull: "2024-12-20",
      clinic: "City Hospital",
      clinicAddress: "456 Main Rd, Sandton",
      doctor: "Dr. Michael Smith",
      specialty: "Cardiologist",
      reason: "Follow-up on previous treatment",
      status: "confirmed",
      duration: "20 minutes",
      phone: "+27 12 987 6543",
      preparation: [
        "Bring current medications",
        "List of symptoms since last visit",
      ],
    },
    {
      id: 3,
      patient: "Vaccination Appointment",
      date: "Dec 25, 11:00 AM",
      time: "11:00 AM",
      dateFull: "2024-12-25",
      clinic: "Public Health Center",
      clinicAddress: "789 Public Ave, Randburg",
      doctor: "Nurse Lerato Molefe",
      specialty: "Pediatric Nursing",
      reason: "6-month vaccination schedule",
      status: "pending",
      duration: "45 minutes",
      phone: "+27 12 555 7890",
      preparation: [
        "Vaccination consent form",
        "Child's ID document",
        "Medical aid card",
      ],
    },
  ];

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

  const confirmCancel = () => {
    setModalState((prev) => ({ ...prev, cancel: false }));
    showToast(`Appointment cancelled successfully`, "success");
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
                {selectedAppointment.patient}
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
                {selectedAppointment.status}
              </span>
            </div>

            {/* Date & Time - Prominent */}
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-6 dark:from-brand-900/20 dark:to-purple-900/20">
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Date
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-700 dark:text-white">
                    {selectedAppointment.date}
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div className="text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Duration
                  </div>
                  <div className="mt-1 text-xl font-bold text-navy-700 dark:text-white">
                    {selectedAppointment.duration}
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MdLocationOn className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Location
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedAppointment.clinic}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedAppointment.clinicAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <MdAccessTime className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Healthcare Provider
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedAppointment.doctor}
                  </div>
                  {selectedAppointment.specialty && (
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedAppointment.specialty}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <MdInfo className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Reason for Visit
                  </div>
                  <div className="mt-1 text-sm text-navy-700 dark:text-white">
                    {selectedAppointment.reason}
                  </div>
                </div>
              </div>

              {selectedAppointment.phone && (
                <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                    <MdPhone className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Contact Number
                    </div>
                    <div className="mt-1 font-bold text-navy-700 dark:text-white">
                      {selectedAppointment.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preparation Instructions */}
            {selectedAppointment.preparation &&
              selectedAppointment.preparation.length > 0 && (
                <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="mb-4 flex items-center gap-2">
                    <MdNotifications className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                    <h5 className="font-bold text-blue-900 dark:text-blue-300">
                      Preparation Required
                    </h5>
                  </div>
                  <ul className="space-y-2">
                    {selectedAppointment.preparation.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <MdCheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm text-blue-900 dark:text-blue-200">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
              <button
                onClick={() =>
                  window.open(
                    `https://maps.google.com/?q=${selectedAppointment.clinicAddress}`,
                    "_blank"
                  )
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
              >
                <MdDirections className="h-5 w-5" />
                Get Directions
              </button>
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
                    {selectedAppointment.date}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Clinic
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.clinic}
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
                    {selectedAppointment.date}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Doctor
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.doctor}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Clinic
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedAppointment.clinic}
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
                <option>Other</option>
              </select>
            </div>

            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <MdWarning className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-500" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Cancellation Policy:</strong> Cancellations less than
                  24 hours in advance may result in a R150 fee.
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
              {appointments.length} appointment
              {appointments.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment, index) => (
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
                          {appointment.patient}
                        </h6>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          {appointment.reason}
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

                {/* Date & Time Banner */}
                <div className="mb-4 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                          Date & Time
                        </div>
                        <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                          {appointment.date}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                          Duration
                        </div>
                        <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                          {appointment.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                      <MdLocationOn className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Location
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                        {appointment.clinic}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                      <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Provider
                      </div>
                      <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                        {appointment.doctor}
                      </div>
                    </div>
                  </div>
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

        {appointments.length === 0 && (
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
          </div>
        )}
      </div>
    </>
  );
};

export default UpcomingAppointments;
