import React from "react";
import { MdDelete, MdWarning } from "react-icons/md";
import Modal from "components/modal/Modal";

const DeleteReminderModal = ({ isOpen, onClose, reminder, onConfirm }) => {
  if (!reminder) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-red-600">
            <MdDelete className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Delete Reminder?
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete this medication reminder?
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 dark:bg-navy-900">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Medication
              </span>
              <span className="font-semibold text-navy-700 dark:text-white">
                {reminder.medication}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Dosage</span>
              <span className="font-semibold text-navy-700 dark:text-white">
                {reminder.dosage} • {reminder.frequency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Times</span>
              <span className="font-semibold text-navy-700 dark:text-white">
                {reminder.times.join(", ")}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <div className="flex items-start gap-3">
            <MdWarning className="mt-0.5 h-5 w-5 text-red-600 dark:text-red-500" />
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Note:</strong> This action cannot be undone. All reminder
              notifications for this medication will be stopped.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Keep Reminder
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-3 font-semibold text-white transition-all hover:from-red-600 hover:to-red-700 hover:shadow-lg"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteReminderModal;
