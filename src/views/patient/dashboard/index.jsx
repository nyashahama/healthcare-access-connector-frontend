import { useState, useEffect } from "react";
import { IoMdCalendar, IoMdMedical, IoMdChatbubbles } from "react-icons/io";
import { FaStethoscope, FaMapMarkerAlt, FaAppleAlt } from "react-icons/fa";
import { MdInfo, MdWarning } from "react-icons/md";
import Widget from "components/widget/Widget";
import UpcomingAppointments from "../components/UpcomingAppointments";
import QuickActions from "../components/QuickActions";
import ClinicSuggestions from "../components/ClinicSuggestions";
import HealthTipsCarousel from "../components/HealthTipsCarousel";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { usePatient } from "hooks/usePatient";
import { useAppointment } from "hooks/useAppointment";
import { useAuth } from "hooks/useAuth";

const PatientDashboard = () => {
  const [modalState, setModalState] = useState({
    appointmentReminder: false,
    healthScoreDetails: false,
    emergencyContacts: false,
    nutritionTipDetails: false,
  });
  const [selectedTip, setSelectedTip] = useState(null);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [nextAppointment, setNextAppointment] = useState(null);
  const { showToast } = useToast();
  const { patient, getPatientProfileByUserId } = usePatient();
  const {
    appointments,
    getAppointmentsByPatient,
    loading: appointmentsLoading,
  } = useAppointment();
  const { getCurrentUser } = useAuth();

  const user = getCurrentUser();
  const patientId = patient?.user_id;

  // Load patient data on component mount
  useEffect(() => {
    if (user?.id) {
      loadPatientData();
    }
  }, [user?.id]);

  // Load appointments when patient is available
  useEffect(() => {
    if (patientId) {
      loadAppointments();
    }
  }, [patientId]);

  // Calculate upcoming appointments and next appointment
  useEffect(() => {
    if (appointments.length > 0) {
      const now = new Date();
      const upcoming = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointment_datetime);
        const isUpcoming = appointmentDate > now;
        const isNotCancelled = appointment.status !== "cancelled";
        return isUpcoming && isNotCancelled;
      });

      setUpcomingCount(upcoming.length);

      // Find the next appointment (soonest)
      if (upcoming.length > 0) {
        const sorted = [...upcoming].sort(
          (a, b) =>
            new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
        );
        setNextAppointment(sorted[0]);
      } else {
        setNextAppointment(null);
      }
    } else {
      setUpcomingCount(0);
      setNextAppointment(null);
    }
  }, [appointments]);

  const loadPatientData = async () => {
    if (user?.id) {
      await getPatientProfileByUserId(user.id);
    }
  };

  const loadAppointments = async () => {
    if (patientId) {
      await getAppointmentsByPatient(patientId);
    }
  };

  // Appointment reminder modal handler
  const handleAppointmentClick = () => {
    if (upcomingCount > 0) {
      setModalState((prev) => ({ ...prev, appointmentReminder: true }));
    } else {
      showToast("No upcoming appointments", "info");
      window.location.href = "/patient/find-clinic";
    }
  };

  const handleHealthScoreClick = () => {
    setModalState((prev) => ({ ...prev, healthScoreDetails: true }));
  };

  const handleEmergencyClick = () => {
    setModalState((prev) => ({ ...prev, emergencyContacts: true }));
  };

  const handleNutritionClick = () => {
    setModalState((prev) => ({ ...prev, nutritionTipDetails: true }));
    setSelectedTip({
      title: "Daily Nutrition Guide",
      content:
        "Children aged 2-5 need 5 servings of fruits and vegetables daily. Include protein sources like beans, eggs, or chicken in each meal.",
    });
  };

  const handleSymptomCheckerClick = () => {
    showToast("Redirecting to Symptom Checker...", "info");
    setTimeout(() => {
      window.location.href = "/patient/symptom-checker";
    }, 1000);
  };

  const getPatientName = () => {
    if (patient?.first_name) {
      return patient.first_name;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    return "User";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // Check if it's today
    if (date.toDateString() === now.toDateString()) {
      return "today";
    }

    // Check if it's tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return "tomorrow";
    }

    // Return relative time
    const diffTime = Math.abs(date - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `in ${weeks} week${weeks > 1 ? "s" : ""}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `in ${months} month${months > 1 ? "s" : ""}`;
    }
  };

  // Get upcoming appointments for modal
  const getUpcomingForModal = () => {
    const now = new Date();
    return appointments
      .filter((appointment) => {
        const appointmentDate = new Date(appointment.appointment_datetime);
        const isUpcoming = appointmentDate > now;
        const isNotCancelled = appointment.status !== "cancelled";
        return isUpcoming && isNotCancelled;
      })
      .sort(
        (a, b) =>
          new Date(a.appointment_datetime) - new Date(b.appointment_datetime)
      )
      .slice(0, 3); // Show only next 3 appointments
  };

  const modalAppointments = getUpcomingForModal();

  return (
    <div>
      {/* Modals */}
      {/* Appointment Reminder Modal */}
      <Modal
        isOpen={modalState.appointmentReminder}
        onClose={() =>
          setModalState((prev) => ({ ...prev, appointmentReminder: false }))
        }
        title="Appointment Reminders"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <IoMdCalendar className="h-8 w-8 text-blue-600 dark:text-blue-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Upcoming Appointments
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              You have {upcomingCount} scheduled appointment
              {upcomingCount !== 1 ? "s" : ""}
            </p>
          </div>

          {modalAppointments.length > 0 ? (
            <div className="space-y-3">
              {modalAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="font-medium">
                        {appointment.reason_for_visit || "Appointment"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(
                          appointment.appointment_datetime
                        ).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {appointment.status === "confirmed"
                        ? "Confirmed"
                        : "Pending"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No upcoming appointments scheduled
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({
                  ...prev,
                  appointmentReminder: false,
                }))
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Close
            </button>
            <button
              onClick={() => {
                window.location.href = "/patient/appointments";
                showToast("Navigating to appointments...", "info");
              }}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              Manage Appointments
            </button>
          </div>
        </div>
      </Modal>

      {/* Health Score Details Modal */}
      <Modal
        isOpen={modalState.healthScoreDetails}
        onClose={() =>
          setModalState((prev) => ({ ...prev, healthScoreDetails: false }))
        }
        title="Health Score Details"
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <IoMdMedical className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Your Health Status
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              {patient?.health_status || "No health status recorded yet"}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Upcoming Appointments
              </span>
              <span className="font-medium text-blue-600">{upcomingCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Recent Visits
              </span>
              <span className="font-medium text-green-600">
                {appointments.filter((a) => a.status === "completed").length}
              </span>
            </div>
            {patient?.blood_type && (
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Blood Type
                </span>
                <span className="font-medium text-red-600">
                  {patient.blood_type}
                </span>
              </div>
            )}
            {patient?.allergies && (
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300">
                  Allergies
                </span>
                <span className="font-medium text-yellow-600">
                  {patient.allergies.split(",").length} recorded
                </span>
              </div>
            )}
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Regular check-ups and maintaining your health profile contribute
                to better healthcare outcomes.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = "/patient/health-tracker";
              showToast("Opening health tracker...", "info");
            }}
            className="w-full rounded-lg bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
          >
            View Health Profile
          </button>
        </div>
      </Modal>

      {/* Emergency Contacts Modal */}
      <Modal
        isOpen={modalState.emergencyContacts}
        onClose={() =>
          setModalState((prev) => ({ ...prev, emergencyContacts: false }))
        }
        title="Emergency Contacts & Information"
        size="lg"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <MdWarning className="h-8 w-8 text-red-600 dark:text-red-300" />
            </div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Emergency Information
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Save these contacts for emergencies
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
              <div className="mb-2 font-bold text-red-700 dark:text-red-300">
                Medical Emergencies
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Ambulance
                  </span>
                  <span className="font-bold">10177</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Poison Control
                  </span>
                  <span className="font-bold">0861 555 777</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="mb-2 font-bold text-blue-700 dark:text-blue-300">
                Crisis Support
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Police
                  </span>
                  <span className="font-bold">10111</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Mental Health
                  </span>
                  <span className="font-bold">0800 567 567</span>
                </div>
              </div>
            </div>
          </div>

          {patient?.emergency_contact_name && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="mb-2 font-bold text-green-700 dark:text-green-300">
                Your Emergency Contact
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Contact Name
                  </span>
                  <span className="font-bold">
                    {patient.emergency_contact_name}
                  </span>
                </div>
                {patient.emergency_contact_phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Contact Phone
                    </span>
                    <span className="font-bold">
                      {patient.emergency_contact_phone}
                    </span>
                  </div>
                )}
                {patient.emergency_contact_relationship && (
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Relationship
                    </span>
                    <span className="font-bold">
                      {patient.emergency_contact_relationship}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-yellow-600" />
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                <strong>Emergency Checklist:</strong> Have your medical aid
                number, ID numbers, and current medications ready when calling
                emergency services.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: "Emergency Contacts",
                    text: "Emergency Contacts: Ambulance: 10177, Police: 10111, Poison Control: 0861 555 777",
                  });
                } else {
                  showToast(
                    "Emergency contacts copied to clipboard!",
                    "success"
                  );
                }
              }}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Share Contacts
            </button>
          </div>
        </div>
      </Modal>

      {/* Nutrition Tips Modal */}
      <Modal
        isOpen={modalState.nutritionTipDetails}
        onClose={() =>
          setModalState((prev) => ({ ...prev, nutritionTipDetails: false }))
        }
        title={selectedTip?.title || "Nutrition Tips"}
        size="md"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <FaAppleAlt className="h-8 w-8 text-orange-600 dark:text-orange-300" />
            </div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Daily Nutrition Guide
            </h4>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-2 font-medium">For Children (2-5 years):</div>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li>• 5 servings of fruits and vegetables daily</li>
                <li>• Protein: beans, eggs, chicken, fish</li>
                <li>• Dairy: 2-3 servings of milk or yogurt</li>
                <li>• Limit processed foods and sugars</li>
              </ul>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-2 font-medium">Recommended Daily:</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded bg-green-50 p-2 text-center dark:bg-green-900/20">
                  <div className="font-bold text-green-700 dark:text-green-300">
                    Fruits
                  </div>
                  <div>2-3 servings</div>
                </div>
                <div className="rounded bg-blue-50 p-2 text-center dark:bg-blue-900/20">
                  <div className="font-bold text-blue-700 dark:text-blue-300">
                    Veggies
                  </div>
                  <div>2-3 servings</div>
                </div>
                <div className="rounded bg-purple-50 p-2 text-center dark:bg-purple-900/20">
                  <div className="font-bold text-purple-700 dark:text-purple-300">
                    Protein
                  </div>
                  <div>2 servings</div>
                </div>
                <div className="rounded bg-yellow-50 p-2 text-center dark:bg-yellow-900/20">
                  <div className="font-bold text-yellow-700 dark:text-yellow-300">
                    Grains
                  </div>
                  <div>4-6 servings</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              window.location.href = "/patient/nutrition";
              showToast("Opening nutrition guide...", "info");
            }}
            className="w-full rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600"
          >
            View Full Nutrition Guide
          </button>
        </div>
      </Modal>

      {/* Welcome Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Welcome back, {getPatientName()}! 👋
        </h3>
        {nextAppointment ? (
          <p className="text-gray-600 dark:text-gray-300">
            Your next appointment is{" "}
            {formatDate(nextAppointment.appointment_datetime)}. Stay healthy!
          </p>
        ) : (
          <p className="text-gray-600 dark:text-gray-300">
            You have no upcoming appointments. Book a check-up to stay on top of
            your health!
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<IoMdCalendar className="h-7 w-7" />}
          title={"Upcoming Appointments"}
          subtitle={upcomingCount.toString()}
          onClick={handleAppointmentClick}
          bgColor="bg-blue-500"
          isLoading={appointmentsLoading}
        />
        <Widget
          icon={<IoMdMedical className="h-7 w-7" />}
          title={"Health Status"}
          subtitle={patient?.health_status || "Not set"}
          onClick={handleHealthScoreClick}
          bgColor="bg-green-500"
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Unread Messages"}
          subtitle={"0"}
          onClick={() => {
            showToast("Opening messages...", "info");
            window.location.href = "/patient/telemedicine";
          }}
          bgColor="bg-purple-500"
        />
        <Widget
          icon={<FaAppleAlt className="h-7 w-7" />}
          title={"Nutrition Tips"}
          subtitle={"5 new"}
          onClick={handleNutritionClick}
          bgColor="bg-orange-500"
        />
      </div>

      {/* Loading State for Appointments */}
      {appointmentsLoading && (
        <div className="mt-6 rounded-[20px] bg-white p-6 shadow-sm dark:bg-navy-800">
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              Loading appointments...
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!appointmentsLoading && (
        <div className="mt-6">
          <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
            Quick Actions
          </h4>
          <QuickActions />
        </div>
      )}

      {/* Health Tips Carousel */}
      <div className="mt-6">
        <HealthTipsCarousel />
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-5">
          <UpcomingAppointments />
          <ClinicSuggestions />
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Symptom Checker Card */}
          <div className="rounded-[20px] bg-gradient-to-r from-blue-500 to-brand-400 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xl font-bold">Symptom Checker</h5>
                <p className="mt-2 text-blue-100">
                  Check symptoms and get instant health advice
                </p>
              </div>
              <FaStethoscope className="h-12 w-12 opacity-80" />
            </div>
            <button
              onClick={handleSymptomCheckerClick}
              className="linear mt-4 w-full rounded-xl bg-white py-3 font-medium text-brand-500 transition duration-200 hover:bg-gray-100"
            >
              Start Symptom Check
            </button>
          </div>

          {/* Emergency Card */}
          <div
            onClick={handleEmergencyClick}
            className="cursor-pointer rounded-[20px] border border-red-200 bg-red-50 p-6 transition-all duration-300 hover:scale-[1.02] hover:border-red-300 dark:border-red-800 dark:bg-red-900/20"
          >
            <h5 className="mb-3 text-lg font-bold text-red-700 dark:text-red-300">
              🚨 Emergency Contacts
            </h5>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Ambulance
                </span>
                <span className="font-bold">10177</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Police</span>
                <span className="font-bold">10111</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Poison Control
                </span>
                <span className="font-bold">0861 555 777</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">
                  Mental Health Crisis
                </span>
                <span className="font-bold">0800 567 567</span>
              </li>
            </ul>
          </div>

          {/* Health Profile Summary */}
          {patient && (
            <div className="rounded-[20px] bg-gradient-to-r from-green-500 to-teal-400 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xl font-bold">Health Profile</h5>
                  <p className="mt-2 text-green-100">
                    Your health information at a glance
                  </p>
                </div>
                <IoMdMedical className="h-12 w-12 opacity-80" />
              </div>
              <div className="mt-4 space-y-2">
                {patient.blood_type && (
                  <div className="flex justify-between">
                    <span>Blood Type</span>
                    <span className="font-bold">{patient.blood_type}</span>
                  </div>
                )}
                {patient.allergies && (
                  <div className="flex justify-between">
                    <span>Allergies</span>
                    <span className="font-bold">
                      {patient.allergies.split(",").length} recorded
                    </span>
                  </div>
                )}
                {patient.medications && (
                  <div className="flex justify-between">
                    <span>Medications</span>
                    <span className="font-bold">
                      {patient.medications.split(",").length} active
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  window.location.href = "/patient/health-profile";
                  showToast("Opening health profile...", "info");
                }}
                className="linear mt-4 w-full rounded-xl bg-white py-3 font-medium text-green-600 transition duration-200 hover:bg-gray-100"
              >
                View Full Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
