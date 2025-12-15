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
  });
  const [selectedReminder, setSelectedReminder] = useState(null);
  const { showToast } = useToast();

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

  const deleteReminder = () => {
    setReminders(reminders.filter((r) => r.id !== selectedReminder.id));
    setModalState({ ...modalState, delete: false });
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

  const ReminderCard = ({ reminder }) => (
    <Card extra="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-navy-700 dark:text-white">
                {reminder.medication}
              </h5>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {reminder.dosage} • {reminder.frequency}
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

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <MdAccessTime className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Times: {reminder.times.join(", ")}
              </span>
            </div>
            <div className="flex items-center">
              <MdCalendarToday className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Until: {new Date(reminder.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${
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
                  Last taken: {reminder.lastTaken.split(" ")[1]}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => markAsTaken(reminder.id)}
                className="rounded-lg border border-green-300 bg-green-50 px-3 py-1 text-sm text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
              >
                Mark Taken
              </button>
              <button
                onClick={() => {
                  setSelectedReminder(reminder);
                  setModalState({ ...modalState, edit: true });
                }}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 dark:border-gray-600"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      <Modal
        isOpen={modalState.add}
        onClose={() => setModalState({ ...modalState, add: false })}
        title="Add Medication Reminder"
        size="lg"
      >
        <div className="space-y-6">
          {/* Add reminder form - similar to your booking forms */}
          <div className="flex justify-end">
            <button
              onClick={() => setModalState({ ...modalState, add: false })}
              className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Medication Reminders
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Never miss a dose with personalized reminders
        </p>
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
            onClick={() => setModalState({ ...modalState, add: true })}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Add Reminder
          </button>
          <button
            onClick={() => setModalState({ ...modalState, settings: true })}
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
          <Card extra="p-6 text-center">
            <FaBell className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
              No medication reminders
            </h4>
            <p className="mt-2 text-gray-600">
              Add reminders to never miss a dose
            </p>
            <button
              onClick={() => setModalState({ ...modalState, add: true })}
              className="linear mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              Add Your First Reminder
            </button>
          </Card>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard key={reminder.id} reminder={reminder} />
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
  );
};

export default MedicationReminders;
