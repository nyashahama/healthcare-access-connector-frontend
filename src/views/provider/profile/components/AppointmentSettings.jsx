import React, { useState } from "react";
import {
  FaClock,
  FaCalendarAlt,
  FaUserClock,
  FaBell,
  FaSave,
} from "react-icons/fa";
import {
  MdAccessTime,
  MdEventAvailable,
  MdBlock,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";
import Card from "components/card";
import Switch from "components/switch";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const AppointmentSettings = () => {
  const [settings, setSettings] = useState({
    slotDuration: 15,
    bufferTime: 5,
    maxPatientsPerDay: 25,
    advanceBookingDays: 30,
    sameDayAppointments: true,
    autoConfirm: false,
    reminders: {
      sms: true,
      email: true,
      push: false,
    },
  });

  // Modal states
  const [timeSlotModalOpen, setTimeSlotModalOpen] = useState(false);
  const [blockSlotModalOpen, setBlockSlotModalOpen] = useState(false);
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);
  const [weeklyScheduleModalOpen, setWeeklyScheduleModalOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const { showToast } = useToast();

  const timeSlots = [
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
  ];

  const blockedSlots = ["12:00", "13:00"];

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Modal handlers
  const handleBlockTimeSlot = (time) => {
    setSelectedTime(time);
    setBlockReason("");
    setBlockSlotModalOpen(true);
  };

  const handleConfirmBlock = () => {
    if (!blockReason.trim()) {
      showToast("Please provide a reason for blocking", "error");
      return;
    }
    console.log(`Blocking ${selectedTime} with reason: ${blockReason}`);
    setBlockSlotModalOpen(false);
    showToast(`Time slot ${selectedTime} has been blocked`, "warning");
  };

  const handleSaveSettings = () => {
    console.log("Saving appointment settings:", settings);
    setSaveConfirmModalOpen(false);
    showToast("Appointment settings updated successfully!", "success");
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* Block Time Slot Modal */}
      <Modal
        isOpen={blockSlotModalOpen}
        onClose={() => setBlockSlotModalOpen(false)}
        title="Block Time Slot"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdBlock className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Block {selectedTime}?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This time slot will be unavailable for appointments.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for blocking *
            </label>
            <textarea
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="3"
              placeholder="E.g., Staff meeting, Equipment maintenance..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBlockSlotModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBlock}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!blockReason.trim()}
            >
              Block Slot
            </button>
          </div>
        </div>
      </Modal>

      {/* Save Confirmation Modal */}
      <Modal
        isOpen={saveConfirmModalOpen}
        onClose={() => setSaveConfirmModalOpen(false)}
        title="Save Changes"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <FaSave className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Update Appointment Settings?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This will affect all future appointments and patient bookings.
            </p>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Changing slot durations or buffer times may affect existing
                appointments.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveConfirmModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSettings}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              Update Settings
            </button>
          </div>
        </div>
      </Modal>

      {/* Weekly Schedule Modal */}
      <Modal
        isOpen={weeklyScheduleModalOpen}
        onClose={() => setWeeklyScheduleModalOpen(false)}
        title="Weekly Schedule"
        size="lg"
      >
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="pb-3 text-left text-sm font-medium">Day</th>
                  <th className="pb-3 text-left text-sm font-medium">Open</th>
                  <th className="pb-3 text-left text-sm font-medium">Close</th>
                  <th className="pb-3 text-left text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    day: "Monday",
                    open: "08:00",
                    close: "17:00",
                    closed: false,
                  },
                  {
                    day: "Tuesday",
                    open: "08:00",
                    close: "17:00",
                    closed: false,
                  },
                  {
                    day: "Wednesday",
                    open: "08:00",
                    close: "17:00",
                    closed: false,
                  },
                  {
                    day: "Thursday",
                    open: "08:00",
                    close: "17:00",
                    closed: false,
                  },
                  {
                    day: "Friday",
                    open: "08:00",
                    close: "17:00",
                    closed: false,
                  },
                  {
                    day: "Saturday",
                    open: "09:00",
                    close: "13:00",
                    closed: false,
                  },
                  { day: "Sunday", open: "-", close: "-", closed: true },
                ].map((day) => (
                  <tr
                    key={day.day}
                    className="border-b border-gray-100 dark:border-gray-800"
                  >
                    <td className="py-3 font-medium">{day.day}</td>
                    <td className="py-3">{day.open}</td>
                    <td className="py-3">{day.close}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          day.closed
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {day.closed ? "Closed" : "Open"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setWeeklyScheduleModalOpen(false)}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-3 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Appointment Settings
          </h4>
        </div>
        <button
          onClick={() => setSaveConfirmModalOpen(true)}
          className="flex items-center rounded-lg bg-brand-50 px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <FaSave className="mr-2" />
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Basic Settings */}
        <div>
          <h5 className="mb-3 flex items-center font-bold text-navy-700 dark:text-white">
            <FaClock className="mr-2" />
            Basic Settings
          </h5>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Slot Duration
              </label>
              <select
                value={settings.slotDuration}
                onChange={(e) =>
                  updateSetting("slotDuration", parseInt(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
              >
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Buffer Time
              </label>
              <select
                value={settings.bufferTime}
                onChange={(e) =>
                  updateSetting("bufferTime", parseInt(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
              >
                <option value={0}>No buffer</option>
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Max Patients/Day
              </label>
              <input
                type="number"
                value={settings.maxPatientsPerDay}
                onChange={(e) =>
                  updateSetting("maxPatientsPerDay", parseInt(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Advance Booking (days)
              </label>
              <input
                type="number"
                value={settings.advanceBookingDays}
                onChange={(e) =>
                  updateSetting("advanceBookingDays", parseInt(e.target.value))
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>
          </div>
        </div>

        {/* Appointment Rules */}
        <div>
          <h5 className="mb-3 flex items-center font-bold text-navy-700 dark:text-white">
            <MdEventAvailable className="mr-2" />
            Appointment Rules
          </h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  Allow Same-Day Appointments
                </p>
                <p className="text-sm text-gray-600">
                  Patients can book appointments for today
                </p>
              </div>
              <Switch
                id="same-day"
                checked={settings.sameDayAppointments}
                onChange={(e) =>
                  updateSetting("sameDayAppointments", e.target.checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  Auto-Confirm Appointments
                </p>
                <p className="text-sm text-gray-600">
                  Automatically confirm all bookings
                </p>
              </div>
              <Switch
                id="auto-confirm"
                checked={settings.autoConfirm}
                onChange={(e) => updateSetting("autoConfirm", e.target.checked)}
              />
            </div>
          </div>
        </div>

        {/* Time Slot Management */}
        <div>
          <h5 className="mb-3 flex items-center font-bold text-navy-700 dark:text-white">
            <MdAccessTime className="mr-2" />
            Available Time Slots
          </h5>
          <div className="mb-2 flex flex-wrap gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                onClick={() => handleBlockTimeSlot(time)}
                className={`rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:scale-105 ${
                  blockedSlots.includes(time)
                    ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
                    : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTimeSlotModalOpen(true)}
              className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
            >
              <MdBlock className="mr-1" />
              Block Time Slot
            </button>
            <button
              onClick={() => setWeeklyScheduleModalOpen(true)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
            >
              View Weekly Schedule
            </button>
          </div>
        </div>

        {/* Reminder Settings */}
        <div>
          <h5 className="mb-3 flex items-center font-bold text-navy-700 dark:text-white">
            <FaBell className="mr-2" />
            Reminder Settings
          </h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  SMS Reminders
                </p>
                <p className="text-sm text-gray-600">
                  Send SMS reminders 24h before appointment
                </p>
              </div>
              <Switch
                id="sms-reminders"
                checked={settings.reminders.sms}
                onChange={(e) =>
                  updateSetting("reminders", {
                    ...settings.reminders,
                    sms: e.target.checked,
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  Email Reminders
                </p>
                <p className="text-sm text-gray-600">
                  Send email reminders 48h before appointment
                </p>
              </div>
              <Switch
                id="email-reminders"
                checked={settings.reminders.email}
                onChange={(e) =>
                  updateSetting("reminders", {
                    ...settings.reminders,
                    email: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={() => setSaveConfirmModalOpen(true)}
          className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:scale-105 hover:bg-brand-600"
        >
          Update Settings
        </button>
      </div>
    </Card>
  );
};

export default AppointmentSettings;
