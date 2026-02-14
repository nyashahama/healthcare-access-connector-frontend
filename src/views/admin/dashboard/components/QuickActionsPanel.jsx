import React from "react";
import { MdNotifications, MdSettings } from "react-icons/md";

const QuickActionsPanel = ({
  onSendNotification,
  onOpenSettings,
  onClearAlerts,
}) => {
  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          🎯 Quick Controls
        </h5>
        <button
          onClick={onClearAlerts}
          className="rounded-lg px-3 py-1 text-sm font-medium text-gray-600 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-navy-700"
        >
          Clear All
        </button>
      </div>
      <div className="mt-4 flex space-x-3">
        <button
          onClick={onSendNotification}
          className="flex flex-1 items-center justify-center rounded-lg border border-blue-300 bg-blue-50 py-3 font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
        >
          <MdNotifications className="mr-2 h-5 w-5" />
          Send Notification
        </button>
        <button
          onClick={onOpenSettings}
          className="flex flex-1 items-center justify-center rounded-lg border border-gray-300 bg-gray-50 py-3 font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:bg-navy-700 dark:text-gray-300"
        >
          <MdSettings className="mr-2 h-5 w-5" />
          System Settings
        </button>
      </div>
    </div>
  );
};

export default QuickActionsPanel;
