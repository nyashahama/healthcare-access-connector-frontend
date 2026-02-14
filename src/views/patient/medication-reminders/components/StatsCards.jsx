import React from "react";
import { FaPills } from "react-icons/fa";
import { MdCheckCircle, MdNotifications } from "react-icons/md";
import Card from "components/card";

const StatsCards = ({ reminders }) => {
  const activeCount = reminders.filter((r) => r.active).length;
  const nextReminder =
    reminders.length > 0
      ? `${reminders[0].medication} at ${reminders[0].times[0]}`
      : "No reminders";

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card extra="p-4">
        <div className="flex items-center">
          <FaPills className="mr-4 h-8 w-8 text-blue-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Active Reminders
            </div>
            <div className="text-2xl font-bold">{activeCount}</div>
          </div>
        </div>
      </Card>
      <Card extra="p-4">
        <div className="flex items-center">
          <MdCheckCircle className="mr-4 h-8 w-8 text-green-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Compliance Rate
            </div>
            <div className="text-2xl font-bold">92%</div>
          </div>
        </div>
      </Card>
      <Card extra="p-4">
        <div className="flex items-center">
          <MdNotifications className="mr-4 h-8 w-8 text-purple-500" />
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Next Reminder
            </div>
            <div className="text-lg font-bold">{nextReminder}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsCards;
