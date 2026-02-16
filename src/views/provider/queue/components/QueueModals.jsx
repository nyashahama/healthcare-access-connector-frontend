import React, { useState } from "react";
import Modal from "components/modal/Modal";
import { MdWarning, MdInfo, MdPeople, MdCheckCircle } from "react-icons/md";

// ===== Add Patient Modal =====
export const AddPatientModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    reason: "",
    priority: "medium",
    type: "walk-in",
    estimatedTime: "15",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.reason) {
      // Could add toast here, but we'll leave validation to parent
      return;
    }
    onConfirm(formData);
    // Reset form after submission
    setFormData({
      name: "",
      phone: "",
      reason: "",
      priority: "medium",
      type: "walk-in",
      estimatedTime: "15",
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Patient to Queue"
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Patient Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter patient name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for Visit *
            </label>
            <input
              type="text"
              value={formData.reason}
              onChange={(e) => handleChange("reason", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., Fever, Consultation, Follow-up"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority *
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Visit Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange("type", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="walk-in">Walk-in</option>
              <option value="appointment">Appointment</option>
              <option value="telemedicine">Telemedicine</option>
              <option value="follow-up">Follow-up</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estimated Wait Time (min)
            </label>
            <input
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => handleChange("estimatedTime", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="15"
              min="5"
              max="120"
            />
          </div>
        </div>

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <div className="flex items-start">
            <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The patient will receive an SMS notification with their queue
              number and estimated wait time.
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
            onClick={handleSubmit}
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Add to Queue
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== Clear Queue Modal =====
export const ClearQueueModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Clear Queue" size="md">
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
          <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
        </div>
        <div>
          <h4 className="font-bold text-navy-700 dark:text-white">
            Clear All Patients from Queue?
          </h4>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            This will remove all waiting patients from the queue. Patients will
            need to check-in again.
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
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
        >
          Clear Queue
        </button>
      </div>
    </div>
  </Modal>
);

// ===== Call Next Patient Modal =====
export const CallNextModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Call Next Patient" size="md">
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900">
          <MdPeople className="h-8 w-8 text-green-600 dark:text-green-300" />
        </div>
      </div>

      <div className="text-center">
        <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
          Call Next Patient?
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          This will notify the next patient in line to proceed to the
          consultation room.
        </p>
      </div>

      <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Patient will receive an SMS notification and their status will
            update in the system.
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
          onClick={onConfirm}
          className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
        >
          Call Next Patient
        </button>
      </div>
    </div>
  </Modal>
);

// ===== Mark All Seen Modal =====
export const MarkAllSeenModal = ({ isOpen, onClose, onConfirm }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Mark All as Seen" size="md">
    <div className="space-y-6">
      <div className="flex items-start">
        <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900">
          <MdCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
        </div>
        <div>
          <h4 className="font-bold text-navy-700 dark:text-white">
            Mark All Patients as Seen?
          </h4>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            This will update the status of all patients in the queue to "Seen"
            and move them to history.
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
          onClick={onConfirm}
          className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
        >
          Mark All as Seen
        </button>
      </div>
    </div>
  </Modal>
);
