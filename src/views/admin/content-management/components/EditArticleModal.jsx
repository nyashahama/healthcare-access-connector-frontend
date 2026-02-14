import React from "react";
import { MdTranslate, MdCheckCircle } from "react-icons/md";
import Modal from "components/modal/Modal";

const EditArticleModal = ({
  isOpen,
  onClose,
  article,
  articleForm,
  handleFormChange,
  handleTagAdd,
  handleTagRemove,
  handleLanguageToggle,
  confirmEdit,
  categories,
  languages,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Article" size="lg">
      {article && (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Article Title
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
                Category
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
                Status
              </label>
              <select
                value={articleForm.status}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            <div className="mb-3 flex flex-wrap gap-2">
              {articleForm.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {tag}
                  <button
                    onClick={() => handleTagRemove(tag)}
                    className="ml-1 hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a tag"
                className="flex-1 rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleTagAdd(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder="Add a tag"]'
                  );
                  if (input.value) {
                    handleTagAdd(input.value);
                    input.value = "";
                  }
                }}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Languages
            </label>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageToggle(lang.code)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                    articleForm.language.includes(lang.code)
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                  }`}
                >
                  <MdTranslate className="h-4 w-4" />
                  {lang.name}
                  {articleForm.language.includes(lang.code) && (
                    <MdCheckCircle className="h-4 w-4 text-green-500" />
                  )}
                </button>
              ))}
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
              onClick={confirmEdit}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default EditArticleModal;
