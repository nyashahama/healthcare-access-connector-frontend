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
import { useLocation, useNavigate } from "react-router-dom";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useAppointment } from "hooks/useAppointment";
import { useAuth } from "hooks/useAuth";
import { usePatient } from "hooks/usePatient";

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [reason, setReason] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [smsReminders, setSmsReminders] = useState({
    twoDay: true,
    twoHour: true,
    sameDay: true,
  });
  const [additionalReminder, setAdditionalReminder] = useState("email");
  const [clinic, setClinic] = useState(null);
  const { showToast } = useToast();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [isLoadingClinic, setIsLoadingClinic] = useState(true);

  // Hooks
  const {
    bookAppointment,
    loading,
    error,
    appointment,
    clearError,
    clearAppointmentState,
  } = useAppointment();

  const { getCurrentUser } = useAuth();
  const {
    patient,
    getPatientProfileByUserId,
    loading: patientLoading,
  } = usePatient();

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

  // Load clinic from navigation state or URL
  useEffect(() => {
    const loadClinic = async () => {
      setIsLoadingClinic(true);

      // First check for clinic in navigation state
      if (location.state?.clinic) {
        console.log(
          "Clinic loaded from navigation state:",
          location.state.clinic
        );
        setClinic(location.state.clinic);
        setIsLoadingClinic(false);
        return;
      }

      // Then check URL parameters
      const queryParams = new URLSearchParams(location.search);
      const clinicParam = queryParams.get("clinic");

      if (clinicParam) {
        try {
          const decodedClinicData = decodeURIComponent(clinicParam);
          const clinicData = JSON.parse(decodedClinicData);
          console.log("Clinic loaded from URL:", clinicData);
          setClinic(clinicData);
        } catch (error) {
          console.error("Error parsing clinic data:", error);
          showToast("Failed to load clinic information", "error");
          navigate("/patient/find-clinic");
        }
      } else {
        console.error("No clinic data found");
        showToast("Please select a clinic first", "warning");
        navigate("/patient/find-clinic");
      }

      setIsLoadingClinic(false);
    };

    loadClinic();
  }, [location, navigate, showToast]);

  // Load patient profile on mount
  useEffect(() => {
    const loadPatientProfile = async () => {
      setIsLoadingPatient(true);
      try {
        const user = getCurrentUser();
        console.log("Current user:", user);

        if (!user || !user.id) {
          showToast("Please log in to book an appointment", "error");
          setIsLoadingPatient(false);
          return;
        }

        setUserId(user.id);

        const result = await getPatientProfileByUserId(user.id);
        console.log("Patient profile result:", result);

        if (result.success && result.data) {
          setPatientId(result.data.id);
          setPatientName(
            result.data.full_name ||
              result.data.first_name + " " + result.data.last_name ||
              ""
          );
          setPatientPhone(result.data.phone_number || "");
          console.log("Patient loaded:", result.data);
        } else {
          console.warn("No patient profile found");
          showToast(
            "Please complete your patient profile before booking",
            "warning"
          );
        }
      } catch (error) {
        console.error("Error loading patient:", error);
        showToast("Error loading patient profile", "error");
      } finally {
        setIsLoadingPatient(false);
      }
    };

    if (!isLoadingClinic && clinic) {
      loadPatientProfile();
    }
  }, [
    clinic,
    getCurrentUser,
    getPatientProfileByUserId,
    showToast,
    isLoadingClinic,
  ]);

  // Update patient name and phone when patient data changes
  useEffect(() => {
    if (patient) {
      setPatientName(
        patient.full_name || patient.first_name + " " + patient.last_name || ""
      );
      setPatientPhone(patient.phone_number || "");
    }
  }, [patient]);

  // Fixed time conversion - handles 12 AM and 12 PM correctly
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");

    hours = parseInt(hours, 10);

    if (modifier === "AM") {
      if (hours === 12) hours = 0; // 12 AM = 00:00
    } else {
      if (hours !== 12) hours += 12; // 1 PM = 13:00, but 12 PM stays 12
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}:00`;
  };

  // Prepare appointment data in the required format
  const prepareAppointmentData = () => {
    const time24h = convertTo24Hour(selectedTime);
    const appointmentDatetime = `${selectedDate}T${time24h}Z`;

    // Try multiple possible clinic ID fields
    const clinicId = clinic?.id || clinic?.clinic_id || clinic?.clinicId;

    console.log("Clinic object:", clinic);
    console.log("Extracted clinic ID:", clinicId);

    if (!clinicId) {
      console.error("All possible clinic ID fields:", {
        id: clinic?.id,
        clinic_id: clinic?.clinic_id,
        clinicId: clinic?.clinicId,
        clinicID: clinic?.clinicID,
        fullClinic: clinic,
      });
      throw new Error("Clinic ID is required for booking");
    }

    if (!userId) {
      throw new Error("Patient ID is required for booking");
    }

    return {
      clinic_id: clinicId,
      patient_id: userId,
      appointment_date: `${selectedDate}T00:00:00Z`,
      appointment_time: appointmentDatetime,
      appointment_datetime: appointmentDatetime,
      patient_name: patientName,
      patient_phone: patientPhone,
      reason_for_visit: reason,
    };
  };

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
    // Validate before opening modal
    if (!patientId) {
      showToast(
        "Patient profile not found. Please complete your profile first.",
        "error"
      );
      return;
    }

    if (!clinic) {
      showToast("Clinic information is missing", "error");
      return;
    }

    setConfirmModalOpen(true);
  };

  const confirmBooking = async () => {
    console.log("=== BOOKING DEBUG START ===");

    try {
      const appointmentData = prepareAppointmentData();

      console.log("1. Clinic:", clinic);
      console.log("2. Patient ID:", patientId);
      console.log("3. Selected Date:", selectedDate);
      console.log("4. Selected Time:", selectedTime);
      console.log("5. Time in 24h:", convertTo24Hour(selectedTime));
      console.log("6. Reason:", reason);
      console.log("7. Prepared Data:", appointmentData);

      const result = await bookAppointment(appointmentData);

      console.log("8. API Result:", result);
      console.log("=== BOOKING DEBUG END ===");

      if (result.success) {
        setConfirmModalOpen(false);
        showToast("Appointment booked successfully!", "success");

        setTimeout(() => {
          // Reset form state
          clearAppointmentState();
          setSelectedDate("");
          setSelectedTime("");
          setReason("");
          setCurrentStep(1);

          // Redirect to appointments page
          navigate("/patient/appointments");
        }, 1500);
      } else {
        setConfirmModalOpen(false);
        console.error("Booking failed:", result.error);
        showToast(
          result.error || "Failed to book appointment. Please try again.",
          "error"
        );
      }
    } catch (error) {
      setConfirmModalOpen(false);
      console.error("Validation error during booking:", error);
      showToast(
        error.message || "An unexpected error occurred. Please try again.",
        "error"
      );
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      console.error("Appointment error:", error);
      showToast(error, "error");
    }
  }, [error, showToast]);

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

  // Show loading state while clinic is loading
  if (isLoadingClinic) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card extra="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading clinic information...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error if no clinic
  if (!clinic && !isLoadingClinic) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card extra="p-8">
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <MdWarning className="h-12 w-12 text-red-600 dark:text-red-300" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
              No Clinic Selected
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Please select a clinic before booking an appointment.
            </p>
            <button
              onClick={() => navigate("/patient/find-clinic")}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              Find a Clinic
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // Show loading state while patient profile is loading
  if (isLoadingPatient) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card extra="p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Loading patient information...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show error if no patient profile
  if (!patientId && !isLoadingPatient) {
    return (
      <div className="mx-auto max-w-4xl">
        <Card extra="p-8">
          <div className="py-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <MdWarning className="h-12 w-12 text-orange-600 dark:text-orange-300" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
              Profile Required
            </h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Please complete your patient profile before booking an
              appointment.
            </p>
            <button
              onClick={() => navigate("/patient/profile")}
              className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              Complete Profile
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Success Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => !loading && setConfirmModalOpen(false)}
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
                  {clinic?.clinic_name || clinic?.name || "Clinic"}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {clinic?.physical_address ||
                    clinic?.address ||
                    "Address not available"}
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
                  Reason for Visit
                </div>
                <div className="mt-1 text-sm text-navy-700 dark:text-white">
                  {reason}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmModalOpen(false)}
              disabled={loading}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-navy-800"
            >
              Cancel
            </button>
            <button
              onClick={confirmBooking}
              disabled={loading}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all ${
                loading
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Booking...
                </>
              ) : (
                <>
                  <MdCheckCircle className="h-5 w-5" />
                  Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      <div className="mx-auto max-w-4xl">
        <Card extra="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
                  Book an Appointment
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Schedule your visit in just a few simple steps
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 dark:bg-blue-900/20">
                <MdLocationOn className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-300">
                  {clinic?.clinic_name || clinic?.name || "Clinic"}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-1 flex-col items-center">
                    <div
                      className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : isActive
                          ? "border-brand-500 bg-brand-500 text-white"
                          : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-navy-800"
                      }`}
                    >
                      {isCompleted ? (
                        <MdCheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                    <div
                      className={`text-center text-sm font-medium ${
                        isActive
                          ? "text-brand-500"
                          : isCompleted
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`mx-4 h-0.5 flex-1 ${
                        currentStep > step.number
                          ? "bg-green-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                  Select Date
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {getAvailableDates().map((date) => {
                    const formatted = formatDateForDisplay(date);
                    const isSelected = selectedDate === formatted.fullDate;

                    return (
                      <button
                        key={formatted.fullDate}
                        onClick={() => setSelectedDate(formatted.fullDate)}
                        className={`flex flex-col items-center rounded-xl p-3 transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg"
                            : "border-2 border-gray-200 hover:border-brand-300 dark:border-gray-700"
                        }`}
                      >
                        <div className="text-xs font-medium">
                          {formatted.day}
                        </div>
                        <div className="mt-1 text-2xl font-bold">
                          {formatted.date}
                        </div>
                        <div className="text-xs">{formatted.month}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                  Select Time
                </h3>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                  {availableSlots.map((time) => {
                    const isSelected = selectedTime === time;

                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-xl py-3 font-semibold transition-all ${
                          isSelected
                            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg"
                            : "border-2 border-gray-200 hover:border-brand-300 dark:border-gray-700"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                  Patient Name *
                </label>
                <div className="relative">
                  <MdPerson className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition-all focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-800"
                    placeholder="Enter patient name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                  Phone Number *
                </label>
                <div className="relative">
                  <MdPhone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition-all focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-800"
                    placeholder="+27 XX XXX XXXX"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-navy-700 dark:text-white">
                  Reason for Visit *
                </label>
                <div className="relative">
                  <MdNotes className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-12 pr-4 transition-all focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-800"
                    placeholder="Brief description of your visit reason..."
                  />
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                  SMS Reminders
                </label>
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={smsReminders.twoDay}
                      onChange={(e) =>
                        setSmsReminders({
                          ...smsReminders,
                          twoDay: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      2 days before appointment
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={smsReminders.sameDay}
                      onChange={(e) =>
                        setSmsReminders({
                          ...smsReminders,
                          sameDay: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Same day reminder
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={smsReminders.twoHour}
                      onChange={(e) =>
                        setSmsReminders({
                          ...smsReminders,
                          twoHour: e.target.checked,
                        })
                      }
                      className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      2 hours before appointment
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="mb-3 block text-sm font-bold text-navy-700 dark:text-white">
                  Additional Reminders
                </label>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="additionalReminder"
                      value="email"
                      checked={additionalReminder === "email"}
                      onChange={(e) => setAdditionalReminder(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <MdEmail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Email reminders
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="additionalReminder"
                      value="push"
                      checked={additionalReminder === "push"}
                      onChange={(e) => setAdditionalReminder(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <MdNotifications className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Push notifications
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="radio"
                      name="additionalReminder"
                      value="none"
                      checked={additionalReminder === "none"}
                      onChange={(e) => setAdditionalReminder(e.target.value)}
                      className="h-4 w-4 border-gray-300 text-brand-500 focus:ring-brand-500"
                    />
                    <MdClose className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      SMS only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="space-y-6">
                <div className="rounded-xl border-2 border-gray-200 p-6 dark:border-gray-700">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-bold text-navy-700 dark:text-white">
                      Clinic Information
                    </h4>
                  </div>
                  <div className="flex items-start gap-3">
                    <MdLocationOn className="mt-1 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="font-semibold text-navy-700 dark:text-white">
                        {clinic?.clinic_name || clinic?.name || "Clinic"}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        {clinic?.physical_address ||
                          clinic?.address ||
                          "Address not available"}
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
                        • If you need to cancel, please do so at least 24 hours
                        in advance
                      </li>
                    </ul>
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
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-navy-800"
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
                  (currentStep === 2 && !canProceedToStep3) ||
                  loading
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all ${
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3) ||
                  loading
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
                disabled={loading}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all ${
                  loading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                }`}
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
