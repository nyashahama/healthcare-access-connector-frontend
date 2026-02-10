import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaUserNurse,
  FaStethoscope,
  FaUserPlus,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { MdEdit, MdVerified, MdWarning, MdCheckCircle } from "react-icons/md";
import { useProvider } from "hooks/useProvider";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const MedicalStaff = ({ clinicId }) => {
  const {
    listClinicStaff,
    registerStaff,
    updateStaff,
    deleteStaff,
    staffList,
    loading,
  } = useProvider();
  const [staffMembers, setStaffMembers] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: "doctor",
    specialization: "",
  });

  const { showToast } = useToast();

  useEffect(() => {
    const fetchStaff = async () => {
      if (clinicId) {
        const result = await listClinicStaff(clinicId);
        if (result.success) {
          setStaffMembers(result.data);
        }
      }
    };

    fetchStaff();
  }, [clinicId, listClinicStaff]);

  const getStatusColor = (status) => {
    const colors = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      on_leave:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    };
    return colors[status] || colors.inactive;
  };

  const getRoleColor = (role) => {
    const colors = {
      doctor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      nurse:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      specialist:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      admin:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    };
    return colors[role] || colors.doctor;
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setViewModalOpen(true);
  };

  const handleAddStaff = () => {
    setStaffForm({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "doctor",
      specialization: "",
    });
    setAddModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      first_name: staff.first_name || "",
      last_name: staff.last_name || "",
      email: staff.email || "",
      phone_number: staff.phone_number || "",
      role: staff.role || "doctor",
      specialization: staff.specialization || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  const handleSaveNewStaff = async () => {
    if (!clinicId) return;

    const result = await registerStaff({
      clinic_id: clinicId,
      ...staffForm,
    });

    if (result.success) {
      setStaffMembers([...staffMembers, result.data]);
      setAddModalOpen(false);
      showToast("Staff member added successfully!", "success");
    } else {
      showToast("Failed to add staff member", "error");
    }
  };

  const handleUpdateStaff = async () => {
    if (!selectedStaff?.staff_id) return;

    const result = await updateStaff(selectedStaff.staff_id, staffForm);

    if (result.success) {
      setStaffMembers(
        staffMembers.map((s) =>
          s.staff_id === selectedStaff.staff_id ? result.data : s
        )
      );
      setEditModalOpen(false);
      showToast("Staff member updated successfully!", "success");
    } else {
      showToast("Failed to update staff member", "error");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStaff?.staff_id) return;

    const result = await deleteStaff(selectedStaff.staff_id);

    if (result.success) {
      setStaffMembers(
        staffMembers.filter((s) => s.staff_id !== selectedStaff.staff_id)
      );
      setDeleteModalOpen(false);
      showToast("Staff member deleted successfully!", "success");
    } else {
      showToast("Failed to delete staff member", "error");
    }
  };

  const displayStaff = staffMembers.length > 0 ? staffMembers : staffList;

  if (loading && !displayStaff.length) {
    return (
      <Card extra={"w-full h-full p-6"}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 rounded bg-gray-200 dark:bg-navy-700"></div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-navy-700"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-navy-700"></div>
                <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-navy-700"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* View Staff Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Staff Details"
        size="md"
      >
        {selectedStaff && (
          <div className="space-y-4">
            <div className="text-center">
              <div
                className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${getRoleColor(
                  selectedStaff.role
                )}`}
              >
                <span className="text-2xl font-bold">
                  {getInitials(
                    selectedStaff.first_name,
                    selectedStaff.last_name
                  )}
                </span>
              </div>
              <h3 className="text-xl font-bold">
                {selectedStaff.first_name} {selectedStaff.last_name}
              </h3>
              <p className="text-gray-600">{selectedStaff.role}</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedStaff.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">
                  {selectedStaff.phone_number || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Specialization</p>
                <p className="font-medium">
                  {selectedStaff.specialization || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    selectedStaff.status
                  )}`}
                >
                  {selectedStaff.status || "active"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Add/Edit Staff Modal */}
      <Modal
        isOpen={addModalOpen || editModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditModalOpen(false);
        }}
        title={addModalOpen ? "Add New Staff Member" : "Edit Staff Member"}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                First Name *
              </label>
              <input
                type="text"
                value={staffForm.first_name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, first_name: e.target.value })
                }
                className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Last Name *
              </label>
              <input
                type="text"
                value={staffForm.last_name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, last_name: e.target.value })
                }
                className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Email *</label>
            <input
              type="email"
              value={staffForm.email}
              onChange={(e) =>
                setStaffForm({ ...staffForm, email: e.target.value })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="tel"
              value={staffForm.phone_number}
              onChange={(e) =>
                setStaffForm({ ...staffForm, phone_number: e.target.value })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Role *</label>
            <select
              value={staffForm.role}
              onChange={(e) =>
                setStaffForm({ ...staffForm, role: e.target.value })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="specialist">Specialist</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Specialization
            </label>
            <input
              type="text"
              value={staffForm.specialization}
              onChange={(e) =>
                setStaffForm({ ...staffForm, specialization: e.target.value })
              }
              className="w-full rounded-lg border p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="e.g., Family Medicine, Pediatrics"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setAddModalOpen(false);
                setEditModalOpen(false);
              }}
              className="rounded-lg border px-6 py-3 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={addModalOpen ? handleSaveNewStaff : handleUpdateStaff}
              disabled={loading}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              {loading
                ? "Saving..."
                : addModalOpen
                ? "Add Staff"
                : "Update Staff"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Staff Member"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete {selectedStaff?.first_name}{" "}
            {selectedStaff?.last_name}?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border px-6 py-3 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={loading}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Medical Staff
        </h4>
        <button
          onClick={handleAddStaff}
          className="flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
        >
          <FaUserPlus className="mr-1" />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="space-y-3">
        {displayStaff.length > 0 ? (
          displayStaff.map((staff) => (
            <div
              key={staff.staff_id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:shadow-md dark:border-navy-600"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${getRoleColor(
                    staff.role
                  )}`}
                >
                  <span className="text-lg font-bold">
                    {getInitials(staff.first_name, staff.last_name)}
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-navy-700 dark:text-white">
                    {staff.first_name} {staff.last_name}
                  </h5>
                  <p className="text-sm text-gray-600">
                    {staff.role}{" "}
                    {staff.specialization && `• ${staff.specialization}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    staff.status
                  )}`}
                >
                  {staff.status || "active"}
                </span>

                <button
                  onClick={() => handleViewStaff(staff)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <FaEye className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleEditStaff(staff)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <MdEdit className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDeleteClick(staff)}
                  className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-navy-700"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <FaUserMd className="mx-auto mb-4 text-5xl opacity-50" />
            <p>No staff members added yet</p>
            <button
              onClick={handleAddStaff}
              className="mt-4 text-brand-500 hover:text-brand-600"
            >
              Add your first staff member
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicalStaff;
