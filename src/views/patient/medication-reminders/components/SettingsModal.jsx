import React from "react";
import { MdNotifications } from "react-icons/md";
import { FaMobileAlt, FaBell } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Modal from "components/modal/Modal";

const SettingsModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="md">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
            <MdNotifications className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Notification Settings
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Customize how you receive reminders
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h5 className="mb-3 font-semibold text-navy-700 dark:text-white">
              Default Notification Method
            </h5>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 p-3 transition-all hover:border-green-500 dark:border-green-700 dark:bg-green-900/20">
                <FaMobileAlt className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold">SMS</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 p-3 transition-all hover:border-blue-500 dark:border-blue-700 dark:bg-blue-900/20">
                <FaBell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-semibold">Push</span>
              </button>
              <button className="flex flex-col items-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 p-3 transition-all hover:border-purple-500 dark:border-purple-700 dark:bg-purple-900/20">
                <MdEmail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-semibold">Email</span>
              </button>
            </div>
          </div>

          <div>
            <h5 className="mb-3 font-semibold text-navy-700 dark:text-white">
              Reminder Preferences
            </h5>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                <div>
                  <div className="font-medium text-navy-700 dark:text-white">
                    Sound Alerts
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Play sound with notifications
                  </div>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-gray-300 dark:bg-gray-600">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"></span>
                </div>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                <div>
                  <div className="font-medium text-navy-700 dark:text-white">
                    Early Reminders
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Notify 10 minutes before scheduled time
                  </div>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-green-500">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white transition-transform"></span>
                </div>
              </label>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                <div>
                  <div className="font-medium text-navy-700 dark:text-white">
                    Missed Dose Alerts
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Alert if medication not taken within 30 minutes
                  </div>
                </div>
                <div className="relative h-6 w-11 rounded-full bg-green-500">
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 translate-x-5 rounded-full bg-white transition-transform"></span>
                </div>
              </label>
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
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
          >
            Save Settings
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
