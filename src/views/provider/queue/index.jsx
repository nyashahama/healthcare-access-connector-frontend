import React, { useState, useEffect } from "react";
import {
  MdTimer,
  MdPeople,
  MdHistory,
  MdFilterList,
  MdDownload,
  MdRefresh,
  MdAdd,
  MdClose,
  MdCheckCircle,
  MdWarning,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import PatientQueue from "../components/PatientQueue";

const Queue = () => {
  const [queueStats, setQueueStats] = useState({
    totalWaiting: 12,
    avgWaitTime: "18 min",
    completedToday: 24,
  });

  const [queueFilters, setQueueFilters] = useState([
    { label: "All", count: 12, active: true },
    { label: "High Priority", count: 3, active: false },
    { label: "Telemedicine", count: 4, active: false },
    { label: "Walk-ins", count: 5, active: false },
    { label: "My Patients", count: 6, active: false },
  ]);

  const [addPatientModalOpen, setAddPatientModalOpen] = useState(false);
  const [clearQueueModalOpen, setClearQueueModalOpen] = useState(false);
  const [callNextModalOpen, setCallNextModalOpen] = useState(false);
  const [markAllSeenModalOpen, setMarkAllSeenModalOpen] = useState(false);
  const { showToast } = useToast();

  const [newPatient, setNewPatient] = useState({
    name: "",
    phone: "",
    reason: "",
    priority: "medium",
    type: "walk-in",
    estimatedTime: "15",
  });

  const handleFilterClick = (index) => {
    const updatedFilters = queueFilters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
    setQueueFilters(updatedFilters);
  };

  const refreshQueue = () => {
    setQueueStats({
      totalWaiting: Math.floor(Math.random() * 20) + 1,
      avgWaitTime: `${Math.floor(Math.random() * 30) + 5} min`,
      completedToday: Math.floor(Math.random() * 30) + 10,
    });
    showToast("Queue data refreshed!", "success");
  };

  const exportQueue = () => {
    showToast("Queue exported successfully!", "success");
  };

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.reason) {
      showToast("Please fill in required fields", "error");
      return;
    }

    console.log("Adding patient:", newPatient);
    setAddPatientModalOpen(false);
    showToast(`${newPatient.name} added to queue!`, "success");

    // Reset form
    setNewPatient({
      name: "",
      phone: "",
      reason: "",
      priority: "medium",
      type: "walk-in",
      estimatedTime: "15",
    });
  };

  const handleClearQueue = () => {
    console.log("Clearing queue...");
    setClearQueueModalOpen(false);
    showToast("Queue cleared successfully!", "success");
  };

  const handleCallNext = () => {
    console.log("Calling next patient...");
    setCallNextModalOpen(false);
    showToast("Next patient called!", "success");
  };

  const handleMarkAllSeen = () => {
    console.log("Marking all as seen...");
    setMarkAllSeenModalOpen(false);
    showToast("All patients marked as seen!", "success");
  };

  const handleFormChange = (field, value) => {
    setNewPatient((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="h-full">
      {/* Modals */}
      {/* Add Patient Modal */}
      <Modal
        isOpen={addPatientModalOpen}
        onClose={() => setAddPatientModalOpen(false)}
        title="Add Patient to Queue"
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
                value={newPatient.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reason for Visit *
              </label>
              <input
                type="text"
                value={newPatient.reason}
                onChange={(e) => handleFormChange("reason", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Fever, Consultation, Follow-up"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Priority *
              </label>
              <select
                value={newPatient.priority}
                onChange={(e) => handleFormChange("priority", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Visit Type *
              </label>
              <select
                value={newPatient.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="walk-in">Walk-in</option>
                <option value="appointment">Appointment</option>
                <option value="telemedicine">Telemedicine</option>
                <option value="follow-up">Follow-up</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Estimated Wait Time (min)
              </label>
              <input
                type="number"
                value={newPatient.estimatedTime}
                onChange={(e) =>
                  handleFormChange("estimatedTime", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="15"
                min="5"
                max="120"
              />
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                The patient will receive an SMS notification with their queue
                number and estimated wait time.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddPatientModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPatient}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Add to Queue
            </button>
          </div>
        </div>
      </Modal>

      {/* Clear Queue Modal */}
      <Modal
        isOpen={clearQueueModalOpen}
        onClose={() => setClearQueueModalOpen(false)}
        title="Clear Queue"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Clear All Patients from Queue?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This will remove all waiting patients from the queue. Patients
                will need to check-in again.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setClearQueueModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleClearQueue}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Clear Queue
            </button>
          </div>
        </div>
      </Modal>

      {/* Call Next Patient Modal */}
      <Modal
        isOpen={callNextModalOpen}
        onClose={() => setCallNextModalOpen(false)}
        title="Call Next Patient"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
              <MdPeople className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
          </div>

          <div className="text-center">
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Call Next Patient?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This will notify the next patient in line to proceed to the
              consultation room.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Patient will receive an SMS notification and their status will
                update in the system.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCallNextModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleCallNext}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Call Next Patient
            </button>
          </div>
        </div>
      </Modal>

      {/* Mark All Seen Modal */}
      <Modal
        isOpen={markAllSeenModalOpen}
        onClose={() => setMarkAllSeenModalOpen(false)}
        title="Mark All as Seen"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900">
              <MdCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Mark All Patients as Seen?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This will update the status of all patients in the queue to
                "Seen" and move them to history.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setMarkAllSeenModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleMarkAllSeen}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              Mark All as Seen
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Patient Queue
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and monitor patient waiting times
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshQueue}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
          <button
            onClick={exportQueue}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
          >
            <MdDownload className="mr-2" />
            Export List
          </button>
          <button
            onClick={() => setAddPatientModalOpen(true)}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
          >
            <MdAdd className="mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* ... existing stats cards ... */}
      </div>

      {/* Queue Filters */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Filter Queue
          </h4>
          <div className="flex items-center text-sm text-gray-600">
            <MdFilterList className="mr-1" />
            Sort by:
            <select className="bg-transparent ml-2 rounded-lg border border-gray-300 p-1 text-sm dark:border-navy-600">
              <option>Priority</option>
              <option>Wait Time</option>
              <option>Name</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {queueFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(index)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter.active
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
              }`}
            >
              {filter.label}
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {filter.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Queue Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Queue */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Active Queue
              </h4>
              <select className="rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-navy-600 dark:bg-navy-700">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <PatientQueue />
          </Card>
        </div>

        {/* Queue Controls */}
        <div>
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Queue Controls
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h5 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
                  Queue Settings
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Auto-assign Patients
                    </span>
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
                    <span className="text-sm text-gray-600">
                      Send Wait Time Updates
                    </span>
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
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                <h5 className="mb-2 font-medium text-navy-700 dark:text-white">
                  Quick Actions
                </h5>
                <div className="space-y-2">
                  <button
                    onClick={() => setCallNextModalOpen(true)}
                    className="linear w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
                  >
                    Call Next Patient
                  </button>
                  <button
                    onClick={() => setMarkAllSeenModalOpen(true)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
                  >
                    Mark All as Seen
                  </button>
                  <button
                    onClick={() => setClearQueueModalOpen(true)}
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
                  >
                    Clear Queue
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <h5 className="mb-2 font-medium text-yellow-800 dark:text-yellow-300">
                  Queue Status
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Wait Time</span>
                    <span className="font-medium">18 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Longest Wait</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Staff Available</span>
                    <span className="font-medium text-green-600">3/4</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Queue;
