import { useToast } from "hooks/useToast";
import React, { useState, useEffect } from "react";
import { MdAccessTime, MdPerson, MdInfo, MdCheckCircle } from "react-icons/md";
import Modal from "components/modal/Modal";
import { useAppointment } from "hooks/useAppointment";
import { useAuth } from "hooks/useAuth";

const TodaySchedule = () => {
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const {
    todayAppointments,
    loading,
    getTodayAppointments,
    completeAppointment,
  } = useAppointment();

  const currentUser = getCurrentUser();
  const [viewDetailsModalOpen, setViewDetailsModalOpen] = useState(false);
  const [markCompleteModalOpen, setMarkCompleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Load today's appointments on mount
  useEffect(() => {
    if (currentUser?.clinic_id) {
      getTodayAppointments(currentUser.clinic_id);
    }
  }, [currentUser?.clinic_id, getTodayAppointments]);

  // Map database appointments to schedule format
  const schedule = React.useMemo(() => {
    return (todayAppointments || []).map((apt) => ({
      id: apt.id,
      time: apt.appointment_time || "N/A",
      patient: apt.patient_name || "Unknown Patient",
      reason: apt.reason_for_visit || "No reason provided",
      status: mapAppointmentStatus(apt.status),
      rawStatus: apt.status,
      patientPhone: apt.patient_phone,
      patientEmail: apt.patient_email,
      notes: apt.notes,
      confirmedBy: apt.confirmed_by,
      confirmedAt: apt.confirmed_at,
    }));
  }, [todayAppointments]);

  // Map database status to display status
  function mapAppointmentStatus(dbStatus) {
    switch (dbStatus) {
      case "completed":
        return "completed";
      case "confirmed":
      case "in-progress":
        return "in-progress";
      case "pending":
        return "upcoming";
      default:
        return "upcoming";
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDetailsModalOpen(true);
  };

  const handleMarkComplete = (appointment) => {
    setSelectedAppointment(appointment);
    setMarkCompleteModalOpen(true);
  };

  const confirmMarkComplete = async () => {
    if (!selectedAppointment?.id) return;

    const result = await completeAppointment(selectedAppointment.id);

    if (result.success) {
      setMarkCompleteModalOpen(false);
      showToast(
        `${selectedAppointment.patient} marked as complete!`,
        "success"
      );
      setSelectedAppointment(null);

      // Refresh today's appointments
      if (currentUser?.clinic_id) {
        getTodayAppointments(currentUser.clinic_id);
      }
    } else {
      showToast(result.error || "Failed to complete appointment", "error");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "upcoming":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      {/* View Details Modal */}
      <Modal
        isOpen={viewDetailsModalOpen}
        onClose={() => setViewDetailsModalOpen(false)}
        title="Appointment Details"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100">
                <MdPerson className="h-6 w-6 text-brand-600" />
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {selectedAppointment.patient}
                </h4>
                <p className="text-gray-600 dark:text-gray-300">
                  {selectedAppointment.time} • {selectedAppointment.reason}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    selectedAppointment.status
                  )}`}
                >
                  {selectedAppointment.rawStatus || selectedAppointment.status}
                </span>
              </div>
              {selectedAppointment.patientPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-medium">
                    {selectedAppointment.patientPhone}
                  </span>
                </div>
              )}
              {selectedAppointment.patientEmail && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">
                    {selectedAppointment.patientEmail}
                  </span>
                </div>
              )}
              {selectedAppointment.notes && (
                <div className="flex items-start justify-between">
                  <span className="text-gray-600">Notes</span>
                  <span className="max-w-xs text-right font-medium">
                    {selectedAppointment.notes}
                  </span>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedAppointment.status === "upcoming"
                    ? "This appointment is scheduled for later today."
                    : selectedAppointment.status === "in-progress"
                    ? "This appointment is currently in progress."
                    : "This appointment has been completed."}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setViewDetailsModalOpen(false)}
                className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Mark Complete Modal */}
      <Modal
        isOpen={markCompleteModalOpen}
        onClose={() => setMarkCompleteModalOpen(false)}
        title="Mark as Complete"
        size="md"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
                <MdCheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
            </div>

            <div className="text-center">
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Mark {selectedAppointment.patient} as complete?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                This will update the appointment status and free up the time
                slot.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setMarkCompleteModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmMarkComplete}
                className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              >
                Mark Complete
              </button>
            </div>
          </div>
        )}
      </Modal>
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Today's Schedule
        </h5>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-brand-500">{schedule.length}</span>{" "}
          appointments
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="py-8 text-center text-gray-600 dark:text-gray-300">
            Loading today's appointments...
          </div>
        ) : schedule.length === 0 ? (
          <div className="rounded-xl border border-gray-200 p-8 text-center dark:border-navy-700">
            <MdInfo className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-300">
              No appointments scheduled for today
            </p>
          </div>
        ) : (
          schedule.map((appointment, index) => (
            <div
              key={appointment.id || index}
              className="flex items-center rounded-xl border border-gray-200 p-4 dark:border-navy-700"
            >
              <div className="flex w-24 items-center text-sm font-medium text-navy-700 dark:text-white">
                <MdAccessTime className="mr-2 h-4 w-4" />
                {appointment.time}
              </div>

              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <MdPerson className="mr-2 h-4 w-4 text-gray-600 dark:text-gray-300" />
                  <span className="font-medium text-navy-700 dark:text-white">
                    {appointment.patient}
                  </span>
                </div>
                <div className="ml-6 text-sm text-gray-600 dark:text-gray-300">
                  {appointment.reason}
                </div>
              </div>

              <div className="ml-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    appointment.status
                  )}`}
                >
                  {appointment.status}
                </span>
              </div>

              <button
                onClick={() => handleViewDetails(appointment)}
                className="ml-4 text-sm font-medium text-brand-500 hover:text-brand-600"
              >
                View
              </button>
              {appointment.status === "in-progress" && (
                <button
                  onClick={() => handleMarkComplete(appointment)}
                  className="ml-2 text-sm font-medium text-green-500 hover:text-green-600"
                >
                  Complete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TodaySchedule;
