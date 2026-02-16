import React from "react";
import Modal from "components/modal/Modal";
import { MdWarning } from "react-icons/md";

const DeleteUserModal = ({ isOpen, onClose, selectedUser, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User" size="md">
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
            <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
          </div>
          <div>
            <h4 className="font-bold text-navy-700 dark:text-white">
              Delete "{selectedUser?.name}"?
            </h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              This action cannot be undone. All user data, including medical
              records and history, will be permanently deleted.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-start">
            <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Warning:</strong> Deleting this user will remove all
              associated data including appointments, prescriptions, and medical
              history.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
          >
            Delete User Permanently
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteUserModal;
