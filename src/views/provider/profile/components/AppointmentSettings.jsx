import React, { useState } from "react";
import { FaClock, FaCalendarAlt, FaUserClock, FaBell } from "react-icons/fa";
import { MdAccessTime, MdEventAvailable, MdBlock } from "react-icons/md";
import Card from "components/card";
import Switch from "components/switch";

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

  const updateSetting = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaCalendarAlt className="mr-3 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Appointment Settings
          </h4>
        </div>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
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
                className={`rounded-lg px-3 py-2 text-sm ${
                  blockedSlots.includes(time)
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
              <MdBlock className="mr-1" />
              Block Time Slot
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700">
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
        <button className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600">
          Update Settings
        </button>
      </div>
    </Card>
  );
};

export default AppointmentSettings;
