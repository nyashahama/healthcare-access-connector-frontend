import React from "react";
import Modal from "components/modal/Modal";

const AddServiceModal = ({
  isOpen,
  onClose,
  newService,
  setNewService,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Service" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Service Name *
            </label>
            <input
              type="text"
              value={newService.name}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., Vaccination, Consultation"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category *
            </label>
            <select
              value={newService.category}
              onChange={(e) =>
                setNewService((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="general">General</option>
              <option value="specialist">Specialist</option>
              <option value="diagnostic">Diagnostic</option>
              <option value="preventive">Preventive</option>
              <option value="surgical">Surgical</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (minutes)
            </label>
            <select
              value={newService.duration}
              onChange={(e) =>
                setNewService((prev) => ({
                  ...prev,
                  duration: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
              <option value="90">90 min</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Price (R) *
            </label>
            <input
              type="number"
              value={newService.price}
              onChange={(e) =>
                setNewService((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={newService.description}
              onChange={(e) =>
                setNewService((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Describe the service..."
              rows="3"
            />
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
            Add Service
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddServiceModal;
