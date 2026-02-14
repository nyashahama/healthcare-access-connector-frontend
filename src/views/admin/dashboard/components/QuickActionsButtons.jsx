import React from "react";

const QuickActionsButtons = ({
  onDownloadLogs,
  onBackupSystem,
  onClearCache,
  onGenerateReport,
}) => {
  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <h5 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        ⚡ Quick Actions
      </h5>
      <div className="space-y-3">
        <button
          onClick={onDownloadLogs}
          className="w-full rounded-lg bg-blue-50 py-3 text-sm font-medium text-blue-700 transition-all duration-200 hover:scale-105 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300"
        >
          Download System Logs
        </button>
        <button
          onClick={onBackupSystem}
          className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
        >
          Create Full Backup
        </button>
        <button
          onClick={onClearCache}
          className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
        >
          Clear System Cache
        </button>
        <button
          onClick={onGenerateReport}
          className="w-full rounded-lg border border-purple-300 py-3 text-sm font-medium text-purple-700 transition-all duration-200 hover:scale-105 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-400"
        >
          Generate Audit Report
        </button>
      </div>
    </div>
  );
};

export default QuickActionsButtons;
