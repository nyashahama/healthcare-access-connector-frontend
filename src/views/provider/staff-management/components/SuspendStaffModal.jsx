import React from "react";
import { MdInfo } from "react-icons/md";
import Modal from "components/modal/Modal";

const SuspendStaffModal = ({
  suspendModalOpen,
  setSuspendModalOpen,
  selectedStaff,
  confirmSuspend,
  loading,
}) => {
  return (
    <Modal isOpen={suspendModalOpen} onClose={() => setSuspendModalOpen(false)}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <MdInfo className="text-2xl text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Suspend Staff Member
          </h3>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Are you sure you want to suspend{" "}
          <span className="font-medium">
            {selectedStaff?.first_name} {selectedStaff?.last_name}
          </span>
          ? They will lose access to the system until reactivated.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setSuspendModalOpen(false)}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={confirmSuspend}
            className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Suspending..." : "Suspend"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SuspendStaffModal;
