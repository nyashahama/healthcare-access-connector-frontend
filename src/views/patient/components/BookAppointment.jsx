import React, { useState, useEffect } from "react";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdNotes,
  MdPhone,
  MdCheckCircle,
  MdWarning,
  MdArrowBack,
  MdArrowForward,
  MdEmail,
  MdNotifications,
  MdClose,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const BookAppointment = ({ clinic }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState("Sarah Johnson");
  const [patientPhone, setPatientPhone] = useState("+27 72 123 4567");
  const [smsReminders, setSmsReminders] = useState({
    twoDay: true,
    twoHour: true,
    sameDay: true,
  });
  const [additionalReminder, setAdditionalReminder] = useState("email");
  const { showToast } = useToast();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const availableSlots = [
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
  ];

  const steps = [
    { number: 1, title: "Date & Time", icon: MdCalendarToday },
    { number: 2, title: "Details", icon: MdNotes },
    { number: 3, title: "Confirm", icon: MdCheckCircle },
  ];

  const canProceedToStep2 = selectedDate && selectedTime;
  const canProceedToStep3 = reason && patientName && patientPhone;

  const handleNext = () => {
    if (currentStep === 1 && !canProceedToStep2) {
      showToast("Please select a date and time", "warning");
      return;
    }
    if (currentStep === 2 && !canProceedToStep3) {
      showToast("Please fill in all required details", "warning");
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setConfirmModalOpen(true);
  };

  const confirmBooking = () => {
    console.log("Booking appointment:", {
      clinic,
      date: selectedDate,
      time: selectedTime,
      reason,
      patient: { name: patientName, phone: patientPhone },
      reminders: { sms: smsReminders, additional: additionalReminder },
    });

    setConfirmModalOpen(false);
    showToast("Appointment booked successfully!", "success");

    setTimeout(() => {
      window.location.href = "/patient/appointments";
    }, 1500);
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDateForDisplay = (date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date.toISOString().split("T")[0],
    };
  };

  return (
    <>
      {/* Success Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        title=""
        size="md"
      >
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
              <MdCheckCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
              Confirm Your Appointment
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Please review the details below
            </p>
          </div>

          <div className="space-y-4 rounded-xl bg-gray-50 p-6 dark:bg-navy-900">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <MdLocationOn className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Clinic
                </div>
                <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                  {clinic?.name}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {clinic?.address}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                <MdCalendarToday className="h-5 w-5 text-purple-600 dark:text-purple-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Date & Time
                </div>
                <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {selectedTime}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <MdPerson className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Patient
                </div>
                <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                  {patientName}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {patientPhone}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                <MdNotes className="h-5 w-5 text-orange-600 dark:text-orange-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Reason
                </div>
                <div className="mt-1 text-sm text-navy-700 dark:text-white">
                  {reason}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <MdInfo className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Please note:</strong> Arrive 10 minutes early. Bring
                your ID, medical aid card, and any previous medical records.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-navy-800"
            >
              Go Back
            </button>
            <button
              onClick={confirmBooking}
              className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </Modal>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="mb-4 flex items-center gap-2 text-gray-600 transition-colors hover:text-brand-500 dark:text-gray-400"
          >
            <MdArrowBack className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
          <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
            Book an Appointment
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Schedule your visit in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                      currentStep >= step.number
                        ? "border-brand-500 bg-brand-500 text-white"
                        : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-navy-800"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <MdCheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
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
                      className={`text-sm ${
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
        <Card extra="p-8">
          {/* Step 1: Date & Time Selection */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
                  Select Date & Time
                </h3>

                {/* Clinic Info Banner */}
                <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-navy-800">
                      <MdLocationOn className="h-6 w-6 text-brand-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-navy-700 dark:text-white">
                        {clinic?.name || "Selected Clinic"}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {clinic?.address || "Clinic address will appear here"}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900 dark:text-green-300">
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          Open Now
                        </span>
                        <span className="text-xs text-gray-500">
                          • Wait time: ~15 min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="mb-8">
                  <label className="mb-4 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MdCalendarToday className="mr-2 h-5 w-5 text-brand-500" />
                    Choose a Date
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {getAvailableDates().map((date) => {
                      const formatted = formatDateForDisplay(date);
                      const isSelected = selectedDate === formatted.fullDate;
                      const isToday =
                        formatted.fullDate ===
                        new Date().toISOString().split("T")[0];

                      return (
                        <button
                          key={formatted.fullDate}
                          type="button"
                          onClick={() => setSelectedDate(formatted.fullDate)}
                          className={`relative rounded-xl border-2 p-3 text-center transition-all ${
                            isSelected
                              ? "border-brand-500 bg-brand-500 text-white shadow-lg"
                              : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                          }`}
                        >
                          {isToday && !isSelected && (
                            <div className="absolute right-1 top-1 h-2 w-2 rounded-full bg-brand-500"></div>
                          )}
                          <div
                            className={`text-xs font-medium ${
                              isSelected
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {formatted.day}
                          </div>
                          <div
                            className={`mt-1 text-xl font-bold ${
                              isSelected
                                ? "text-white"
                                : "text-navy-700 dark:text-white"
                            }`}
                          >
                            {formatted.date}
                          </div>
                          <div
                            className={`text-xs ${
                              isSelected
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {formatted.month}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="mb-4 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <MdAccessTime className="mr-2 h-5 w-5 text-brand-500" />
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`rounded-xl border-2 py-3 text-sm font-semibold transition-all ${
                              isSelected
                                ? "border-brand-500 bg-brand-500 text-white shadow-lg"
                                : "border-gray-200 hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
                  Appointment Details
                </h3>

                {/* Selected Date & Time Display */}
                <div className="mb-6 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-4 dark:from-brand-900/20 dark:to-purple-900/20">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm dark:bg-navy-800">
                      <MdCalendarToday className="h-6 w-6 text-brand-500" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Selected Appointment
                      </div>
                      <div className="mt-0.5 font-bold text-navy-700 dark:text-white">
                        {new Date(selectedDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        at {selectedTime}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="mb-6">
                  <label className="mb-2 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MdNotes className="mr-2 h-5 w-5 text-brand-500" />
                    Reason for Visit *
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please describe your symptoms or the reason for your appointment..."
                    className="h-32 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
                    required
                  />
                  <div className="mt-2 text-xs text-gray-500">
                    This helps the doctor prepare for your visit
                  </div>
                </div>

                {/* Patient Information */}
                <div className="mb-6">
                  <label className="mb-2 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MdPerson className="mr-2 h-5 w-5 text-brand-500" />
                    Patient Information
                  </label>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* SMS Reminders */}
                <div>
                  <label className="mb-4 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MdPhone className="mr-2 h-5 w-5 text-brand-500" />
                    SMS Reminders
                  </label>
                  <div className="space-y-3">
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700 dark:hover:border-brand-500">
                      <input
                        type="checkbox"
                        checked={smsReminders.twoDay}
                        onChange={(e) =>
                          setSmsReminders({
                            ...smsReminders,
                            twoDay: e.target.checked,
                          })
                        }
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-navy-700 dark:text-white">
                          2-Day Reminder
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Sent 48 hours before your appointment
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700 dark:hover:border-brand-500">
                      <input
                        type="checkbox"
                        checked={smsReminders.twoHour}
                        onChange={(e) =>
                          setSmsReminders({
                            ...smsReminders,
                            twoHour: e.target.checked,
                          })
                        }
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-navy-700 dark:text-white">
                          2-Hour Reminder
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Sent 2 hours before your appointment
                        </div>
                      </div>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700 dark:hover:border-brand-500">
                      <input
                        type="checkbox"
                        checked={smsReminders.sameDay}
                        onChange={(e) =>
                          setSmsReminders({
                            ...smsReminders,
                            sameDay: e.target.checked,
                          })
                        }
                        className="mt-1 h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-navy-700 dark:text-white">
                          Same-Day Instructions
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Preparation instructions on the day of appointment
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Additional Reminders */}
                <div className="mt-6">
                  <label className="mb-4 flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <MdNotifications className="mr-2 h-5 w-5 text-brand-500" />
                    Additional Reminders (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setAdditionalReminder("email")}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        additionalReminder === "email"
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 hover:border-brand-300 dark:border-gray-700"
                      }`}
                    >
                      <MdEmail
                        className={`h-6 w-6 ${
                          additionalReminder === "email"
                            ? "text-brand-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-semibold">Email</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdditionalReminder("push")}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        additionalReminder === "push"
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 hover:border-brand-300 dark:border-gray-700"
                      }`}
                    >
                      <MdNotifications
                        className={`h-6 w-6 ${
                          additionalReminder === "push"
                            ? "text-brand-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-semibold">Push</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdditionalReminder("none")}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                        additionalReminder === "none"
                          ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                          : "border-gray-200 hover:border-brand-300 dark:border-gray-700"
                      }`}
                    >
                      <MdClose
                        className={`h-6 w-6 ${
                          additionalReminder === "none"
                            ? "text-brand-500"
                            : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-semibold">None</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
                  Review Your Appointment
                </h3>

                {/* Summary Cards */}
                <div className="space-y-4">
                  <div className="rounded-xl border-2 border-gray-200 p-6 dark:border-gray-700">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-bold text-navy-700 dark:text-white">
                        Clinic Information
                      </h4>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                      >
                        Change
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MdLocationOn className="mt-1 h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-semibold text-navy-700 dark:text-white">
                            {clinic?.name}
                          </div>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {clinic?.address}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-gray-200 p-6 dark:border-gray-700">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-bold text-navy-700 dark:text-white">
                        Date & Time
                      </h4>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                      >
                        Change
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <MdCalendarToday className="mt-1 h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-semibold text-navy-700 dark:text-white">
                            {new Date(selectedDate).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {selectedTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border-2 border-gray-200 p-6 dark:border-gray-700">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-bold text-navy-700 dark:text-white">
                        Patient & Details
                      </h4>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-sm font-medium text-brand-500 hover:text-brand-600"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MdPerson className="mt-1 h-5 w-5 text-gray-400" />
                        <div>
                          <div className="font-semibold text-navy-700 dark:text-white">
                            {patientName}
                          </div>
                          <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {patientPhone}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MdNotes className="mt-1 h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">
                            Reason for visit
                          </div>
                          <div className="mt-1 text-sm text-navy-700 dark:text-white">
                            {reason}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MdPhone className="mt-1 h-5 w-5 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-500">
                            Reminders
                          </div>
                          <div className="mt-1 text-sm text-navy-700 dark:text-white">
                            SMS:{" "}
                            {Object.entries(smsReminders)
                              .filter(([_, enabled]) => enabled)
                              .map(([key]) =>
                                key === "twoDay"
                                  ? "2-day"
                                  : key === "twoHour"
                                  ? "2-hour"
                                  : "same-day"
                              )
                              .join(", ") || "None"}
                            {additionalReminder !== "none" &&
                              `, ${additionalReminder}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notice */}
                <div className="mt-6 rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <MdInfo className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div>
                      <h5 className="font-bold text-blue-900 dark:text-blue-300">
                        Before Your Appointment
                      </h5>
                      <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-400">
                        <li>• Arrive 10 minutes early for check-in</li>
                        <li>
                          • Bring your ID and medical aid card (if applicable)
                        </li>
                        <li>
                          • Bring any previous medical records or prescriptions
                        </li>
                        <li>
                          • If you need to cancel, please do so at least 24
                          hours in advance
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-navy-800"
              >
                <MdArrowBack className="h-5 w-5" />
                Back
              </button>
            )}
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3)
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all ${
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3)
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
                }`}
              >
                Continue
                <MdArrowForward className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              >
                <MdCheckCircle className="h-5 w-5" />
                Confirm Appointment
              </button>
            )}
          </div>
        </Card>

        {/* SMS Booking Alternative */}
        <div className="mt-6 rounded-xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-navy-800">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 dark:bg-brand-900">
              <MdPhone className="h-6 w-6 text-brand-600 dark:text-brand-300" />
            </div>
            <div>
              <h5 className="font-bold text-navy-700 dark:text-white">
                Book via SMS
              </h5>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                No internet? Text <strong>"BOOK"</strong> to{" "}
                <strong>12345</strong> followed by your name and preferred date.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Example: BOOK Sarah Johnson 2024-12-20
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
