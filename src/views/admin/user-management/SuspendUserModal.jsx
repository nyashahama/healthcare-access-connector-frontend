import React from "react";
import Modal from "components/modal/Modal";
import { MdLock, MdLockOpen, MdInfo } from "react-icons/md";

const SuspendUserModal = ({ isOpen, onClose, selectedUser, onConfirm }) => {
  if (!selectedUser) return null;

  const isSuspended = selectedUser.status === "suspended";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isSuspended ? "Reactivate User" : "Suspend User"}
      size="md"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div
            className={`rounded-full p-4 ${
              isSuspended
                ? "bg-green-100 dark:bg-green-900"
                : "bg-yellow-100 dark:bg-yellow-900"
            }`}
          >
            {isSuspended ? (
              <MdLockOpen className="h-8 w-8 text-green-600 dark:text-green-300" />
            ) : (
              <MdLock className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
            )}
          </div>
        </div>

        <div className="text-center">
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            {isSuspended
              ? `Reactivate ${selectedUser.name}?`
              : `Suspend ${selectedUser.name}?`}
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {isSuspended
              ? "This user will regain access to their account and all features."
              : "This user will lose access to their account until reactivated."}
          </p>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start">
            <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {isSuspended
                ? "Suspension reason will be cleared upon reactivation."
                : "You can specify a suspension reason for reference."}
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
            className={`rounded-lg px-6 py-3 font-medium text-white ${
              isSuspended
                ? "bg-green-500 hover:bg-green-600"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isSuspended ? "Reactivate User" : "Suspend User"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendUserModal;
