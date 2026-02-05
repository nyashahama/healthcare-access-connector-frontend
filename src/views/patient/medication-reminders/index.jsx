import React, { useState } from "react";
import {
  MdNotifications,
  MdAccessTime,
  MdCalendarToday,
  MdAdd,
  MdEdit,
  MdDelete,
  MdCheckCircle,
  MdWarning,
  MdVolumeUp,
  MdPhone,
  MdEmail,
  MdInfo,
  MdClose,
  MdArrowBack,
  MdArrowForward,
  MdLocalHospital,
} from "react-icons/md";
import { FaBell, FaPills, FaMobileAlt } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const MedicationReminders = () => {
  const [reminders, setReminders] = useState([
    {
      id: 1,
      medication: "Amoxicillin 250mg",
      dosage: "5ml",
      frequency: "Every 8 hours",
      times: ["08:00", "16:00", "00:00"],
      startDate: "2024-01-10",
      endDate: "2024-01-20",
      method: "sms",
      active: true,
      lastTaken: "2024-01-15 16:00",
    },
    {
      id: 2,
      medication: "Paracetamol 500mg",
      dosage: "1 tablet",
      frequency: "Every 6 hours",
      times: ["06:00", "12:00", "18:00", "00:00"],
      startDate: "2024-01-15",
      endDate: "2024-01-18",
      method: "push",
      active: true,
      lastTaken: "2024-01-15 18:00",
    },
    {
      id: 3,
      medication: "Vitamin D Drops",
      dosage: "0.5ml",
      frequency: "Daily",
      times: ["08:00"],
      startDate: "2024-01-01",
      endDate: "2024-03-01",
      method: "email",
      active: true,
      lastTaken: "2024-01-15 08:00",
    },
  ]);

  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    delete: false,
    settings: false,
    details: false,
  });
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const { showToast } = useToast();

  const steps = [
    { number: 1, title: "Medication", icon: MdAdd },
    { number: 2, title: "Schedule", icon: MdAccessTime },
    { number: 3, title: "Confirm", icon: MdCheckCircle },
  ];

  const handleViewDetails = (reminder) => {
    setSelectedReminder(reminder);
    setModalState((prev) => ({ ...prev, details: true }));
  };

  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setModalState((prev) => ({ ...prev, edit: true }));
  };

  const handleDeleteReminder = (reminder) => {
    setSelectedReminder(reminder);
    setModalState((prev) => ({ ...prev, delete: true }));
  };

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? { ...reminder, active: !reminder.active }
          : reminder
      )
    );
    showToast("Reminder updated", "success");
  };

  const confirmDelete = () => {
    setReminders(reminders.filter((r) => r.id !== selectedReminder.id));
    setModalState((prev) => ({ ...prev, delete: false }));
    showToast("Reminder deleted", "warning");
  };

  const markAsTaken = (id) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setReminders(
      reminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              lastTaken: `${now.toISOString().split("T")[0]} ${timeString}`,
            }
          : reminder
      )
    );
    showToast("Medication marked as taken", "success");
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const confirmAddReminder = () => {
    setModalState((prev) => ({ ...prev, add: false }));
    setCurrentStep(1);
    showToast("Medication reminder added successfully!", "success");
  };

  const confirmEditReminder = () => {
    setModalState((prev) => ({ ...prev, edit: false }));
    showToast("Reminder updated successfully!", "success");
  };

  const confirmSettingsUpdate = () => {
    setModalState((prev) => ({ ...prev, settings: false }));
    showToast("Notification settings updated", "success");
  };

  const handleViewAll = () => {
    window.location.href = "/patient/medication-reminders";
  };

  const getMethodIcon = (method) => {
    if (method === "sms") return FaMobileAlt;
    if (method === "push") return FaBell;
    return MdEmail;
  };

  const getMethodColor = (method) => {
    if (method === "sms") return "text-green-600 dark:text-green-400";
    if (method === "push") return "text-blue-600 dark:text-blue-400";
    return "text-purple-600 dark:text-purple-400";
  };

  const getMethodBgColor = (method) => {
    if (method === "sms") return "bg-green-100 dark:bg-green-900";
    if (method === "push") return "bg-blue-100 dark:bg-blue-900";
    return "bg-purple-100 dark:bg-purple-900";
  };

  return (
    <>
      {/* Add Reminder Modal */}
      <Modal
        isOpen={modalState.add}
        onClose={() => {
          setModalState((prev) => ({ ...prev, add: false }));
          setCurrentStep(1);
        }}
        title=""
        size="lg"
      >
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
              <MdAdd className="h-8 w-8 text-white" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Add Medication Reminder
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Set up a new medication schedule
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        currentStep >= step.number
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-navy-800"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <MdCheckCircle className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <div
                        className={`text-xs font-semibold ${
                          currentStep >= step.number
                            ? "text-brand-500"
                            : "text-gray-400"
                        }`}
                      >
                        Step {step.number}
                      </div>
                      <div
                        className={`text-xs ${
                          currentStep >= step.number
                            ? "font-medium text-navy-700 dark:text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 transition-all ${
                        currentStep > step.number
                          ? "bg-brand-500"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Medication Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Amoxicillin 250mg"
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Dosage *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 5ml or 1 tablet"
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Frequency *
                  </label>
                  <select className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800">
                    <option>Daily</option>
                    <option>Every 6 hours</option>
                    <option>Every 8 hours</option>
                    <option>Every 12 hours</option>
                    <option>Weekly</option>
                    <option>As needed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Instructions (Optional)
                </label>
                <textarea
                  placeholder="Any special instructions..."
                  className="h-24 w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    End Date *
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reminder Times *
                </label>
                <div className="space-y-2">
                  {["08:00", "12:00", "16:00", "20:00"].map((time) => (
                    <label
                      key={time}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-gray-200 p-3 transition-colors hover:border-brand-300 dark:border-gray-700"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <div className="flex-1 font-medium text-navy-700 dark:text-white">
                        {time}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Notification Method *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 p-4 transition-all hover:border-green-500 dark:border-green-700 dark:bg-green-900/20">
                    <FaMobileAlt className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold">SMS</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 p-4 transition-all hover:border-blue-500 dark:border-blue-700 dark:bg-blue-900/20">
                    <FaBell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold">Push</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 p-4 transition-all hover:border-purple-500 dark:border-purple-700 dark:bg-purple-900/20">
                    <MdEmail className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <span className="text-sm font-semibold">Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
                <div className="text-center">
                  <MdCheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h5 className="mt-2 font-bold text-navy-700 dark:text-white">
                    Review Your Reminder
                  </h5>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Please review the details below
                  </p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Medication
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    Amoxicillin 250mg
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Dosage
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    5ml • Every 8 hours
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Schedule
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    08:00, 16:00, 00:00
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Duration
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    Jan 10 - Jan 20, 2024
                  </span>
                </div>
              </div>

              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <MdInfo className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    You'll receive reminders via SMS 10 minutes before each
                    scheduled time.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {currentStep > 1 ? (
              <button
                onClick={handleBackStep}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Back
              </button>
            ) : (
              <button
                onClick={() => {
                  setModalState((prev) => ({ ...prev, add: false }));
                  setCurrentStep(1);
                }}
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={confirmAddReminder}
                className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              >
                Save Reminder
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Edit Reminder Modal */}
      <Modal
        isOpen={modalState.edit}
        onClose={() => setModalState((prev) => ({ ...prev, edit: false }))}
        title=""
        size="lg"
      >
        {selectedReminder && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <MdEdit className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Edit Medication Reminder
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Update your medication schedule
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Medication Name
                </label>
                <input
                  type="text"
                  defaultValue={selectedReminder.medication}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Dosage
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedReminder.dosage}
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Frequency
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedReminder.frequency}
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Reminder Times (comma separated)
                </label>
                <input
                  type="text"
                  defaultValue={selectedReminder.times.join(", ")}
                  className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Start Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedReminder.startDate}
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    End Date
                  </label>
                  <input
                    type="date"
                    defaultValue={selectedReminder.endDate}
                    className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
                  />
                </div>
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
                onClick={confirmEditReminder}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modalState.delete}
        onClose={() => setModalState((prev) => ({ ...prev, delete: false }))}
        title=""
        size="md"
      >
        {selectedReminder && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600">
                <MdDelete className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Delete Reminder?
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Are you sure you want to delete this medication reminder?
              </p>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Medication
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedReminder.medication}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Dosage
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedReminder.dosage} • {selectedReminder.frequency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Times
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedReminder.times.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="flex items-start gap-3">
                <MdWarning className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-500" />
                <p className="text-sm text-red-800 dark:text-red-300">
                  <strong>Note:</strong> This action cannot be undone. All
                  reminder notifications for this medication will be stopped.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, delete: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Keep Reminder
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={modalState.settings}
        onClose={() => setModalState((prev) => ({ ...prev, settings: false }))}
        title=""
        size="md"
      >
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
              <MdNotifications className="h-8 w-8 text-white" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Notification Settings
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Customize how you receive reminders
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="mb-3 font-semibold text-navy-700 dark:text-white">
                Default Notification Method
              </h5>
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 p-3 transition-all hover:border-green-500 dark:border-green-700 dark:bg-green-900/20">
                  <FaMobileAlt className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold">SMS</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 p-3 transition-all hover:border-blue-500 dark:border-blue-700 dark:bg-blue-900/20">
                  <FaBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-semibold">Push</span>
                </button>
                <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 p-3 transition-all hover:border-purple-500 dark:border-purple-700 dark:bg-purple-900/20">
                  <MdEmail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-semibold">Email</span>
                </button>
              </div>
            </div>

            <div>
              <h5 className="mb-3 font-semibold text-navy-700 dark:text-white">
                Reminder Preferences
              </h5>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-navy-700 dark:text-white">
                      Sound Alerts
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Play sound with notifications
                    </div>
                  </div>
                  <div className="relative h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600">
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"></span>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-navy-700 dark:text-white">
                      Early Reminders
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Notify 10 minutes before scheduled time
                    </div>
                  </div>
                  <div className="relative h-6 w-11 rounded-full bg-green-500">
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white transition-transform"></span>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                  <div>
                    <div className="font-medium text-navy-700 dark:text-white">
                      Missed Dose Alerts
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Alert if medication not taken within 30 minutes
                    </div>
                  </div>
                  <div className="relative h-6 w-11 rounded-full bg-green-500">
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white transition-transform"></span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, settings: false }))
              }
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmSettingsUpdate}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
            >
              Save Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState((prev) => ({ ...prev, details: false }))}
        title=""
        size="lg"
      >
        {selectedReminder && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
                <FaPills className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
                {selectedReminder.medication}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Medication Details
              </p>
            </div>

            <div className="flex justify-center">
              <span
                className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide ${
                  selectedReminder.active
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {selectedReminder.active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Dosage
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {selectedReminder.dosage}
                </div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Frequency
                </div>
                <div className="mt-1 text-xl font-bold text-navy-700 dark:text-white">
                  {selectedReminder.frequency}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${getMethodBgColor(
                    selectedReminder.method
                  )}`}
                >
                  {React.createElement(getMethodIcon(selectedReminder.method), {
                    className: `h-6 w-6 ${getMethodColor(
                      selectedReminder.method
                    )}`,
                  })}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Notification Method
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedReminder.method.toUpperCase()}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Reminders sent via {selectedReminder.method}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MdAccessTime className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Schedule Times
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedReminder.times.join(", ")}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Daily reminders at these times
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <MdCalendarToday className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Duration
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {new Date(selectedReminder.startDate).toLocaleDateString()}{" "}
                    - {new Date(selectedReminder.endDate).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Total duration:{" "}
                    {Math.ceil(
                      (new Date(selectedReminder.endDate) -
                        new Date(selectedReminder.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )}{" "}
                    days
                  </div>
                </div>
              </div>

              {selectedReminder.lastTaken && (
                <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <MdCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Last Taken
                    </div>
                    <div className="mt-1 font-bold text-navy-700 dark:text-white">
                      {new Date(
                        selectedReminder.lastTaken
                      ).toLocaleDateString()}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Time: {selectedReminder.lastTaken.split(" ")[1]}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                onClick={() => {
                  setModalState((prev) => ({
                    ...prev,
                    details: false,
                    edit: true,
                  }));
                }}
                className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
              >
                Edit Reminder
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
              Medication Reminders
            </h5>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {reminders.length} reminder{reminders.length !== 1 ? "s" : ""} set
              up
            </p>
          </div>
          <button
            onClick={handleViewAll}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            View All
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card extra="p-4">
            <div className="flex items-center">
              <FaPills className="mr-4 h-8 w-8 text-blue-500" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Active Reminders
                </div>
                <div className="text-2xl font-bold">
                  {reminders.filter((r) => r.active).length}
                </div>
              </div>
            </div>
          </Card>
          <Card extra="p-4">
            <div className="flex items-center">
              <MdCheckCircle className="mr-4 h-8 w-8 text-green-500" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Compliance Rate
                </div>
                <div className="text-2xl font-bold">92%</div>
              </div>
            </div>
          </Card>
          <Card extra="p-4">
            <div className="flex items-center">
              <MdNotifications className="mr-4 h-8 w-8 text-purple-500" />
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Next Reminder
                </div>
                <div className="text-lg font-bold">
                  {reminders.length > 0
                    ? `${reminders[0].medication} at ${reminders[0].times[0]}`
                    : "No reminders"}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="mb-6 flex justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setModalState((prev) => ({ ...prev, add: true }))}
              className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              <MdAdd className="mr-2 h-4 w-4" />
              Add Reminder
            </button>
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, settings: true }))
              }
              className="flex items-center rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-600"
            >
              <MdNotifications className="mr-2 h-4 w-4" />
              Notification Settings
            </button>
          </div>
        </div>

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-navy-700">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-navy-600">
                <FaBell className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                No Medication Reminders
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Add reminders to never miss a dose
              </p>
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, add: true }))
                }
                className="linear mt-4 rounded-lg bg-brand-500 px-6 py-3 text-white hover:bg-brand-600"
              >
                Add Your First Reminder
              </button>
            </div>
          ) : (
            reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-brand-500 hover:shadow-lg dark:border-navy-700 dark:hover:border-brand-500"
              >
                {/* Gradient accent on hover */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

                {/* Background pattern */}
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-5">
                  <FaPills className="h-full w-full text-brand-500" />
                </div>

                <div className="relative">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
                          <FaPills className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h6 className="text-lg font-bold text-navy-700 dark:text-white">
                            {reminder.medication}
                          </h6>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {reminder.dosage} • {reminder.frequency}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReminder(reminder.id)}
                        className={`relative h-6 w-11 rounded-full transition-colors ${
                          reminder.active
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      >
                        <span
                          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                            reminder.active ? "translate-x-5" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                        <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Times
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                          {reminder.times.join(", ")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                        <MdCalendarToday className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Until
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                          {new Date(reminder.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Method & Status */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                          reminder.method === "sms"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : reminder.method === "push"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        }`}
                      >
                        {reminder.method === "sms" ? (
                          <>
                            <FaMobileAlt className="h-3 w-3" /> SMS
                          </>
                        ) : reminder.method === "push" ? (
                          <>
                            <FaBell className="h-3 w-3" /> Push
                          </>
                        ) : (
                          <>
                            <MdEmail className="h-3 w-3" /> Email
                          </>
                        )}
                      </span>
                      {reminder.lastTaken && (
                        <span className="text-xs text-gray-500">
                          Last: {reminder.lastTaken.split(" ")[1]}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(reminder)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
                    >
                      <MdInfo className="h-4 w-4" />
                      Details
                    </button>
                    <button
                      onClick={() => markAsTaken(reminder.id)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      <MdCheckCircle className="h-4 w-4" />
                      Mark Taken
                    </button>
                    <button
                      onClick={() => handleEditReminder(reminder)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      <MdEdit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReminder(reminder)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                    >
                      <MdDelete className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SMS Alternative */}
        <div className="mt-6">
          <Card extra="p-6">
            <div className="flex items-start">
              <MdPhone className="mr-3 h-5 w-5 text-green-500" />
              <div>
                <h5 className="font-bold text-green-700 dark:text-green-300">
                  SMS Reminders for Non-Smartphone Users
                </h5>
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Text "REMINDER" to 12345 followed by your medication name and
                  time (e.g., "REMINDER Amoxicillin 8am 4pm 12am") to set up SMS
                  reminders. Standard SMS rates apply.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default MedicationReminders;
