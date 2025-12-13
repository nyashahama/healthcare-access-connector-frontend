import React, { useState } from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdNotes,
  MdPhone,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const BookAppointment = ({ clinic }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const { showToast } = useToast();

  // Modal states
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [smsConfirmModalOpen, setSmsConfirmModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);

  const availableSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !reason) {
      showToast("Please fill in all required fields", "warning");
      return;
    }

    setConfirmModalOpen(true);
  };

  const confirmBooking = () => {
    console.log("Booking appointment:", {
      clinic,
      date: selectedDate,
      time: selectedTime,
      reason,
    });

    setConfirmModalOpen(false);
    setSmsConfirmModalOpen(true);
    showToast("Appointment booking confirmed!", "success");
  };

  const confirmSMSReminders = () => {
    setSmsConfirmModalOpen(false);
    setReminderModalOpen(true);
  };

  const handleReminderSelection = (type) => {
    setReminderModalOpen(false);
    showToast(`${type} reminders enabled`, "success");

    // Redirect or show success message
    setTimeout(() => {
      window.location.href = "/patient/appointments";
    }, 1500);
  };

  return (
    <>
      {/* Modals */}
      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title="Confirm Appointment"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <MdCheckCircle className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Confirm Booking?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Please review your appointment details
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center">
                <MdLocationOn className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Clinic</div>
                  <div className="font-medium">{clinic?.name}</div>
                </div>
              </div>
              <div className="flex items-center">
                <MdCalendarToday className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Date</div>
                  <div className="font-medium">{selectedDate}</div>
                </div>
              </div>
              <div className="flex items-center">
                <MdAccessTime className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Time</div>
                  <div className="font-medium">{selectedTime}</div>
                </div>
              </div>
              <div className="flex items-center">
                <MdPerson className="mr-3 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Patient</div>
                  <div className="font-medium">Sarah Johnson (Child)</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmBooking}
              className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </Modal>

      {/* SMS Confirmation Modal */}
      <Modal
        isOpen={smsConfirmModalOpen}
        onClose={() => setSmsConfirmModalOpen(false)}
        title="SMS Appointment Confirmation"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <MdPhone className="mx-auto mb-4 h-12 w-12 text-brand-500" />
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Get SMS Reminders?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Receive SMS reminders for your appointment
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
              <input
                type="checkbox"
                id="sms-48h"
                defaultChecked
                className="mr-3 mt-1 h-4 w-4 rounded"
              />
              <label htmlFor="sms-48h">
                <div className="font-medium text-blue-800 dark:text-blue-300">
                  48-hour reminder
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Sent 2 days before appointment
                </div>
              </label>
            </div>

            <div className="flex items-start rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
              <input
                type="checkbox"
                id="sms-2h"
                defaultChecked
                className="mr-3 mt-1 h-4 w-4 rounded"
              />
              <label htmlFor="sms-2h">
                <div className="font-medium text-green-800 dark:text-green-300">
                  2-hour reminder
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Sent 2 hours before appointment
                </div>
              </label>
            </div>

            <div className="flex items-start rounded-lg bg-purple-50 p-3 dark:bg-purple-900/20">
              <input
                type="checkbox"
                id="sms-day"
                defaultChecked
                className="mr-3 mt-1 h-4 w-4 rounded"
              />
              <label htmlFor="sms-day">
                <div className="font-medium text-purple-800 dark:text-purple-300">
                  Same-day instructions
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-400">
                  What to bring, parking info, etc.
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Note:</strong> Standard SMS rates apply. You can opt out
              anytime by replying STOP.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setSmsConfirmModalOpen(false);
                showToast("Booking completed without SMS", "info");
                window.location.href = "/patient/appointments";
              }}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Skip SMS
            </button>
            <button
              onClick={confirmSMSReminders}
              className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
            >
              Enable SMS Reminders
            </button>
          </div>
        </div>
      </Modal>

      {/* Reminder Options Modal */}
      <Modal
        isOpen={reminderModalOpen}
        onClose={() => setReminderModalOpen(false)}
        title="Additional Reminders"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <MdCalendarToday className="mx-auto mb-4 h-12 w-12 text-blue-500" />
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Set Additional Reminders?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Choose how you'd like to be reminded
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleReminderSelection("Calendar")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-blue-500 hover:bg-blue-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                📅
              </div>
              <span className="font-medium">Calendar</span>
              <span className="text-xs text-gray-500">
                Add to device calendar
              </span>
            </button>

            <button
              onClick={() => handleReminderSelection("Email")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-red-500 hover:bg-red-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                📧
              </div>
              <span className="font-medium">Email</span>
              <span className="text-xs text-gray-500">Email reminders</span>
            </button>

            <button
              onClick={() => handleReminderSelection("Push")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-green-500 hover:bg-green-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                📱
              </div>
              <span className="font-medium">Push</span>
              <span className="text-xs text-gray-500">App notifications</span>
            </button>

            <button
              onClick={() => handleReminderSelection("None")}
              className="flex flex-col items-center rounded-lg border border-gray-200 p-4 hover:border-gray-500 hover:bg-gray-50 dark:border-gray-700"
            >
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                ✕
              </div>
              <span className="font-medium">None</span>
              <span className="text-xs text-gray-500">SMS only</span>
            </button>
          </div>

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Missing appointments may result in fees. Please cancel or
                reschedule if you cannot attend.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => handleReminderSelection("Skip")}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Skip Reminders
            </button>
          </div>
        </div>
      </Modal>

      {/* Appointment Form */}
      <Card extra="p-6">
        <h4 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
          Book Appointment
        </h4>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Clinic Info */}
          <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="font-bold text-navy-700 dark:text-white">
                  {clinic?.name || "Selected Clinic"}
                </h5>
                <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MdLocationOn className="mr-2 h-4 w-4" />
                  {clinic?.address || "Clinic address will appear here"}
                </div>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                Available
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdCalendarToday className="mr-2 h-4 w-4" />
              Select Date *
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-navy-800"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdAccessTime className="mr-2 h-4 w-4" />
              Available Time Slots *
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-lg border py-2 text-sm font-medium transition-colors ${
                    selectedTime === slot
                      ? "border-brand-500 bg-brand-500 text-white"
                      : "border-gray-300 hover:border-brand-300 dark:border-gray-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdNotes className="mr-2 h-4 w-4" />
              Reason for Visit *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for appointment..."
              className="h-32 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-navy-800"
              required
            />
          </div>

          {/* Patient Info */}
          <div>
            <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <MdPerson className="mr-2 h-4 w-4" />
              Patient Information
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-navy-800"
                defaultValue="Sarah Johnson"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 dark:border-gray-600 dark:bg-navy-800"
                defaultValue="+27 72 123 4567"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`linear w-full rounded-xl py-3 font-medium text-white transition duration-200 ${
              selectedDate && selectedTime && reason
                ? "bg-brand-500 hover:bg-brand-600"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            Book Appointment
          </button>
        </form>

        {/* SMS Alternative */}
        <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-start">
            <MdPhone className="mr-3 mt-1 h-5 w-5 text-brand-500" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                <strong>No internet access?</strong>
              </p>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                Text "BOOK" to 12345 followed by your name and preferred date to
                book via SMS.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default BookAppointment;
