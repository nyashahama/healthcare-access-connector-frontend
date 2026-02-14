import React from "react";
import { MdVisibility, MdRefresh, MdBackup, MdWarning } from "react-icons/md";
import { getStatusBadge, getSeverityColor } from "./dashboardUtils";

const SystemAlertsPanel = ({
  alerts,
  onViewDetails,
  onRestartSystem,
  onBackupSystem,
}) => {
  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          🚨 System Alerts
        </h5>
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700 dark:bg-red-900 dark:text-red-300">
          {alerts.length} Active
        </span>
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:border-brand-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <MdWarning
                    className={`mr-2 h-4 w-4 ${getSeverityColor(
                      alert.severity
                    )}`}
                  />
                  <span className="font-medium text-navy-700 dark:text-white">
                    {alert.system}
                  </span>
                  {getStatusBadge(alert.status)}
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {alert.message}
                </p>
                <span className="mt-1 text-xs text-gray-500">
                  {alert.timestamp}
                </span>
              </div>
            </div>
            <div className="mt-3 flex justify-end space-x-2">
              <button
                onClick={() => onViewDetails(alert.system)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-xs font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
              >
                <MdVisibility className="h-3 w-3" />
              </button>
              <button
                onClick={() => onRestartSystem(alert.system)}
                className="rounded-lg border border-yellow-300 px-3 py-1 text-xs font-medium text-yellow-700 transition-all duration-200 hover:scale-105 hover:bg-yellow-50 dark:border-yellow-700 dark:text-yellow-400"
              >
                <MdRefresh className="h-3 w-3" />
              </button>
              <button
                onClick={() => onBackupSystem(alert.system)}
                className="rounded-lg border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400"
              >
                <MdBackup className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlertsPanel;
