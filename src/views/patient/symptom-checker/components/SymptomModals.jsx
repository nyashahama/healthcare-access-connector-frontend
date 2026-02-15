import React from "react";
import Modal from "components/modal/Modal";
import { MdEmergency, MdInfo, MdShare, MdCheckCircle } from "react-icons/md";

export const EmergencyModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <MdEmergency className="text-2xl text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Emergency Services
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        If this is a life-threatening emergency, please call emergency services
        immediately.
      </p>
      <div className="space-y-3">
        <a
          href="tel:10177"
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
        >
          Call 10177 (Emergency)
        </a>
        <a
          href="tel:112"
          className="flex w-full items-center justify-center rounded-lg bg-orange-500 px-6 py-3 font-medium text-white hover:bg-orange-600"
        >
          Call 112 (Ambulance)
        </a>
      </div>
      <div className="mt-6 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
        <p className="text-sm text-red-800 dark:text-red-300">
          <strong>Warning signs requiring immediate care:</strong> Difficulty
          breathing, chest pain, severe bleeding, loss of consciousness,
          seizures, or signs of stroke.
        </p>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  </Modal>
);

export const SaveResultModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <MdCheckCircle className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Save Assessment Result
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Save this symptom assessment to your health records for future reference
        and to share with your healthcare provider.
      </p>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Add Notes (Optional)
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
          rows="4"
          placeholder="Any additional details about your symptoms..."
        />
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Save to Records
        </button>
      </div>
    </div>
  </Modal>
);

export const ShareModal = ({ isOpen, onClose, onShare }) => {
  const shareOptions = [
    { id: "email", name: "Email", icon: "📧" },
    { id: "whatsapp", name: "WhatsApp", icon: "💬" },
    { id: "sms", name: "SMS", icon: "📱" },
    { id: "download", name: "Download PDF", icon: "📄" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <MdShare className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-navy-700 dark:text-white">
            Share Assessment
          </h3>
        </div>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Share this assessment with your healthcare provider or family:
        </p>
        <div className="grid grid-cols-2 gap-3">
          {shareOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onShare(option.name)}
              className="flex flex-col items-center justify-center rounded-lg border border-gray-300 p-4 transition-all hover:scale-105 hover:border-brand-300 hover:bg-brand-50 dark:border-gray-600 dark:hover:bg-brand-900/20"
            >
              <span className="mb-2 text-3xl">{option.icon}</span>
              <span className="text-sm font-medium">{option.name}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export const SelfCareModal = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <MdInfo className="text-2xl text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          Self-Care Tips
        </h3>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
          <h4 className="mb-2 font-medium text-green-800 dark:text-green-300">
            Rest & Recovery
          </h4>
          <ul className="space-y-1 text-sm text-green-700 dark:text-green-400">
            <li>• Get plenty of rest and sleep</li>
            <li>• Stay in a comfortable environment</li>
            <li>• Avoid strenuous activities</li>
          </ul>
        </div>
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <h4 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
            Hydration & Nutrition
          </h4>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
            <li>• Drink plenty of fluids (water, tea)</li>
            <li>• Eat light, nutritious meals</li>
            <li>• Avoid alcohol and caffeine</li>
          </ul>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <h4 className="mb-2 font-medium text-purple-800 dark:text-purple-300">
            Symptom Management
          </h4>
          <ul className="space-y-1 text-sm text-purple-700 dark:text-purple-400">
            <li>• Use over-the-counter remedies as directed</li>
            <li>• Monitor temperature regularly</li>
            <li>• Keep a symptom diary</li>
          </ul>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          Got It
        </button>
      </div>
    </div>
  </Modal>
);
