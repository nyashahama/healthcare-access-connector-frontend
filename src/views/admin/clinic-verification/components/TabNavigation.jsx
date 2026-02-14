import React from "react";

const TabNavigation = ({ selectedTab, setSelectedTab, clinics }) => {
  const tabs = [
    { id: "all", label: "All Clinics", count: clinics?.length || 0 },
    {
      id: "pending",
      label: "Pending",
      count:
        clinics?.filter((c) => c.verification_status === "pending").length || 0,
    },
    {
      id: "verified",
      label: "Verified",
      count:
        clinics?.filter((c) => c.verification_status === "verified").length ||
        0,
    },
    {
      id: "rejected",
      label: "Rejected",
      count:
        clinics?.filter((c) => c.verification_status === "rejected").length ||
        0,
    },
  ];

  return (
    <div className="mb-6 flex space-x-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setSelectedTab(tab.id)}
          className={`flex items-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
            selectedTab === tab.id
              ? "bg-brand-500 text-white shadow-lg"
              : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-navy-800 dark:text-gray-300"
          }`}
        >
          {tab.label}
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
              selectedTab === tab.id
                ? "bg-white/20 text-white"
                : "bg-gray-200 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
