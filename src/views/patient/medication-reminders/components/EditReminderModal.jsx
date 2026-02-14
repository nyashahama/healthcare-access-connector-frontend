import React from "react";
import { MdEdit } from "react-icons/md";
import Modal from "components/modal/Modal";

const EditReminderModal = ({ isOpen, onClose, reminder, onConfirm }) => {
  if (!reminder) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
            <MdEdit className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Edit Medication Reminder
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Update your medication schedule
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Medication Name
            </label>
            <input
              type="text"
              defaultValue={reminder.medication}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Dosage
              </label>
              <input
                type="text"
                defaultValue={reminder.dosage}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Frequency
              </label>
              <input
                type="text"
                defaultValue={reminder.frequency}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Reminder Times (comma separated)
            </label>
            <input
              type="text"
              defaultValue={reminder.times.join(", ")}
              className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Start Date
              </label>
              <input
                type="date"
                defaultValue={reminder.startDate}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                End Date
              </label>
              <input
                type="date"
                defaultValue={reminder.endDate}
                className="w-full rounded-xl border-2 border-gray-300 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditReminderModal;
