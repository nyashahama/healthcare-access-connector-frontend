import {
  MdVerifiedUser,
  MdPeople,
  MdAnalytics,
  MdWarning,
} from "react-icons/md";
import { FaClinicMedical, FaUserCheck } from "react-icons/fa";
import Widget from "components/widget/Widget";
import SystemHealth from "../components/SystemHealth";
import RegistrationQueue from "../components/RegistrationQueue";
import AnalyticsChart from "../components/AnalyticsChart";

const SystemDashboard = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          System Administrator Dashboard 🛡️
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Monitoring healthcare access across South Africa
        </p>
      </div>

      {/* System Stats */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<FaClinicMedical className="h-7 w-7" />}
          title={"Active Clinics"}
          subtitle={"247"}
          trend="+12%"
          link="/admin/clinic-verification"
        />
        <Widget
          icon={<MdPeople className="h-7 w-7" />}
          title={"Total Patients"}
          subtitle={"12,458"}
          trend="+23%"
          link="/admin/user-management"
        />
        <Widget
          icon={<FaUserCheck className="h-7 w-7" />}
          title={"Active Providers"}
          subtitle={"589"}
          trend="+8%"
          link="/admin/user-management"
        />
        <Widget
          icon={<MdAnalytics className="h-7 w-7" />}
          title={"Appointments Today"}
          subtitle={"1,234"}
          trend="+15%"
          link="/admin/analytics"
        />
      </div>

      {/* System Health */}
      <div className="mt-5">
        <SystemHealth />
      </div>

      {/* Main Content Grid */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Registration Queue */}
        <div className="lg:col-span-2">
          <RegistrationQueue />
        </div>

        {/* Quick Metrics */}
        <div className="space-y-5">
          <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
            <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              🚨 Pending Actions
            </h5>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MdVerifiedUser className="mr-3 h-5 w-5 text-yellow-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Clinics to Verify
                  </span>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                  8
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MdWarning className="mr-3 h-5 w-5 text-red-500" />
                  <span className="text-gray-600 dark:text-gray-300">
                    Flagged Content
                  </span>
                </div>
                <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
                  3
                </span>
              </div>
            </div>
          </div>

          {/* SMS Credits */}
          <div className="to-emerald-400 rounded-[20px] bg-gradient-to-r from-green-500 p-6 text-white">
            <h5 className="mb-2 text-lg font-bold">SMS Credits</h5>
            <div className="mb-4">
              <div className="flex justify-between text-sm">
                <span>Remaining</span>
                <span className="font-bold">12,458</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-green-200">
                <div className="h-2 w-3/4 rounded-full bg-white"></div>
              </div>
            </div>
            <button className="linear w-full rounded-xl bg-white py-2 font-medium text-green-600 transition duration-200 hover:bg-gray-100">
              Add Credits
            </button>
          </div>
        </div>
      </div>

      {/* Analytics */}
      <div className="mt-5">
        <AnalyticsChart />
      </div>
    </div>
  );
};

export default SystemDashboard;
