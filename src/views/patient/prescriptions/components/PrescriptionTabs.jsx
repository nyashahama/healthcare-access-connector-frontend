import React from "react";

const PrescriptionTabs = ({ view, setView, counts }) => {
  const tabs = [
    { key: "active", label: "Active" },
    { key: "requested", label: "Requested" },
    { key: "expired", label: "Expired" },
  ];

  return (
    <div className="mb-6">
      <div className="flex space-x-2 rounded-xl bg-gray-100 p-1 dark:bg-navy-700">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
              view === tab.key
                ? "bg-white text-brand-500 shadow-sm dark:bg-navy-800"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
            }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionTabs;
