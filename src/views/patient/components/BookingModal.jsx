import React, { useState } from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdNotes,
  MdPhone,
  MdInfo,
  MdWarning,
} from "react-icons/md";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useNavigate } from "react-router-dom";

const BookingModal = ({
  isOpen,
  onClose,
  clinic,
  onConfirmBooking,
  type = "quick", // "quick" or "detailed"
}) => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [appointmentType, setAppointmentType] = useState("General Check-up");

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

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      showToast("Please select date and time", "warning");
      return;
    }

    const bookingData = {
      clinicId: clinic.id,
      clinicName: clinic.name,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      reason,
      patient: "Sarah Johnson (Child)",
    };

    onConfirmBooking(bookingData);
  };

  const handleRedirectToFullBooking = () => {
    onClose();
    showToast("Opening full booking form...", "info");
    navigate(`/patient/book-appointment?clinic=${clinic.id}`, {
      state: { clinic }, // Pass clinic data in state
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Appointment"
      size={type === "quick" ? "md" : "lg"}
      className="z-[1000]"
    >
      <div className="space-y-6">
        {/* Clinic Info */}
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                {clinic.name}
              </h4>
              <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                <MdLocationOn className="mr-2 h-4 w-4" />
                {clinic.address}
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
              Available
            </span>
          </div>
        </div>

        {type === "quick" ? (
          /* Quick Booking (for FindClinic & ClinicSuggestions) */
          <>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Appointment Type
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-800"
                >
                  <option>General Check-up</option>
                  <option>Vaccination</option>
                  <option>Follow-up Visit</option>
                  <option>Emergency Visit</option>
                  <option>Child Health Check</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Time
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-800"
                >
                  <option value="">Select a time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  For more detailed scheduling, use the full booking form.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={handleRedirectToFullBooking}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Use Full Booking Form
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
              >
                Book Quick Appointment
              </button>
            </div>
          </>
        ) : (
          /* Detailed Booking (standalone BookAppointment page) */
          <>
            <div className="space-y-4">
              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdCalendarToday className="mr-2 h-4 w-4" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-800"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdAccessTime className="mr-2 h-4 w-4" />
                  Available Time Slots *
                </label>
                <div className="grid grid-cols-3 gap-2">
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

              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdNotes className="mr-2 h-4 w-4" />
                  Reason for Visit *
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Briefly describe symptoms or reason..."
                  className="h-32 w-full rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-800"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MdPerson className="mr-2 h-4 w-4" />
                  Patient Information
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-800"
                    defaultValue="Sarah Johnson"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-800"
                    defaultValue="+27 72 123 4567"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <div className="flex items-start">
                <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please bring ID, medical aid card, and any previous medical
                  records.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
              >
                Book Appointment
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default BookingModal;
