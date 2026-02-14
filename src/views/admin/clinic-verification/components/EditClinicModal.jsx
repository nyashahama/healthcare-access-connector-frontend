import React from "react";
import Modal from "components/modal/Modal";
import { MdSave } from "react-icons/md";

const EditClinicModal = ({
  isOpen,
  onClose,
  clinicForm,
  setClinicForm,
  onSave,
  loading,
}) => {
  const handleInputChange = (field, value) => {
    setClinicForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <h3 className="mb-6 text-2xl font-bold text-navy-700 dark:text-white">
          Edit Clinic Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clinic Name
            </label>
            <input
              type="text"
              value={clinicForm.clinic_name}
              onChange={(e) => handleInputChange("clinic_name", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              placeholder="Enter clinic name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Type
              </label>
              <select
                value={clinicForm.clinic_type}
                onChange={(e) =>
                  handleInputChange("clinic_type", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <input
                type="tel"
                value={clinicForm.contact_number}
                onChange={(e) =>
                  handleInputChange("contact_number", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={clinicForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              placeholder="clinic@example.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                City
              </label>
              <input
                type="text"
                value={clinicForm.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="City"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Province
              </label>
              <input
                type="text"
                value={clinicForm.province}
                onChange={(e) => handleInputChange("province", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
                placeholder="Province"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Operating Hours
            </label>
            <input
              type="text"
              value={clinicForm.operating_hours}
              onChange={(e) =>
                handleInputChange("operating_hours", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              placeholder="e.g., Mon-Fri: 9AM-5PM"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="flex items-center rounded-lg bg-brand-500 px-6 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
            disabled={loading}
          >
            <MdSave className="mr-2" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditClinicModal;
