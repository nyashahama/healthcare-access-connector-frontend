import { IoMdPeople, IoMdTime, IoMdChatbubbles } from "react-icons/io";
import { MdCalendarToday, MdLocalHospital } from "react-icons/md";
import Widget from "components/widget/Widget";
import TodaySchedule from "../components/TodaySchedule";
import PatientQueue from "../components/PatientQueue";
import ClinicStats from "../components/ClinicStats";

const ProviderDashboard = () => {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Good morning, Dr. Smith! 👨‍⚕️
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          You have 12 appointments today. 3 patients are waiting in telemedicine
          queue.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget
          icon={<MdCalendarToday className="h-7 w-7" />}
          title={"Today's Appointments"}
          subtitle={"12"}
          link="/provider/appointments"
        />
        <Widget
          icon={<IoMdPeople className="h-7 w-7" />}
          title={"Waiting Patients"}
          subtitle={"3"}
          link="/provider/queue"
        />
        <Widget
          icon={<IoMdTime className="h-7 w-7" />}
          title={"Avg. Wait Time"}
          subtitle={"15 min"}
          link="/provider/queue"
        />
        <Widget
          icon={<IoMdChatbubbles className="h-7 w-7" />}
          title={"Unread Messages"}
          subtitle={"7"}
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

      {/* Clinic Stats */}
      <div className="mt-5">
        <ClinicStats />
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <button className="linear rounded-xl bg-brand-500 py-4 text-white transition duration-200 hover:bg-brand-600">
          <MdLocalHospital className="mx-auto mb-2 h-6 w-6" />
          <span>Start Telemedicine Chat</span>
        </button>
        <button className="linear rounded-xl bg-green-500 py-4 text-white transition duration-200 hover:bg-green-600">
          <MdCalendarToday className="mx-auto mb-2 h-6 w-6" />
          <span>Add Appointment Slot</span>
        </button>
        <button className="linear rounded-xl bg-purple-500 py-4 text-white transition duration-200 hover:bg-purple-600">
          <IoMdPeople className="mx-auto mb-2 h-6 w-6" />
          <span>View Patient Records</span>
        </button>
      </div>
    </div>
  );
};

export default ProviderDashboard;
