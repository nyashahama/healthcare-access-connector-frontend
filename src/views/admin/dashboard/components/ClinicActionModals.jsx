import React from "react";
import Modal from "components/modal/Modal";
import { MdCheckCircle, MdCancel } from "react-icons/md";

export const ApproveClinicModal = ({ isOpen, onClose, clinic, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <MdCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Approve Clinic Registration
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Approve registration for{" "}
        <span className="font-medium">{clinic?.name}</span>? The clinic will
        receive confirmation and can start using the platform.
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
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Approve Clinic
        </button>
      </div>
    </div>
  </Modal>
);

export const RejectClinicModal = ({
  isOpen,
  onClose,
  clinic,
  rejectReason,
  setRejectReason,
  onConfirm,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <MdCancel className="text-2xl text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Reject Clinic Registration
        </h3>
      </div>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Rejecting registration for{" "}
        <span className="font-medium">{clinic?.name}</span>. Please provide a
        reason:
      </p>
      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        className="mb-4 w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700 dark:text-white"
        rows="4"
        placeholder="Enter rejection reason..."
      />
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
          disabled={!rejectReason.trim()}
        >
          Reject Registration
        </button>
      </div>
    </div>
  </Modal>
);
