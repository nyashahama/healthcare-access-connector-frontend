import React from "react";
import Modal from "components/modal/Modal";
import { MdWarning, MdBackup } from "react-icons/md";

export const RestartModal = ({ isOpen, onClose, system, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
          <MdWarning className="text-2xl text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Restart System
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Are you sure you want to restart{" "}
        <span className="font-medium">{system}</span>? This may cause temporary
        service interruption.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
        >
          Restart System
        </button>
      </div>
    </div>
  </Modal>
);

export const BackupModal = ({ isOpen, onClose, system, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MdBackup className="text-2xl text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Create Backup
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Creating a backup for <span className="font-medium">{system}</span>.
        This process may take several minutes depending on data size.
      </p>
      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 Backups are automatically encrypted and stored securely.
        </p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Create Backup
        </button>
      </div>
    </div>
  </Modal>
);

export const SettingsModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
        System Settings
      </h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Auto-Backup Schedule
          </label>
          <select className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700">
            <option>Daily at 2:00 AM</option>
            <option>Weekly on Sunday</option>
            <option>Monthly on 1st</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Alert Threshold (CPU %)
          </label>
          <input
            type="number"
            defaultValue="80"
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable Email Notifications
          </span>
          <input type="checkbox" defaultChecked className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Save Settings
        </button>
      </div>
    </div>
  </Modal>
);
