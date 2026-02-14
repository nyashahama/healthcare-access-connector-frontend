import React from "react";
import Modal from "components/modal/Modal";
import {
  MdWarning,
  MdPublic,
  MdInfo,
  MdPerson,
  MdCalendarToday,
  MdTag,
  MdTranslate,
} from "react-icons/md";

export const DeleteModal = ({ isOpen, onClose, article, confirmDelete }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Delete Article" size="md">
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
          <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
        </div>
        <div>
          <h4 className="font-bold text-navy-700 dark:text-white">
            Delete "{article?.title}"?
          </h4>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            This action cannot be undone. The article will be permanently
            removed from the system.
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
          onClick={confirmDelete}
          className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
        >
          Delete Article
        </button>
      </div>
    </div>
  </Modal>
);

export const PublishModal = ({ isOpen, onClose, article, confirmPublish }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Publish Article" size="md">
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
          <MdPublic className="h-8 w-8 text-green-600 dark:text-green-300" />
        </div>
      </div>

      <div className="text-center">
        <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
          Publish "{article?.title}"?
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This article will be made publicly available to all users.
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Make sure to review all content and translations before publishing.
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
          onClick={confirmPublish}
          className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
        >
          Publish Now
        </button>
      </div>
    </div>
  </Modal>
);

export const PreviewModal = ({ isOpen, onClose, article }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Article Preview" size="xl">
    {article && (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            {article.title}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span className="flex items-center">
              <MdPerson className="mr-1 h-4 w-4" />
              {article.author}
            </span>
            <span className="flex items-center">
              <MdCalendarToday className="mr-1 h-4 w-4" />
              {article.lastUpdated}
            </span>
            <span className="flex items-center">
              <MdTag className="mr-1 h-4 w-4" />
              {article.category}
            </span>
            <span className="flex items-center">
              <MdTranslate className="mr-1 h-4 w-4" />
              {article.language.length} languages
            </span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>{article.content}</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <span
              key={index}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-navy-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Close Preview
          </button>
        </div>
      </div>
    )}
  </Modal>
);
