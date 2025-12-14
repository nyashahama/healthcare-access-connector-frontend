import { useState } from "react";
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

const PatientDashboard = () => {
  const [modalState, setModalState] = useState({
    appointmentReminder: false,
    healthScoreDetails: false,
    emergencyContacts: false,
    nutritionTipDetails: false,
  });
  const [selectedTip, setSelectedTip] = useState(null);
  const { showToast } = useToast();

  // Appointment reminder modal handler
  const handleAppointmentClick = () => {
    setModalState((prev) => ({ ...prev, appointmentReminder: true }));
  };

  const handleHealthScoreClick = () => {
    setModalState((prev) => ({ ...prev, healthScoreDetails: true }));
  };

  const handleEmergencyClick = () => {
    setModalState((prev) => ({ ...prev, emergencyContacts: true }));
  };

  const handleNutritionClick = () => {
    setModalState((prev) => ({ ...prev, nutritionTipDetails: true }));
    // Get current nutrition tip from carousel or other source
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
              You have 3 scheduled appointments
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Child Check-up</div>
                  <div className="text-sm text-gray-500">
                    Tomorrow, 10:00 AM
                  </div>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="flex justify-between">
                <div>
                  <div className="font-medium">Follow-up Visit</div>
                  <div className="text-sm text-gray-500">Dec 20, 2:30 PM</div>
                </div>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
                  Confirmed
                </span>
              </div>
            </div>
          </div>

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
              Your Health Score: Good
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Based on recent health metrics
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Vaccination Status
              </span>
              <span className="font-medium text-green-600">Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Check-ups
              </span>
              <span className="font-medium text-green-600">Up to date</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Growth Metrics
              </span>
              <span className="font-medium text-yellow-600">Normal range</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Nutrition Score
              </span>
              <span className="font-medium text-blue-600">85%</span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Regular check-ups and vaccinations contribute to maintaining a
                good health score.
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
            View Detailed Health Tracker
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
          Welcome back, Sarah! 👋
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Your child's next check-up is in 2 weeks. Stay healthy!
        </p>
      </div>

      {/* Quick Stats */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<IoMdCalendar className="h-7 w-7" />}
          title={"Upcoming Appointments"}
          subtitle={"3"}
          onClick={handleAppointmentClick}
          bgColor="bg-blue-500"
        />
        <Widget
          icon={<IoMdMedical className="h-7 w-7" />}
          title={"Health Score"}
          subtitle={"Good"}
          onClick={handleHealthScoreClick}
          bgColor="bg-green-500"
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Unread Messages"}
          subtitle={"2"}
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

      {/* Quick Actions */}
      <div className="mt-6">
        <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
          Quick Actions
        </h4>
        <QuickActions />
      </div>

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
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
