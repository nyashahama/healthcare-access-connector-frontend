import React from "react";
import Card from "components/card";

const QuickActionsCard = () => {
  const settings = [
    { label: "Auto-confirm", id: "autoConfirm" },
    { label: "Send reminders", id: "sendReminders" },
    { label: "Allow walk-ins", id: "allowWalkIns" },
  ];

  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Quick Actions
      </h4>
      <div className="space-y-3">
        {settings.map((setting) => (
          <div key={setting.id} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{setting.label}</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" className="peer sr-only" defaultChecked />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
            </label>
          </div>
        ))}
      </div>
      <button className="linear mt-4 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
        Manage Settings
      </button>
    </Card>
  );
};

export default QuickActionsCard;
