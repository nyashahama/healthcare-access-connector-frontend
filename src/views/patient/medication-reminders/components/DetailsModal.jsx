import React from "react";
import { FaPills, FaMobileAlt, FaBell } from "react-icons/fa";
import {
  MdAccessTime,
  MdCalendarToday,
  MdCheckCircle,
  MdClose,
} from "react-icons/md";
import { MdEmail } from "react-icons/md";
import Modal from "components/modal/Modal";

const DetailsModal = ({
  isOpen,
  onClose,
  reminder,
  onEdit,
  getMethodIcon,
  getMethodColor,
  getMethodBgColor,
}) => {
  if (!reminder) return null;

  const MethodIcon =
    getMethodIcon(reminder.method) === "FaMobileAlt"
      ? FaMobileAlt
      : getMethodIcon(reminder.method) === "FaBell"
      ? FaBell
      : MdEmail;

  const methodColor = getMethodColor(reminder.method);
  const methodBgColor = getMethodBgColor(reminder.method);

  const startDate = new Date(reminder.startDate).toLocaleDateString();
  const endDate = new Date(reminder.endDate).toLocaleDateString();
  const durationDays = Math.ceil(
    (new Date(reminder.endDate) - new Date(reminder.startDate)) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
            <FaPills className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
            {reminder.medication}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">Medication Details</p>
        </div>

        <div className="flex justify-center">
          <span
            className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide ${
              reminder.active
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
            }`}
          >
            {reminder.active ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Dosage
            </div>
            <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
              {reminder.dosage}
            </div>
          </div>
          <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Frequency
            </div>
            <div className="mt-1 text-xl font-bold text-navy-700 dark:text-white">
              {reminder.frequency}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${methodBgColor}`}
            >
              <MethodIcon className={`h-6 w-6 ${methodColor}`} />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Notification Method
              </div>
              <div className="mt-1 font-bold text-navy-700 dark:text-white">
                {reminder.method.toUpperCase()}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Reminders sent via {reminder.method}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <MdAccessTime className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Schedule Times
              </div>
              <div className="mt-1 font-bold text-navy-700 dark:text-white">
                {reminder.times.join(", ")}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Daily reminders at these times
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
              <MdCalendarToday className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Duration
              </div>
              <div className="mt-1 font-bold text-navy-700 dark:text-white">
                {startDate} - {endDate}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Total duration: {durationDays} days
              </div>
            </div>
          </div>

          {reminder.lastTaken && (
            <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <MdCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Last Taken
                </div>
                <div className="mt-1 font-bold text-navy-700 dark:text-white">
                  {new Date(reminder.lastTaken).toLocaleDateString()}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Time: {reminder.lastTaken.split(" ")[1]}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            Edit Reminder
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;
