import React from "react";
import Modal from "components/modal/Modal";
import { MdAdd } from "react-icons/md";

const AddUserModal = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  editForm,
  onFormChange,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User" size="lg">
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              User Type *
            </label>
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="patients">Patient</option>
              <option value="providers">Healthcare Provider</option>
              <option value="admins">Administrator</option>
            </select>
          </div>
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
          {activeTab === "patients" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Age
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter age"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </>
          )}
          {activeTab === "providers" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialty
                </label>
                <select className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700">
                  <option value="">Select specialty</option>
                  <option value="pediatrics">Pediatrics</option>
                  <option value="general">General Medicine</option>
                  <option value="emergency">Emergency Medicine</option>
                  <option value="maternal">Maternal Health</option>
                </select>
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
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Status *
            </label>
            <select
              value={editForm.status}
              onChange={(e) => onFormChange("status", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="active">Active</option>
              <option value="pending">Pending Review</option>
              {activeTab === "providers" && (
                <option value="pending">Pending Verification</option>
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
            className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            <MdAdd className="h-5 w-5" />
            Create User
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserModal;
