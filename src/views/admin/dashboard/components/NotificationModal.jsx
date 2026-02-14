import React from "react";
import Modal from "components/modal/Modal";
import { MdNotifications } from "react-icons/md";

const NotificationModal = ({
  isOpen,
  onClose,
  notificationTitle,
  setNotificationTitle,
  notificationMessage,
  setNotificationMessage,
  notificationAudience,
  setNotificationAudience,
  onSend,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <MdNotifications className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Send Notification
          </h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Audience
            </label>
            <select
              value={notificationAudience}
              onChange={(e) => setNotificationAudience(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option>All Users</option>
              <option>Clinics Only</option>
              <option>Patients Only</option>
              <option>Staff Only</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Notification title"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Message
            </label>
            <textarea
              value={notificationMessage}
              onChange={(e) => setNotificationMessage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="5"
              placeholder="Notification message..."
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          >
            Cancel
          </button>
          <button
            onClick={onSend}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Send Notification
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
