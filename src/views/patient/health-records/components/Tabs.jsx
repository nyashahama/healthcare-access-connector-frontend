import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    "overview",
    "conditions",
    "allergies",
    "medications",
    "vaccinations",
    "surgeries",
    "familyHistory",
  ];

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300"
            }`}
          >
            {tab
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
