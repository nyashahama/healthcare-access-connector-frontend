import React from "react";
import { FaPills, FaMobileAlt, FaBell } from "react-icons/fa";
import {
  MdAccessTime,
  MdCalendarToday,
  MdInfo,
  MdCheckCircle,
  MdEdit,
  MdDelete,
  MdEmail,
} from "react-icons/md";

const ReminderCard = ({
  reminder,
  onViewDetails,
  onEdit,
  onDelete,
  onToggle,
  onMarkTaken,
  getMethodIcon,
  getMethodColor,
  getMethodBgColor,
}) => {
  const MethodIcon =
    getMethodIcon(reminder.method) === "FaMobileAlt"
      ? FaMobileAlt
      : getMethodIcon(reminder.method) === "FaBell"
      ? FaBell
      : MdEmail;

  return (
    <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-brand-500 hover:shadow-lg dark:border-navy-700 dark:hover:border-brand-500">
      {/* Gradient accent on hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

      {/* Background pattern */}
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-5">
        <FaPills className="h-full w-full text-brand-500" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
                <FaPills className="h-6 w-6 text-white" />
              </div>
              <div>
                <h6 className="text-lg font-bold text-navy-700 dark:text-white">
                  {reminder.medication}
                </h6>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {reminder.dosage} • {reminder.frequency}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggle(reminder.id)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                reminder.active
                  ? "bg-green-500"
                  : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  reminder.active ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
              <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Times
              </div>
              <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                {reminder.times.join(", ")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
              <MdCalendarToday className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Until
              </div>
              <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                {new Date(reminder.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Method & Status */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                reminder.method === "sms"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : reminder.method === "push"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
              }`}
            >
              <MethodIcon className="h-3 w-3" />
              {reminder.method === "sms"
                ? "SMS"
                : reminder.method === "push"
                ? "Push"
                : "Email"}
            </span>
            {reminder.lastTaken && (
              <span className="text-xs text-gray-500">
                Last: {reminder.lastTaken.split(" ")[1]}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewDetails(reminder)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
          >
            <MdInfo className="h-4 w-4" />
            Details
          </button>
          <button
            onClick={() => onMarkTaken(reminder.id)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
          >
            <MdCheckCircle className="h-4 w-4" />
            Mark Taken
          </button>
          <button
            onClick={() => onEdit(reminder)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
          >
            <MdEdit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(reminder)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
          >
            <MdDelete className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
