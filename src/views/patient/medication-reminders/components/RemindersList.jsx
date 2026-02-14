import React from "react";
import { FaBell } from "react-icons/fa";
import Card from "components/card";
import ReminderCard from "./ReminderCard";

const RemindersList = ({
  reminders,
  onViewDetails,
  onEdit,
  onDelete,
  onToggle,
  onMarkTaken,
  onAdd,
  getMethodIcon,
  getMethodColor,
  getMethodBgColor,
}) => {
  if (reminders.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-navy-700">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-navy-600">
          <FaBell className="h-8 w-8 text-gray-400" />
        </div>
        <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
          No Medication Reminders
        </h4>
        <p className="text-gray-600 dark:text-gray-400">
          Add reminders to never miss a dose
        </p>
        <button
          onClick={onAdd}
          className="linear mt-4 rounded-lg bg-brand-500 px-6 py-3 text-white hover:bg-brand-600"
        >
          Add Your First Reminder
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          reminder={reminder}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
          onMarkTaken={onMarkTaken}
          getMethodIcon={getMethodIcon}
          getMethodColor={getMethodColor}
          getMethodBgColor={getMethodBgColor}
        />
      ))}
    </div>
  );
};

export default RemindersList;
