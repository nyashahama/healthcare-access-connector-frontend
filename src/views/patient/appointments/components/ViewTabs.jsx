import React from "react";

const ViewTabs = ({ currentView, onViewChange, categorizedAppointments }) => {
  const tabs = [
    { id: "upcoming", label: "Upcoming" },
    { id: "past", label: "Past" },
    { id: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="mb-6">
      <div className="inline-flex w-full rounded-xl bg-gray-100 p-1 dark:bg-navy-700 lg:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`min-w-[140px] rounded-lg px-6 py-3 text-sm font-bold capitalize transition-all ${
              currentView === tab.id
                ? "bg-white text-brand-500 shadow-lg dark:bg-navy-800"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
            }`}
          >
            {tab.label}
            <span className="ml-2 text-xs">
              ({categorizedAppointments[tab.id].length})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewTabs;
