import React from "react";
import { MdWarning } from "react-icons/md";
import Modal from "components/modal/Modal";

const DeleteStaffModal = ({
  deleteModalOpen,
  setDeleteModalOpen,
  selectedStaff,
  confirmDelete,
  loading,
}) => {
  return (
    <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <MdWarning className="text-2xl text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Delete Staff Member
          </h3>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Are you sure you want to delete{" "}
          <span className="font-medium">
            {selectedStaff?.first_name} {selectedStaff?.last_name}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteStaffModal;
