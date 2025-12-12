import React from "react";
import {
  MdLocalHospital,
  MdAssignment,
  MdVideoCall,
  MdSchedule,
  MdPeople,
  MdBusiness,
  MdMedicalServices,
} from "react-icons/md";
import { FaUserMd, FaUserNurse } from "react-icons/fa";

const QuickActions = ({ userRole }) => {
  const actions = {
    clinic_admin: [
      {
        label: "Manage Staff",
        icon: <MdPeople />,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
        link: "/provider/staff",
      },
      {
        label: "Update Clinic Hours",
        icon: <MdBusiness />,
        color: "bg-green-100 text-green-800 dark:bg-green-900/30",
        link: "/provider/clinic-management",
      },
      {
        label: "Generate Reports",
        icon: <MdAssignment />,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30",
        link: "/provider/clinic-management",
      },
    ],
    doctor: [
      {
        label: "Start Telemedicine",
        icon: <MdVideoCall />,
        color: "bg-brand-100 text-brand-800 dark:bg-brand-900/30",
        link: "/provider/telemedicine",
      },
      {
        label: "View Patient Records",
        icon: <MdAssignment />,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30",
        link: "/provider/appointments",
      },
      {
        label: "Update Availability",
        icon: <MdSchedule />,
        color: "bg-green-100 text-green-800 dark:bg-green-900/30",
        link: "/provider/profile",
      },
    ],
    nurse: [
      {
        label: "Check Patient Queue",
        icon: <MdPeople />,
        color: "bg-brand-100 text-brand-800 dark:bg-brand-900/30",
        link: "/provider/queue",
      },
      {
        label: "Vaccination Station",
        icon: <MdMedicalServices />,
        color: "bg-green-100 text-green-800 dark:bg-green-900/30",
        link: "/provider/appointments",
      },
      {
        label: "Health Screening",
        icon: <MdLocalHospital />,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30",
        link: "/provider/queue",
      },
    ],
  };

  const roleActions = actions[userRole] || [];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Quick Actions
      </h4>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {roleActions.map((action, index) => (
          <a
            key={index}
            href={action.link}
            className={`flex items-center rounded-xl p-4 transition hover:opacity-90 ${action.color}`}
          >
            <div className="mr-3">{action.icon}</div>
            <span className="font-medium">{action.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
