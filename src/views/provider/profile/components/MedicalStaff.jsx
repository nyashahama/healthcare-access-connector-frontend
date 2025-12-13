import React, { useState } from "react";
import {
  FaUserMd,
  FaUserNurse,
  FaStethoscope,
  FaUserPlus,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { MdEdit, MdVerified, MdWarning, MdCheckCircle } from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const MedicalStaff = () => {
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "Dr. Michael Smith",
      role: "General Practitioner",
      specialization: "Family Medicine, Pediatrics",
      status: "available",
      avatar: "MS",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      email: "m.smith@clinic.co.za",
      phone: "+27 11 234 5678",
      experience: "15 years",
      qualifications: "MBChB, DipFamMed",
    },
    {
      id: 2,
      name: "Nurse Sarah Johnson",
      role: "Registered Nurse",
      specialization: "Immunizations, Wound Care",
      status: "busy",
      avatar: "SJ",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      email: "s.johnson@clinic.co.za",
      phone: "+27 11 234 5679",
      experience: "8 years",
      qualifications: "BSc Nursing, Advanced Practice",
    },
    {
      id: 3,
      name: "Dr. Thandi Nkosi",
      role: "Pediatrician",
      specialization: "Child Health, Vaccinations",
      status: "available",
      avatar: "TN",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      email: "t.nkosi@clinic.co.za",
      phone: "+27 11 234 5680",
      experience: "12 years",
      qualifications: "MBChB, FC Paed",
    },
    {
      id: 4,
      name: "Nurse David Brown",
      role: "Clinic Manager",
      specialization: "Chronic Disease Management",
      status: "offline",
      avatar: "DB",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      email: "d.brown@clinic.co.za",
      phone: "+27 11 234 5681",
      experience: "10 years",
      qualifications: "BAdmin, Nursing Diploma",
    },
  ]);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "General Practitioner",
    specialization: "",
    email: "",
    phone: "",
    experience: "",
    qualifications: "",
  });

  const { showToast } = useToast();

  // Modal handlers
  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    setViewModalOpen(true);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setStaffForm({
      name: staff.name,
      role: staff.role,
      specialization: staff.specialization,
      email: staff.email,
      phone: staff.phone,
      experience: staff.experience,
      qualifications: staff.qualifications,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setStaffForm({
      name: "",
      role: "General Practitioner",
      specialization: "",
      email: "",
      phone: "",
      experience: "",
      qualifications: "",
    });
    setAddModalOpen(true);
  };

  // Action confirmations
  const confirmAdd = () => {
    console.log("Adding staff member:", staffForm);
    setAddModalOpen(false);
    showToast("Staff member added successfully!", "success");
  };

  const confirmEdit = () => {
    console.log(`Editing staff ${selectedStaff.id}`, staffForm);
    setEditModalOpen(false);
    showToast("Staff details updated successfully!", "success");
  };

  const confirmDelete = () => {
    console.log(`Deleting staff ${selectedStaff.id}`);
    setDeleteModalOpen(false);
    showToast("Staff member removed successfully!", "error");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "busy":
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case "offline":
        return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "busy":
        return "With Patient";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* View Staff Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Staff Details"
        size="lg"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div
                  className={`mr-4 flex h-16 w-16 items-center justify-center rounded-full ${selectedStaff.color}`}
                >
                  <span className="text-xl font-bold">
                    {selectedStaff.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                    {selectedStaff.name}
                  </h4>
                  <div className="flex items-center">
                    <span className="font-medium text-brand-600 dark:text-brand-300">
                      {selectedStaff.role}
                    </span>
                    <MdVerified className="ml-2 text-blue-500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {getStatusIcon(selectedStaff.status)}
                <span className="ml-2 font-medium">
                  {getStatusText(selectedStaff.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-500">
                  Contact Information
                </h5>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Email:</strong> {selectedStaff.email}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Phone:</strong> {selectedStaff.phone}
                  </p>
                </div>
              </div>
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-500">
                  Professional Details
                </h5>
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Experience:</strong> {selectedStaff.experience}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <strong>Specialization:</strong>{" "}
                    {selectedStaff.specialization}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Qualifications
              </h5>
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedStaff.qualifications}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Staff Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Staff Member"
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
                value={staffForm.name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select
                value={staffForm.role}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, role: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="General Practitioner">
                  General Practitioner
                </option>
                <option value="Registered Nurse">Registered Nurse</option>
                <option value="Specialist">Specialist</option>
                <option value="Clinic Manager">Clinic Manager</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Specialization
              </label>
              <input
                type="text"
                value={staffForm.specialization}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, specialization: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="E.g., Pediatrics, Surgery, etc."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email *
              </label>
              <input
                type="email"
                value={staffForm.email}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, email: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <input
                type="tel"
                value={staffForm.phone}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, phone: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Years of Experience
              </label>
              <input
                type="text"
                value={staffForm.experience}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, experience: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="E.g., 5 years"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Qualifications
            </label>
            <textarea
              value={staffForm.qualifications}
              onChange={(e) =>
                setStaffForm({ ...staffForm, qualifications: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="3"
              placeholder="Enter degrees, certifications, etc."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmAdd}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <FaUserPlus className="h-5 w-5" />
              Add Staff
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Staff Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Staff Member"
        size="lg"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, name: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role *
                </label>
                <select
                  value={staffForm.role}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, role: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                >
                  <option value="General Practitioner">
                    General Practitioner
                  </option>
                  <option value="Registered Nurse">Registered Nurse</option>
                  <option value="Specialist">Specialist</option>
                  <option value="Clinic Manager">Clinic Manager</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Specialization
                </label>
                <input
                  type="text"
                  value={staffForm.specialization}
                  onChange={(e) =>
                    setStaffForm({
                      ...staffForm,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  value={staffForm.email}
                  onChange={(e) =>
                    setStaffForm({ ...staffForm, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Staff Member"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Remove "{selectedStaff?.name}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This staff member will be removed from the clinic roster.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Remove Staff
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaUserMd className="mr-3 text-brand-500" />
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Medical Staff
            </h4>
            <p className="text-sm text-gray-600">
              4 staff members • 2 available now
            </p>
          </div>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <FaUserPlus className="mr-2" />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
          >
            <div className="flex items-center">
              <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${staff.color}`}
              >
                <span className="font-bold">{staff.avatar}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <h5 className="font-bold text-navy-700 dark:text-white">
                    {staff.name}
                  </h5>
                  <MdVerified className="ml-2 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">{staff.role}</p>
                <div className="mt-1 flex items-center">
                  {staff.role.includes("Dr.") ? (
                    <FaStethoscope className="mr-1 text-gray-400" />
                  ) : (
                    <FaUserNurse className="mr-1 text-gray-400" />
                  )}
                  <p className="text-xs text-gray-500">
                    {staff.specialization}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end">
                {getStatusIcon(staff.status)}
                <span className="ml-2 text-sm font-medium">
                  {getStatusText(staff.status)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleViewStaff(staff)}
                  className="rounded-lg p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300"
                  title="View Details"
                >
                  <FaEye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleEditStaff(staff)}
                  className="rounded-lg p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400"
                  title="Edit"
                >
                  <MdEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteClick(staff)}
                  className="rounded-lg p-1 text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400"
                  title="Remove"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Schedule */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-blue-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              !
            </span>
          </div>
          <div>
            <h5 className="font-bold text-blue-800 dark:text-blue-300">
              Staff Schedule This Week
            </h5>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">Dr. Smith</p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Mon-Fri: 8AM-5PM
                </p>
              </div>
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">
                  Nurse Johnson
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Mon-Wed: 9AM-4PM
                </p>
              </div>
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">Dr. Nkosi</p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Thu-Fri: 10AM-3PM
                </p>
              </div>
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">Nurse Brown</p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Mon-Fri: 8AM-4PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MedicalStaff;
