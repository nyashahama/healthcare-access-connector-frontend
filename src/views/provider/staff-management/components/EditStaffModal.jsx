import React from "react";
import { MdSave } from "react-icons/md";
import Modal from "components/modal/Modal";

const EditStaffModal = ({
  editModalOpen,
  setEditModalOpen,
  selectedStaff,
  editForm,
  setEditForm,
  confirmEdit,
  loading,
}) => {
  const handleInputChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
      <div className="p-6">
        <h3 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
          Edit Staff Member
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                value={editForm.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                value={editForm.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Email
            </label>
            <input
              type="email"
              value={editForm.work_email}
              onChange={(e) => handleInputChange("work_email", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Work Phone
            </label>
            <input
              type="tel"
              value={editForm.work_phone}
              onChange={(e) => handleInputChange("work_phone", e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={editForm.staff_role}
                onChange={(e) =>
                  handleInputChange("staff_role", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <input
                type="text"
                value={editForm.department}
                onChange={(e) =>
                  handleInputChange("department", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Professional Title
            </label>
            <input
              type="text"
              value={editForm.professional_title}
              onChange={(e) =>
                handleInputChange("professional_title", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Employment Status
            </label>
            <select
              value={editForm.employment_status}
              onChange={(e) =>
                handleInputChange("employment_status", e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 p-2.5 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div className="border-t border-gray-200 pt-4 dark:border-navy-600">
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.can_manage_staff}
                  onChange={(e) =>
                    handleInputChange("can_manage_staff", e.target.checked)
                  }
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Can manage staff
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.can_approve_appointments}
                  onChange={(e) =>
                    handleInputChange(
                      "can_approve_appointments",
                      e.target.checked
                    )
                  }
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Can approve appointments
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.can_edit_clinic_info}
                  onChange={(e) =>
                    handleInputChange("can_edit_clinic_info", e.target.checked)
                  }
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Can edit clinic information
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={editForm.is_accepting_new_patients}
                  onChange={(e) =>
                    handleInputChange(
                      "is_accepting_new_patients",
                      e.target.checked
                    )
                  }
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Accepting new patients
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => setEditModalOpen(false)}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={confirmEdit}
            className="flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
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

export default EditStaffModal;
