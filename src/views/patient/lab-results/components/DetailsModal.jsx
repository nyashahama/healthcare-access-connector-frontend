import React from "react";
import { MdCalendarToday, MdInfo, MdWarning, MdClose } from "react-icons/md";
import { FaFileMedical } from "react-icons/fa";
import Modal from "components/modal/Modal";

const DetailsModal = ({
  isOpen,
  onClose,
  selectedResult,
  onDownload,
  getStatusColor,
}) => {
  if (!selectedResult) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedResult.testName}
      size="lg"
    >
      <div className="space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-brand-50 to-blue-50 p-6 dark:from-brand-900/20 dark:to-blue-900/20">
          <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
            {selectedResult.testName}
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Lab
              </div>
              <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                {selectedResult.lab}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                Status
              </div>
              <div className="mt-1">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                    selectedResult.status
                  )}`}
                >
                  {selectedResult.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MdCalendarToday className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-500">Test Date</div>
              <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                {new Date(selectedResult.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FaFileMedical className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-500">
                Ordered By
              </div>
              <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                {selectedResult.doctor}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Summary
          </h5>
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-900">
            <p className="text-gray-700 dark:text-gray-300">
              {selectedResult.summary}
            </p>
          </div>
        </div>

        <div>
          <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Detailed Results
          </h5>
          <div className="space-y-3">
            {Object.entries(selectedResult.details).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <span className="capitalize text-gray-600 dark:text-gray-300">
                  {key.replace(/([A-Z])/g, " $1")}:
                </span>
                <span className="font-medium text-navy-700 dark:text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {selectedResult.attachment && (
          <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-blue-800 dark:text-blue-300">
                  Full Report Available
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  {selectedResult.fileSize}
                </div>
              </div>
              <button
                onClick={() => onDownload(selectedResult)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50 dark:border-gray-600"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(selectedResult)}
            className="rounded-lg bg-brand-500 px-6 py-2 font-semibold text-white hover:bg-brand-600"
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DetailsModal;
