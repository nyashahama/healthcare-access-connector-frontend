import React from "react";
import {
  FaMapMarkerAlt,
  FaStethoscope,
  FaCommentMedical,
  FaAppleAlt,
} from "react-icons/fa";

const QuickActions = () => {
  const actions = [
    {
      icon: <FaMapMarkerAlt />,
      label: "Find Clinic",
      color: "bg-blue-500",
      description: "Search nearby healthcare facilities",
    },
    {
      icon: <FaStethoscope />,
      label: "Check Symptoms",
      color: "bg-green-500",
      description: "Get instant health advice",
    },
    {
      icon: <FaCommentMedical />,
      label: "Chat with Doctor",
      color: "bg-purple-500",
      description: "24/7 telemedicine service",
    },
    {
      icon: <FaAppleAlt />,
      label: "Nutrition Tips",
      color: "bg-orange-500",
      description: "Child nutrition guides",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, index) => (
        <button
          key={index}
          className={`${action.color} linear flex flex-col items-center justify-center rounded-xl p-6 text-white transition duration-200 hover:opacity-90`}
        >
          <div className="mb-3 text-3xl">{action.icon}</div>
          <span className="mb-2 text-lg font-bold">{action.label}</span>
          <span className="text-center text-sm opacity-90">
            {action.description}
          </span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
