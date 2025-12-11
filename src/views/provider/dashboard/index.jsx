import { IoMdPeople, IoMdTime, IoMdChatbubbles } from "react-icons/io";
import { MdCalendarToday, MdLocalHospital, MdAssignment } from "react-icons/md";
import { FaUserMd } from "react-icons/fa";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import PatientQueue from "../components/PatientQueue";
import ClinicStats from "../components/ClinicStats";
import Card from "components/card";

const DoctorDashboard = () => {
  // Doctor-specific data
  const doctorStats = {
    name: "Dr. Michael Smith",
    specialization: "General Practitioner",
    clinic: "Sunninghill Community Clinic",
    todayAppointments: 12,
    waitingPatients: 3,
    unreadMessages: 7,
    completionRate: "92%",
  };

  const recentActivity = [
    { time: "10:30 AM", action: "Completed consultation with John Doe" },
    { time: "09:15 AM", action: "Updated patient notes for Sarah Johnson" },
    { time: "Yesterday", action: "Prescribed medication for Michael Brown" },
  ];

  return (
    <div>
      {/* Header with Doctor Info */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-2xl font-bold text-white">
            MS
          </div>
          <div>
            <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
              Welcome back, {doctorStats.name}! 👨‍⚕️
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {doctorStats.specialization} at {doctorStats.clinic}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Today's Appointments"}
          subtitle={doctorStats.todayAppointments.toString()}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Waiting Patients"}
          subtitle={doctorStats.waitingPatients.toString()}
          link="/provider/queue"
        />
        <Widget
          icon={<IoMdTime className="h-7 w-7" />}
          title={"Completion Rate"}
          subtitle={doctorStats.completionRate}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Unread Messages"}
          subtitle={doctorStats.unreadMessages.toString()}
          link="/provider/telemedicine"
        />
      </div>

      {/* Main Content */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <TodaySchedule />
        </div>

        {/* Patient Queue */}
        <div>
          <PatientQueue />
        </div>
      </div>

      {/* Clinic Stats - Doctor's Perspective */}
      <div className="mt-5">
        <Card extra="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Your Performance This Week
            </h4>
            <span className="text-sm text-gray-600">Compared to last week</span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                42
              </p>
              <p className="text-sm text-gray-600">Patients Seen</p>
              <p className="text-xs text-green-600">+8%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                94%
              </p>
              <p className="text-sm text-gray-600">Satisfaction</p>
              <p className="text-xs text-green-600">+2%</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                18 min
              </p>
              <p className="text-sm text-gray-600">Avg. Consultation</p>
              <p className="text-xs text-red-600">-3 min</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-navy-700 dark:text-white">
                0
              </p>
              <p className="text-sm text-gray-600">No-Shows</p>
              <p className="text-xs text-green-600">-2</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card extra="p-6 lg:col-span-2">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            Recent Activity
          </h4>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 mt-1 h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm text-navy-700 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card extra="p-6">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            Quick Actions
          </h4>
          <div className="space-y-3">
            <button className="linear flex w-full items-center justify-center rounded-lg bg-brand-500 py-3 text-white transition duration-200 hover:bg-brand-600">
              <MdLocalHospital className="mr-2 h-5 w-5" />
              Start Telemedicine Chat
            </button>
            <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-3 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
              <MdAssignment className="mr-2 h-5 w-5" />
              View Patient Records
            </button>
            <button className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-3 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
              <FaUserMd className="mr-2 h-5 w-5" />
              Update Availability
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;
