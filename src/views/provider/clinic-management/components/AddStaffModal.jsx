import React, { useState } from "react";
import Modal from "components/modal/Modal";

const AddStaffModal = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "doctor",
    specialization: "",
    phone: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      // In a real app, you'd show an error toast or validation
      return;
    }
    onConfirm(formData);
    setFormData({
      name: "",
      email: "",
      role: "doctor",
      specialization: "",
      phone: "",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Staff" size="md">
      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            placeholder="Dr. John Doe"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            placeholder="john.doe@clinic.com"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
          >
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
            <option value="admin">Administrator</option>
            <option value="receptionist">Receptionist</option>
          </select>
        </div>
        {formData.role === "doctor" && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Specialization
            </label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  specialization: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., Pediatrics"
            />
          </div>
        )}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
            placeholder="+27 12 345 6789"
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
            onClick={handleSubmit}
            className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
          >
            Add Staff Member
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddStaffModal;
