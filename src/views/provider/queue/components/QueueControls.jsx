import React from "react";
import Card from "components/card";

const QueueControls = ({
  stats,
  onCallNext,
  onMarkAllSeen,
  onClearQueue,
  settings,
  onToggleSetting,
}) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Queue Controls
      </h4>
      <div className="space-y-4">
        {/* Settings */}
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h5 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
            Queue Settings
          </h5>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Auto-assign Patients
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.autoAssign}
                  onChange={(e) =>
                    onToggleSetting("autoAssign", e.target.checked)
                  }
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Send Wait Time Updates
              </span>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={settings.sendUpdates}
                  onChange={(e) =>
                    onToggleSetting("sendUpdates", e.target.checked)
                  }
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
          <h5 className="mb-2 font-medium text-navy-700 dark:text-white">
            Quick Actions
          </h5>
          <div className="space-y-2">
            <button
              onClick={onCallNext}
              className="linear w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600"
            >
              Call Next Patient
            </button>
            <button
              onClick={onMarkAllSeen}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
            >
              Mark All as Seen
            </button>
            <button
              onClick={onClearQueue}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
            >
              Clear Queue
            </button>
          </div>
        </div>

        {/* Queue Status */}
        <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <h5 className="mb-2 font-medium text-yellow-800 dark:text-yellow-300">
            Queue Status
          </h5>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Wait Time</span>
              <span className="font-medium">{stats.avgWaitTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Longest Wait</span>
              <span className="font-medium">45 minutes</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Staff Available</span>
              <span className="font-medium text-green-600">3/4</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QueueControls;
