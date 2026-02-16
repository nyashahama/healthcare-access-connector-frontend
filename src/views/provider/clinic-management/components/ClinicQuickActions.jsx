import React from "react";
import Card from "components/card";
import {
  MdPeople,
  MdCalendarToday,
  MdAnalytics,
  MdSettings,
} from "react-icons/md";

const ClinicQuickActions = ({
  onAddStaff,
  onUpdateHours,
  onGenerateReport,
  onAddService,
}) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Quick Actions
      </h4>
      <div className="space-y-3">
        <button
          onClick={onAddStaff}
          className="flex w-full items-center justify-between rounded-lg bg-brand-50 p-3 text-left hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/50"
        >
          <div>
            <p className="font-medium text-brand-700 dark:text-brand-300">
              Add New Staff
            </p>
            <p className="text-sm text-brand-600 dark:text-brand-400">
              Invite medical professionals
            </p>
          </div>
          <MdPeople className="text-brand-600 dark:text-brand-400" />
        </button>

        <button
          onClick={onUpdateHours}
          className="flex w-full items-center justify-between rounded-lg bg-green-50 p-3 text-left hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/50"
        >
          <div>
            <p className="font-medium text-green-700 dark:text-green-300">
              Update Schedule
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              Modify operating hours
            </p>
          </div>
          <MdCalendarToday className="text-green-600 dark:text-green-400" />
        </button>

        <button
          onClick={onGenerateReport}
          className="flex w-full items-center justify-between rounded-lg bg-purple-50 p-3 text-left hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50"
        >
          <div>
            <p className="font-medium text-purple-700 dark:text-purple-300">
              Generate Reports
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              Download performance data
            </p>
          </div>
          <MdAnalytics className="text-purple-600 dark:text-purple-400" />
        </button>

        <button
          onClick={onAddService}
          className="flex w-full items-center justify-between rounded-lg bg-blue-50 p-3 text-left hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
        >
          <div>
            <p className="font-medium text-blue-700 dark:text-blue-300">
              Configure Services
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              Add or modify services
            </p>
          </div>
          <MdSettings className="text-blue-600 dark:text-blue-400" />
        </button>
      </div>
    </Card>
  );
};

export default ClinicQuickActions;
