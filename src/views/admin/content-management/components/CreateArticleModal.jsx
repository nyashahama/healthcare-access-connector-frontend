import React from "react";
import Modal from "components/modal/Modal";

const CreateArticleModal = ({
  isOpen,
  onClose,
  articleForm,
  handleFormChange,
  confirmCreate,
  categories,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Article"
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Article Title *
          </label>
          <input
            type="text"
            value={articleForm.title}
            onChange={(e) => handleFormChange("title", e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            placeholder="Enter article title"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              value={articleForm.category}
              onChange={(e) => handleFormChange("category", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              {categories
                .filter((c) => c.id !== "all")
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <select
              value={articleForm.status}
              onChange={(e) => handleFormChange("status", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending Review</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Content
          </label>
          <textarea
            rows="8"
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            placeholder="Write article content here..."
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={confirmCreate}
            className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
          >
            Create Article
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateArticleModal;
