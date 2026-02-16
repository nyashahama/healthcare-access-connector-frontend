import React from "react";

const ClinicManagementTabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-navy-600">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center rounded-t-lg px-4 py-3 text-sm font-medium transition ${
              activeTab === tab.id
                ? "border-b-2 border-brand-500 bg-white text-brand-500 dark:bg-navy-800"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-navy-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClinicManagementTabs;
