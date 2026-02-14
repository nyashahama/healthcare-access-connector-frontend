import React from "react";
import { MdVerifiedUser, MdWarning, MdEmail, MdSchedule } from "react-icons/md";

const PendingActionsCard = () => {
  const pendingActions = [
    {
      icon: <MdVerifiedUser className="mr-3 h-5 w-5 text-yellow-500" />,
      label: "Clinics to Verify",
      count: 8,
      color: "yellow",
    },
    {
      icon: <MdWarning className="mr-3 h-5 w-5 text-red-500" />,
      label: "Flagged Content",
      count: 3,
      color: "red",
    },
    {
      icon: <MdEmail className="mr-3 h-5 w-5 text-blue-500" />,
      label: "Pending Emails",
      count: 47,
      color: "blue",
    },
    {
      icon: <MdSchedule className="mr-3 h-5 w-5 text-purple-500" />,
      label: "Maintenance Tasks",
      count: 5,
      color: "purple",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      yellow:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
      red: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      purple:
        "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        🚨 Pending Actions
      </h5>
      <div className="space-y-3">
        {pendingActions.map((action, index) => (
          <div
            key={index}
            className="flex items-center justify-between transition-all duration-300 hover:scale-[1.02]"
          >
            <div className="flex items-center">
              {action.icon}
              <span className="text-gray-600 dark:text-gray-300">
                {action.label}
              </span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-sm font-bold transition-all duration-200 hover:scale-105 ${getColorClasses(
                action.color
              )}`}
            >
              {action.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingActionsCard;
