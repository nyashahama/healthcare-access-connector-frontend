import React, { useState, useEffect } from "react";
import {
  MdCalendarToday,
  MdAdd,
  MdFilterList,
  MdSearch,
  MdDownload,
  MdRefresh,
  MdWarning,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";
import TodaySchedule from "../components/TodaySchedule";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const Appointments = () => {
  const [view, setView] = useState("day");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");

  const { showToast } = useToast();

  // Modal states
  const [newAppointmentModalOpen, setNewAppointmentModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointmentStats, setAppointmentStats] = useState({
    today: 12,
    thisWeek: 48,
    cancellations: 3,
    noShows: 1,
  });

  const appointmentTypes = [
    { type: "Consultation", count: 24, color: "bg-blue-500" },
    { type: "Follow-up", count: 18, color: "bg-green-500" },
    { type: "Vaccination", count: 12, color: "bg-purple-500" },
    { type: "Check-up", count: 8, color: "bg-yellow-500" },
  ];

  const [upcomingAppointments, setUpcomingAppointments] = useState([
    {
      id: 1,
      patient: "John Doe",
      time: "10:00 AM",
      type: "Consultation",
      doctor: "Dr. Smith",
      status: "confirmed",
      patientId: "P00123",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "11:30 AM",
      type: "Vaccination",
      doctor: "Nurse Johnson",
      status: "confirmed",
      patientId: "P00124",
    },
    {
      id: 3,
      patient: "Michael Brown",
      time: "02:00 PM",
      type: "Follow-up",
      doctor: "Dr. Nkosi",
      status: "pending",
      patientId: "P00125",
    },
    {
      id: 4,
      patient: "Lisa Anderson",
      time: "03:30 PM",
      type: "Check-up",
      doctor: "Dr. Smith",
      status: "confirmed",
      patientId: "P00126",
    },
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: "",
    patientId: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    type: "consultation",
    doctor: "",
    reason: "",
    duration: "30",
  });

  const [rescheduleForm, setRescheduleForm] = useState({
    date: "",
    time: "",
    reason: "",
  });

  const refreshAppointments = () => {
    // Simulate API call
    setAppointmentStats({
      today: Math.floor(Math.random() * 20) + 5,
      thisWeek: Math.floor(Math.random() * 60) + 30,
      cancellations: Math.floor(Math.random() * 5),
      noShows: Math.floor(Math.random() * 3),
    });
    showToast("Appointments refreshed!", "success");
  };

  const handleAddAppointment = () => {
    if (
      !newAppointment.patientName ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      showToast("Please fill in required fields", "error");
      return;
    }

    console.log("Creating appointment:", newAppointment);
    setNewAppointmentModalOpen(false);
    showToast(
      `Appointment scheduled for ${newAppointment.patientName}!`,
      "success"
    );

    // Reset form
    setNewAppointment({
      patientName: "",
      patientId: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      type: "consultation",
      doctor: "",
      reason: "",
      duration: "30",
    });
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleForm({
      date: appointment.date || "",
      time: appointment.time || "",
      reason: "",
    });
    setRescheduleModalOpen(true);
  };

  const confirmReschedule = () => {
    console.log(
      `Rescheduling appointment:`,
      selectedAppointment,
      rescheduleForm
    );
    setRescheduleModalOpen(false);
    showToast(
      `Appointment rescheduled for ${rescheduleForm.date} at ${rescheduleForm.time}!`,
      "success"
    );

    // Reset form
    setRescheduleForm({
      date: "",
      time: "",
      reason: "",
    });
    setSelectedAppointment(null);
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    console.log(`Cancelling appointment:`, selectedAppointment);
    setCancelModalOpen(false);
    showToast(
      `Appointment for ${selectedAppointment.patient} has been cancelled.`,
      "warning"
    );
    setSelectedAppointment(null);
  };

  const exportAppointments = () => {
    showToast("Appointments exported successfully!", "success");
  };

  const handleStartAppointment = (id) => {
    alert(`Starting appointment ${id}`);
    // Navigate to consultation page or open chat
  };

  return (
    <div className="h-full">
      {/* Modals */}
      {/* New Appointment Modal */}
      <Modal
        isOpen={newAppointmentModalOpen}
        onClose={() => setNewAppointmentModalOpen(false)}
        title="Schedule New Appointment"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient Name *
              </label>
              <input
                type="text"
                value={newAppointment.patientName}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    patientName: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Patient ID (Optional)
              </label>
              <input
                type="text"
                value={newAppointment.patientId}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    patientId: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter patient ID"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={newAppointment.phone}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={newAppointment.email}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date *
              </label>
              <input
                type="date"
                value={newAppointment.date}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Time *
              </label>
              <select
                value={newAppointment.time}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    time: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="">Select time</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Appointment Type *
              </label>
              <select
                value={newAppointment.type}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="vaccination">Vaccination</option>
                <option value="check-up">Check-up</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Duration (minutes)
              </label>
              <select
                value={newAppointment.duration}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Visit
              </label>
              <textarea
                value={newAppointment.reason}
                onChange={(e) =>
                  setNewAppointment((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter reason for appointment"
                rows="3"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setNewAppointmentModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAppointment}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={rescheduleModalOpen}
        onClose={() => setRescheduleModalOpen(false)}
        title="Reschedule Appointment"
        size="md"
      >
        <div className="space-y-6">
          {selectedAppointment && (
            <>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h5 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
                  Current Appointment
                </h5>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedAppointment.patient} • {selectedAppointment.time} •{" "}
                  {selectedAppointment.type}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Date *
                  </label>
                  <input
                    type="date"
                    value={rescheduleForm.date}
                    onChange={(e) =>
                      setRescheduleForm((prev) => ({
                        ...prev,
                        date: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Time *
                  </label>
                  <select
                    value={rescheduleForm.time}
                    onChange={(e) =>
                      setRescheduleForm((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  >
                    <option value="">Select time</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reason for Rescheduling
                </label>
                <textarea
                  value={rescheduleForm.reason}
                  onChange={(e) =>
                    setRescheduleForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Optional: Add reason for rescheduling"
                  rows="3"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRescheduleModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReschedule}
                  className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
                >
                  Reschedule Appointment
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Cancel Appointment Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Appointment"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Cancel appointment for {selectedAppointment?.patient}?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This appointment will be cancelled and the time slot will become
                available for other patients.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                The patient will receive a cancellation notification via SMS and
                email.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Keep Appointment
            </button>
            <button
              onClick={confirmCancel}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Cancel Appointment
            </button>
          </div>
        </div>
      </Modal>
      {/* Header with updated button handlers */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Appointments
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and schedule patient appointments
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshAppointments}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
          <button className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
            <MdFilterList className="mr-2" />
            Filter
          </button>
          <button
            onClick={() => setNewAppointmentModalOpen(true)}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
          >
            <MdAdd className="mr-2" />
            New Appointment
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Today's Appointments</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {appointmentStats.today}
            </p>
            <span className="ml-2 text-sm font-medium text-green-600">+2</span>
          </div>
        </Card>

        <Card extra="p-4">
          <p className="text-sm text-gray-600">Scheduled This Week</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {appointmentStats.thisWeek}
            </p>
            <span className="ml-2 text-sm font-medium text-green-600">+8</span>
          </div>
        </Card>

        <Card extra="p-4">
          <p className="text-sm text-gray-600">Cancellations</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {appointmentStats.cancellations}
            </p>
            <span className="ml-2 text-sm font-medium text-red-600">-1</span>
          </div>
        </Card>

        <Card extra="p-4">
          <p className="text-sm text-gray-600">No-Shows</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {appointmentStats.noShows}
            </p>
            <span className="ml-2 text-sm font-medium text-gray-600">0</span>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Calendar & Today's Schedule */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    view === "day"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                  onClick={() => setView("day")}
                >
                  Day
                </button>
                <button
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    view === "week"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                  onClick={() => setView("week")}
                >
                  Week
                </button>
                <button
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    view === "month"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                  onClick={() => setView("month")}
                >
                  Month
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-navy-600 dark:bg-navy-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="flex items-center rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
                  <MdDownload className="mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Calendar View */}
            <div className="mb-6 rounded-lg border border-gray-200 p-4 dark:border-navy-600">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-bold text-navy-700 dark:text-white">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          selectedDate.setDate(selectedDate.getDate() - 1)
                        )
                      )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-600"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setSelectedDate(new Date())}
                    className="rounded-lg bg-gray-100 px-4 py-2 text-sm dark:bg-navy-600"
                  >
                    Today
                  </button>
                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          selectedDate.setDate(selectedDate.getDate() + 1)
                        )
                      )
                    }
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-600"
                  >
                    →
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div
                    key={index}
                    className="text-center text-sm font-medium text-gray-600"
                  >
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => (
                  <div
                    key={day}
                    className={`cursor-pointer rounded-lg p-2 text-center ${
                      day === selectedDate.getDate()
                        ? "bg-brand-500 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-navy-600"
                    }`}
                    onClick={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setDate(day);
                      setSelectedDate(newDate);
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                Today's Schedule
              </h4>
              <TodaySchedule />
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Appointments */}
          <Card extra="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Upcoming
              </h4>
              <span className="text-sm text-gray-600">Next 2 hours</span>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-navy-600"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium text-navy-700 dark:text-white">
                        {apt.patient}
                      </h5>
                      <p className="text-sm text-gray-600">
                        ID: {apt.patientId} • {apt.doctor}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        apt.status === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <MdCalendarToday className="mr-1 h-4 w-4" />
                      {apt.time}
                    </span>
                    <span className="text-gray-600">{apt.type}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleStartAppointment(apt.id)}
                      className="rounded-lg bg-brand-500 py-1.5 text-sm text-white hover:bg-brand-600"
                    >
                      Start
                    </button>
                    <button
                      onClick={() => handleReschedule(apt)}
                      className="rounded-lg border border-gray-300 py-1.5 text-sm hover:bg-gray-50 dark:border-navy-600"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(apt)}
                      className="rounded-lg border border-red-300 bg-red-50 py-1.5 text-sm text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Appointment Types Distribution */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Appointment Types
            </h4>
            <div className="space-y-3">
              {appointmentTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`mr-3 h-3 w-3 rounded-full ${type.color}`}
                    ></div>
                    <span className="text-sm text-gray-600">{type.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm font-medium">
                      {type.count}
                    </span>
                    <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(type.count / 62) * 100}%`,
                          backgroundColor: type.color.replace("bg-", ""),
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Quick Actions
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Auto-confirm</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Send reminders</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Allow walk-ins</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    defaultChecked
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                </label>
              </div>
            </div>
            <button className="linear mt-4 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
              Manage Settings
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
