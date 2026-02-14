import React from "react";
import Modal from "components/modal/Modal";
import { MdAccessTime, MdInfo } from "react-icons/md";

const ViewArticleModal = ({ isOpen, onClose, article }) => {
  if (!article) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <MdAccessTime className="mr-1 h-4 w-4" />
              {article.readTime} read
            </span>
            <span className="mx-2">•</span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                article.difficulty === "Beginner"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              }`}
            >
              {article.difficulty}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">
              Overview
            </h4>
            <p className="text-gray-700 dark:text-gray-300">
              {article.content}
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">
              Key Tips & Recommendations
            </h4>
            <ul className="space-y-3">
              {article.tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start rounded-lg bg-gray-50 p-4 dark:bg-navy-700"
                >
                  <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-gray-700 dark:text-gray-300">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-800 dark:text-blue-300">
                For more personalized advice, consult with your healthcare
                provider or a registered nutritionist.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-brand-500 px-6 py-2 font-medium text-white hover:bg-brand-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewArticleModal;
