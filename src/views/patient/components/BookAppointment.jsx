// views/patient/components/BookAppointment.jsx
import React, { useState } from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdNotes,
} from "react-icons/md";
import Card from "components/card";

const BookAppointment = ({ clinic }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");

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
    // Handle appointment booking
    console.log("Booking appointment:", {
      clinic,
      date: selectedDate,
      time: selectedTime,
      reason,
    });
    alert(
      "Appointment booked successfully! You'll receive an SMS confirmation."
    );
  };

  return (
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
            Select Date
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
            Available Time Slots
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
            Reason for Visit
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

        {/* SMS Confirmation */}
        <div className="flex items-start rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <input
            type="checkbox"
            id="sms-confirmation"
            defaultChecked
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          <label htmlFor="sms-confirmation" className="ml-3">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Send SMS confirmation and reminders
            </span>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              You'll receive reminders 48h and 2h before your appointment
            </p>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedDate || !selectedTime || !reason}
          className={`linear w-full rounded-xl py-3 font-medium text-white transition duration-200 ${
            selectedDate && selectedTime && reason
              ? "bg-brand-500 hover:bg-brand-600"
              : "cursor-not-allowed bg-gray-400"
          }`}
        >
          Confirm Booking
        </button>
      </form>

      {/* SMS Alternative */}
      <div className="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          <strong>No internet access?</strong> Text "BOOK" to 12345 followed by
          your name and preferred date to book via SMS.
        </p>
      </div>
    </Card>
  );
};

export default BookAppointment;
