import React from "react";
import Modal from "components/modal/Modal";
import { MdDownload, MdShare, MdInfo } from "react-icons/md";

export const SaveOfflineModal = ({ isOpen, onClose, article, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <MdDownload className="text-2xl text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Save for Offline Reading
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Save "<span className="font-medium">{article?.title}</span>" to read
        later without an internet connection. The article will be available in
        your library.
      </p>
      <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <div className="flex items-start">
          <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Offline articles are stored on your device and will be accessible
            without data or Wi-Fi.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          Save for Offline
        </button>
      </div>
    </div>
  </Modal>
);

export const ShareArticleModal = ({ isOpen, onClose, article, onShare }) => {
  const shareMethods = [
    { id: "whatsapp", name: "WhatsApp", icon: "💬" },
    { id: "sms", name: "SMS", icon: "📱" },
    { id: "email", name: "Email", icon: "📧" },
    { id: "link", name: "Copy Link", icon: "🔗" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <MdShare className="text-2xl text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Share Article
          </h3>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Share "<span className="font-medium">{article?.title}</span>" with
          family and friends:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {shareMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => onShare(method.name)}
              className="flex items-center justify-center rounded-lg border border-gray-300 p-4 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-navy-700"
            >
              <span className="mr-2 text-2xl">{method.icon}</span>
              <span className="font-medium">{method.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const FilterModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
        Filter Articles
      </h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Difficulty Level
          </label>
          <div className="space-y-2">
            {["All Levels", "Beginner", "Intermediate", "Advanced"].map(
              (level) => (
                <label key={level} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={level === "All Levels"}
                    className="mr-2 h-4 w-4"
                  />
                  <span className="text-sm">{level}</span>
                </label>
              )
            )}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Read Time
          </label>
          <div className="space-y-2">
            {["All", "Under 5 min", "5-10 min", "Over 10 min"].map((time) => (
              <label key={time} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked={time === "All"}
                  className="mr-2 h-4 w-4"
                />
                <span className="text-sm">{time}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Cancel
        </button>
        <button
          onClick={onClose}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Apply Filters
        </button>
      </div>
    </div>
  </Modal>
);

export const SMSSubscribeModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <h3 className="mb-6 text-xl font-bold text-navy-700 dark:text-white">
        Subscribe to SMS Nutrition Tips
      </h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="+27 XX XXX XXXX"
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Child's Age
          </label>
          <select className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700">
            <option>0-6 months</option>
            <option>6-12 months</option>
            <option>1-2 years</option>
            <option>2-5 years</option>
            <option>5+ years</option>
          </select>
        </div>
        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <p className="text-sm text-green-800 dark:text-green-300">
            You'll receive daily nutrition tips tailored to your child's age
            group. Standard SMS rates apply.
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
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
          Subscribe
        </button>
      </div>
    </div>
  </Modal>
);
