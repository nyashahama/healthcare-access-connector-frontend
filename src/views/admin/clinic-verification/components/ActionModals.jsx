import React from "react";
import Modal from "components/modal/Modal";
import { MdCheckCircle, MdCancel, MdWarning } from "react-icons/md";

export const ApproveModal = ({
  isOpen,
  onClose,
  clinic,
  onConfirm,
  loading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <MdCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Approve Clinic
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Are you sure you want to approve{" "}
        <span className="font-medium">{clinic?.clinic_name}</span>? This clinic
        will be marked as verified and visible to users.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Approving..." : "Approve"}
        </button>
      </div>
    </div>
  </Modal>
);

export const RejectModal = ({
  isOpen,
  onClose,
  clinic,
  rejectionReason,
  setRejectionReason,
  onConfirm,
  loading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <MdCancel className="text-2xl text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Reject Clinic
        </h3>
      </div>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Rejecting <span className="font-medium">{clinic?.clinic_name}</span>.
        Please provide a reason for rejection:
      </p>
      <textarea
        value={rejectionReason}
        onChange={(e) => setRejectionReason(e.target.value)}
        className="mb-4 w-full rounded-lg border border-gray-300 p-3 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
        rows="4"
        placeholder="Enter reason for rejection..."
      />
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          disabled={loading || !rejectionReason.trim()}
        >
          {loading ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  </Modal>
);

export const DeleteModal = ({
  isOpen,
  onClose,
  clinic,
  onConfirm,
  loading,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <MdWarning className="text-2xl text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Delete Clinic
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Are you sure you want to delete{" "}
        <span className="font-medium">{clinic?.clinic_name}</span>? This action
        cannot be undone.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </Modal>
);
