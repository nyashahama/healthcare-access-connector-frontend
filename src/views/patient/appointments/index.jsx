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
} from "react-icons/md";
import { FaCalendarAlt, FaRegCalendarCheck } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const PatientAppointments = () => {
  const [view, setView] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalState, setModalState] = useState({
    details: false,
    edit: false,
    cancel: false,
    confirm: false,
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
        doctor: "Dr. Sarah Johnson",
        status: "confirmed",
        reason: "6-month check-up and vaccinations",
        duration: "30 minutes",
        preparation: "Bring vaccination card and ID",
      },
      {
        id: 2,
        type: "Follow-up",
        patient: "Sarah Johnson",
        date: "2024-12-20",
        time: "2:30 PM",
        clinic: "City Hospital",
        doctor: "Dr. Michael Smith",
        status: "confirmed",
        reason: "Follow-up on previous treatment",
        duration: "20 minutes",
        preparation: "Bring current medications",
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
        doctor: "Nurse Lerato Molefe",
        status: "completed",
        reason: "6-month vaccination",
        notes: "Vaccines administered: DTaP, Hib, PCV13",
        followUp: "Next due: 9 months",
      },
      {
        id: 4,
        type: "Telemedicine",
        patient: "Sarah Johnson",
        date: "2024-11-10",
        time: "3:00 PM",
        clinic: "Virtual Consultation",
        doctor: "Dr. Online Consultant",
        status: "completed",
        reason: "Cough and cold symptoms",
        notes: "Prescribed: Paracetamol, Rest",
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
        doctor: "Dr. Dental Expert",
        status: "cancelled",
        reason: "Schedule conflict",
        cancellationReason: "Unexpected work meeting",
      },
    ],
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, details: true });
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setModalState({ ...modalState, edit: true });
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
    showToast("Appointment cancelled", "warning");
  };

  const handleBookNew = () => {
    window.location.href = "/patient/find-clinic";
  };

  const AppointmentsList = ({ list }) => (
    <div className="space-y-4">
      {list.length === 0 ? (
        <Card extra="p-6 text-center">
          <FaRegCalendarCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
            No appointments found
          </h4>
          <button
            onClick={handleBookNew}
            className="linear mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            Book New Appointment
          </button>
        </Card>
      ) : (
        list.map((appointment) => (
          <Card
            key={appointment.id}
            extra="p-4 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-navy-700 dark:text-white">
                      {appointment.type}
                    </h5>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {appointment.patient}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      appointment.status === "confirmed"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : appointment.status === "completed"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <MdCalendarToday className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm">
                      {new Date(appointment.date).toLocaleDateString()} at{" "}
                      {appointment.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MdLocationOn className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm">{appointment.clinic}</span>
                  </div>
                  <div className="flex items-center">
                    <MdAccessTime className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="text-sm">Dr. {appointment.doctor}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Reason: </span>
                    <span>{appointment.reason}</span>
                  </div>
                </div>

                {view === "upcoming" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleViewDetails(appointment)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRescheduleAppointment(appointment)}
                      className="flex-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="flex-1 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Modal content similar to UpcomingAppointments component */}
            <div className="flex justify-end">
              <button
                onClick={() => setModalState({ ...modalState, details: false })}
                className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          My Appointments
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your healthcare appointments
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search appointments..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setModalState({ ...modalState, filter: true })}
            className="flex items-center rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300"
          >
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button
            onClick={handleBookNew}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            New Appointment
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-navy-700">
          {["upcoming", "past", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`flex-1 rounded-md py-2 text-sm font-medium capitalize transition-colors ${
                view === tab
                  ? "bg-white text-brand-500 shadow dark:bg-navy-800"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
              }`}
            >
              {tab} ({appointments[tab].length})
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      <AppointmentsList list={appointments[view]} />

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card extra="p-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-4 h-8 w-8 text-green-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Upcoming
              </div>
              <div className="text-2xl font-bold">
                {appointments.upcoming.length}
              </div>
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-center">
            <MdHistory className="mr-4 h-8 w-8 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Past Visits
              </div>
              <div className="text-2xl font-bold">
                {appointments.past.length}
              </div>
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-center">
            <MdCheckCircle className="mr-4 h-8 w-8 text-brand-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Next Appointment
              </div>
              <div className="text-lg font-bold">
                {appointments.upcoming[0]
                  ? `${new Date(
                      appointments.upcoming[0].date
                    ).toLocaleDateString()} at ${appointments.upcoming[0].time}`
                  : "None scheduled"}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PatientAppointments;
