import React from "react";
import Modal from "components/modal/Modal";
import { MdSave } from "react-icons/md";

const EditUserModal = ({
  isOpen,
  onClose,
  selectedUser,
  editForm,
  onFormChange,
  onConfirm,
}) => {
  if (!selectedUser) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${
        selectedUser?.type === "patients" ? "Patient" : "Provider"
      }`}
      size="lg"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => onFormChange("name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => onFormChange("email", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number *
            </label>
            <input
              type="tel"
              value={editForm.phone}
              onChange={(e) => onFormChange("phone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Location *
            </label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => onFormChange("location", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter location"
            />
          </div>
          {selectedUser.type === "providers" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialty
                </label>
                <input
                  type="text"
                  value={editForm.specialty}
                  onChange={(e) => onFormChange("specialty", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter specialty"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clinic/Hospital
                </label>
                <input
                  type="text"
                  value={editForm.clinic}
                  onChange={(e) => onFormChange("clinic", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter clinic name"
                />
              </div>
            </>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status *
            </label>
            <select
              value={editForm.status}
              onChange={(e) => onFormChange("status", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              {selectedUser.type === "providers" && (
                <option value="pending">Pending</option>
              )}
              {selectedUser.type === "providers" && (
                <option value="verified">Verified</option>
              )}
            </select>
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
            className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
          >
            <MdSave className="h-5 w-5" />
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditUserModal;
