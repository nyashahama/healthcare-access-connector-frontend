import React from "react";
import {
  MdShare,
  MdEmail,
  MdPrint,
  MdDownload,
  MdWarning,
} from "react-icons/md";
import Modal from "components/modal/Modal";

const ShareModal = ({ isOpen, onClose, selectedResult, confirmShare }) => {
  if (!selectedResult) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Lab Results"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
            <MdShare className="h-8 w-8 text-brand-600 dark:text-brand-300" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Share {selectedResult.testName}
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Select how you'd like to share these results
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => confirmShare("Email")}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
              <MdEmail className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-navy-700 dark:text-white">
                Email
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Send as secure email attachment
              </div>
            </div>
          </button>

          <button
            onClick={() => confirmShare("Print")}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <MdPrint className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-navy-700 dark:text-white">
                Print
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Print physical copy
              </div>
            </div>
          </button>

          <button
            onClick={() => confirmShare("Download")}
            className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-800"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
              <MdDownload className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-navy-700 dark:text-white">
                Download & Share
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Download PDF to share manually
              </div>
            </div>
          </button>
        </div>

        <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <MdWarning className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
            <div className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Privacy Notice:</strong> Lab results contain sensitive
              health information. Only share with trusted healthcare providers.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
