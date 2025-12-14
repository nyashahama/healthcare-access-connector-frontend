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
      reason: "6-month check-up and vaccinations",
      status: "confirmed",
      duration: "30 minutes",
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
      reason: "Follow-up on previous treatment",
      status: "confirmed",
      duration: "20 minutes",
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
      reason: "6-month vaccination schedule",
      status: "pending",
      duration: "45 minutes",
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
    showToast(`Editing appointment for ${selectedAppointment.patient}`, "info");
    // Redirect to edit page or open edit form
    setTimeout(() => {
      window.location.href = `/patient/appointments/edit/${selectedAppointment.id}`;
    }, 1000);
  };

  const confirmCancel = () => {
    setModalState((prev) => ({ ...prev, cancel: false }));
    showToast(`Appointment cancelled successfully`, "warning");
    // Here you would typically make an API call to cancel the appointment
  };

  const handleViewAll = () => {
    showToast("Opening appointment calendar...", "info");
    setTimeout(() => {
      window.location.href = "/patient/appointments";
    }, 1000);
  };

  return (
    <>
      {/* Appointment Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState((prev) => ({ ...prev, details: false }))}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {selectedAppointment.patient}
                </h4>
                <div className="mt-1 flex items-center text-gray-600 dark:text-gray-300">
                  <MdCalendarToday className="mr-2 h-4 w-4" />
                  {selectedAppointment.date}
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  selectedAppointment.status === "confirmed"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {selectedAppointment.status}
              </span>
            </div>

            {/* Appointment Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Clinic</div>
                <div className="font-medium">{selectedAppointment.clinic}</div>
                <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MdLocationOn className="mr-1 h-3 w-3" />
                  {selectedAppointment.clinicAddress}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Doctor/Nurse</div>
                <div className="font-medium">{selectedAppointment.doctor}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Duration</div>
                <div className="font-medium">
                  {selectedAppointment.duration}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="text-sm text-gray-500">Reason</div>
                <div className="font-medium">{selectedAppointment.reason}</div>
              </div>
            </div>

            {/* Preparation Instructions */}
            {selectedAppointment.preparation && (
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preparation Instructions
                </h5>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <ul className="space-y-2">
                    {selectedAppointment.preparation.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <MdCheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, details: false }))
                }
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalState((prev) => ({
                    ...prev,
                    details: false,
                    edit: true,
                  }));
                }}
                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600"
              >
                Edit Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={modalState.edit}
        onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
        title="Edit Appointment"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <MdEdit className="h-8 w-8 text-blue-600 dark:text-blue-300" />
              </div>
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Edit Appointment
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Reschedule or change appointment details
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Date
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-navy-800"
                  defaultValue={selectedAppointment.dateFull}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Time
                </label>
                <select className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-navy-800">
                  <option>Morning (8am-12pm)</option>
                  <option>Afternoon (1pm-5pm)</option>
                  <option>Evening (after 5pm)</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason for Rescheduling
                </label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-navy-800"
                  rows="3"
                  placeholder="Please specify reason for rescheduling..."
                />
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Rescheduling less than 24 hours before the appointment may
                  incur a fee.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, edit: false }))
                }
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="rounded-lg bg-blue-500 px-6 py-2 font-medium text-white hover:bg-blue-600"
              >
                Request Change
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={modalState.cancel}
        onClose={() => setModalState((prev) => ({ ...prev, cancel: false }))}
        title="Cancel Appointment"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <MdCancel className="h-8 w-8 text-red-600 dark:text-red-300" />
              </div>
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Cancel Appointment?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                This will cancel your appointment with{" "}
                {selectedAppointment.doctor}
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Date</span>
                  <span className="font-medium">
                    {selectedAppointment.date}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Time</span>
                  <span className="font-medium">
                    {selectedAppointment.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">
                    Clinic
                  </span>
                  <span className="font-medium">
                    {selectedAppointment.clinic}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Cancellation *
              </label>
              <select className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-gray-600 dark:bg-navy-800">
                <option value="">Select a reason</option>
                <option>No longer needed</option>
                <option>Found alternative clinic</option>
                <option>Schedule conflict</option>
                <option>Transportation issue</option>
                <option>Other</option>
              </select>
            </div>

            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <div className="flex items-start">
                <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-red-600" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  <strong>Cancellation Policy:</strong> Cancellations less than
                  24 hours in advance may result in a R150 fee.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, cancel: false }))
                }
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Keep Appointment
              </button>
              <button
                onClick={confirmCancel}
                className="rounded-lg bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Main Component */}
      <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
        <div className="mb-4 flex items-center justify-between">
          <h5 className="text-lg font-bold text-navy-700 dark:text-white">
            Upcoming Appointments
          </h5>
          <button
            onClick={handleViewAll}
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            View All
          </button>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.005] hover:border-blue-500 dark:border-navy-700"
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
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <MdAccessTime className="mr-2 h-4 w-4" />
                      {appointment.duration}
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

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleViewDetails(appointment)}
                  className="flex-1 rounded-xl border border-gray-300 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:border-gray-600"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleEditAppointment(appointment)}
                  className="flex-1 rounded-xl border border-blue-300 bg-blue-50 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  <MdEdit className="mr-1 inline h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleCancelAppointment(appointment)}
                  className="flex-1 rounded-xl border border-red-300 bg-red-50 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                >
                  <MdCancel className="mr-1 inline h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UpcomingAppointments;
