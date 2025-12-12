// views/patient/dashboard/index.jsx - ENHANCED VERSION
import { IoMdCalendar, IoMdMedical, IoMdChatbubbles } from "react-icons/io";
import { FaStethoscope, FaMapMarkerAlt, FaAppleAlt } from "react-icons/fa";
import Widget from "components/widget/Widget";
import UpcomingAppointments from "../components/UpcomingAppointments";
import QuickActions from "../components/QuickActions";
import ClinicSuggestions from "../components/ClinicSuggestions";
import HealthTipsCarousel from "../components/HealthTipsCarousel";

const PatientDashboard = () => {
  return (
    <div>
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
          link="/patient/appointments"
          bgColor="bg-blue-500"
        />
        <Widget
          icon={<IoMdMedical className="h-7 w-7" />}
          title={"Health Score"}
          subtitle={"Good"}
          link="/patient/health-tracker"
          bgColor="bg-green-500"
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Unread Messages"}
          subtitle={"2"}
          link="/patient/telemedicine"
          bgColor="bg-purple-500"
        />
        <Widget
          icon={<FaAppleAlt className="h-7 w-7" />}
          title={"Nutrition Tips"}
          subtitle={"5 new"}
          link="/patient/nutrition"
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
              onClick={() =>
                (window.location.href = "/patient/symptom-checker")
              }
              className="linear mt-4 w-full rounded-xl bg-white py-3 font-medium text-brand-500 transition duration-200 hover:bg-gray-100"
            >
              Start Symptom Check
            </button>
          </div>

          {/* Emergency Card */}
          <div className="rounded-[20px] border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
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
