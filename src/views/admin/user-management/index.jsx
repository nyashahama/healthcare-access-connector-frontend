import React, { useState } from "react";
import {
  MdSearch,
  MdFilterList,
  MdEdit,
  MdDelete,
  MdBlock,
  MdCheckCircle,
  MdPerson,
  MdLocalHospital,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdMoreVert,
  MdAdd,
  MdVisibility,
  MdCalendarToday,
  MdWarning,
  MdInfo,
  MdLock,
  MdLockOpen,
  MdVerified,
  MdCancel,
  MdSave,
} from "react-icons/md";
import {
  FaUserMd,
  FaUserInjured,
  FaShieldAlt,
  FaStethoscope,
  FaNotesMedical,
} from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "active",
    specialty: "",
    clinic: "",
  });

  const userStats = [
    {
      title: "Total Patients",
      count: "12,458",
      icon: <FaUserInjured className="h-6 w-6 text-blue-500" />,
      color: "blue",
      trend: "+8% this month",
    },
    {
      title: "Active Providers",
      count: "589",
      icon: <FaUserMd className="h-6 w-6 text-green-500" />,
      color: "green",
      trend: "+12% this month",
    },
    {
      title: "Suspended Accounts",
      count: "23",
      icon: <MdBlock className="h-6 w-6 text-red-500" />,
      color: "red",
      trend: "-2 this week",
    },
    {
      title: "New Registrations",
      count: "842",
      icon: <MdAdd className="h-6 w-6 text-purple-500" />,
      color: "purple",
      trend: "+15% this week",
    },
  ];

  const patients = [
    {
      id: 1,
      name: "Nthabiseng Molefe",
      age: "28",
      gender: "Female",
      location: "Soweto, Gauteng",
      phone: "+27 71 234 5678",
      email: "nthabiseng.m@example.com",
      lastVisit: "2024-01-15",
      status: "active",
      healthIssues: ["Asthma", "Pregnancy"],
      registeredDate: "2023-06-15",
      bloodType: "O+",
      allergies: ["Penicillin"],
    },
    {
      id: 2,
      name: "Thabo Mokoena",
      age: "5",
      gender: "Male",
      location: "Alexandra, Gauteng",
      phone: "+27 82 345 6789",
      email: "parent.thabo@example.com",
      lastVisit: "2024-01-14",
      status: "active",
      healthIssues: ["Malnutrition", "Immunizations"],
      registeredDate: "2023-08-20",
      bloodType: "A+",
      allergies: ["Peanuts"],
    },
    {
      id: 3,
      name: "Zanele Ndlovu",
      age: "65",
      gender: "Female",
      location: "Khayelitsha, WC",
      phone: "+27 83 456 7890",
      email: "zanele.n@example.com",
      lastVisit: "2024-01-10",
      status: "inactive",
      healthIssues: ["Diabetes", "Hypertension"],
      registeredDate: "2022-11-05",
      bloodType: "B+",
      allergies: ["Sulfa drugs"],
    },
    {
      id: 4,
      name: "Lerato Smith",
      age: "32",
      gender: "Female",
      location: "Durban, KZN",
      phone: "+27 74 567 8901",
      email: "lerato.s@example.com",
      lastVisit: "2024-01-08",
      status: "active",
      healthIssues: ["HIV Management"],
      registeredDate: "2023-09-12",
      bloodType: "AB+",
      allergies: ["Latex"],
    },
    {
      id: 5,
      name: "Kagiso Williams",
      age: "8",
      gender: "Male",
      location: "Polokwane, LP",
      phone: "+27 76 678 9012",
      email: "parent.kagiso@example.com",
      lastVisit: "2024-01-05",
      status: "suspended",
      healthIssues: ["Tuberculosis"],
      registeredDate: "2023-10-30",
      bloodType: "O-",
      allergies: ["Eggs"],
    },
    {
      id: 6,
      name: "Nomvula Jones",
      age: "45",
      gender: "Female",
      location: "Port Elizabeth, EC",
      phone: "+27 78 789 0123",
      email: "nomvula.j@example.com",
      lastVisit: "2023-12-20",
      status: "active",
      healthIssues: ["Arthritis", "Chronic Pain"],
      registeredDate: "2023-07-18",
      bloodType: "A-",
      allergies: ["Shellfish"],
    },
  ];

  const providers = [
    {
      id: 101,
      name: "Dr. Sarah Johnson",
      specialty: "Pediatrics",
      clinic: "Soweto CHC",
      location: "Soweto, Gauteng",
      phone: "+27 11 123 4567",
      email: "sarah.j@sowetochc.org",
      patients: "1,245",
      status: "verified",
      verification: "Level 3",
      registrationNo: "HPCSA-12345",
      experience: "12 years",
      languages: ["English", "isiZulu"],
    },
    {
      id: 102,
      name: "Dr. Michael Chen",
      specialty: "General Medicine",
      clinic: "Khayelitsha DC",
      location: "Cape Town, WC",
      phone: "+27 21 234 5678",
      email: "m.chen@khayelitsha.gov",
      patients: "980",
      status: "verified",
      verification: "Level 2",
      registrationNo: "HPCSA-23456",
      experience: "8 years",
      languages: ["English", "Afrikaans"],
    },
    {
      id: 103,
      name: "Nurse Lerato Molefe",
      specialty: "Community Health",
      clinic: "Mobile Unit #3",
      location: "Limpopo Province",
      phone: "+27 15 345 6789",
      email: "lerato.m@mobilehealth.org",
      patients: "320",
      status: "pending",
      verification: "Level 1",
      registrationNo: "SANC-34567",
      experience: "5 years",
      languages: ["isiZulu", "Sesotho", "English"],
    },
    {
      id: 104,
      name: "Dr. James Wilson",
      specialty: "Emergency Medicine",
      clinic: "Hillbrow Clinic",
      location: "Johannesburg, Gauteng",
      phone: "+27 11 456 7890",
      email: "jwilson@hillbrowclinic.co.za",
      patients: "856",
      status: "verified",
      verification: "Level 3",
      registrationNo: "HPCSA-45678",
      experience: "15 years",
      languages: ["English"],
    },
    {
      id: 105,
      name: "Dr. Amina Hassan",
      specialty: "Maternal Health",
      clinic: "Mitchells Plain CHC",
      location: "Cape Town, WC",
      phone: "+27 21 567 8901",
      email: "amina.h@mpchc.org",
      patients: "745",
      status: "suspended",
      verification: "Level 2",
      registrationNo: "HPCSA-56789",
      experience: "10 years",
      languages: ["English", "Afrikaans", "Arabic"],
    },
  ];

  // Modal handlers
  const handleEditClick = (user, type) => {
    setSelectedUser({ ...user, type });
    setEditForm({
      name: user.name,
      email: user.email || "",
      phone: user.phone || "",
      location: user.location || "",
      status: user.status || "active",
      specialty: user.specialty || "",
      clinic: user.clinic || "",
    });
    setEditModalOpen(true);
  };

  const handleSuspendClick = (user, type) => {
    setSelectedUser({ ...user, type });
    setSuspendModalOpen(true);
  };

  const handleDeleteClick = (user, type) => {
    setSelectedUser({ ...user, type });
    setDeleteModalOpen(true);
  };

  const handleViewDetails = (user, type) => {
    setSelectedUser({ ...user, type });
    setViewModalOpen(true);
  };

  const handleAddUserClick = () => {
    setEditForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      status: "active",
      specialty: "",
      clinic: "",
    });
    setAddUserModalOpen(true);
  };

  // Action confirmations
  const confirmEdit = () => {
    console.log(
      `Editing ${selectedUser.type} with ID: ${selectedUser.id}`,
      editForm
    );
    setEditModalOpen(false);
    showToast(`${selectedUser.name} updated successfully!`, "success");
  };

  const confirmSuspend = () => {
    const action =
      selectedUser.status === "suspended" ? "reactivated" : "suspended";
    console.log(`${action} ${selectedUser.type} with ID: ${selectedUser.id}`);
    setSuspendModalOpen(false);
    showToast(
      `${selectedUser.name} has been ${action}.`,
      selectedUser.status === "suspended" ? "success" : "warning"
    );
  };

  const confirmDelete = () => {
    console.log(`Deleting ${selectedUser.type} with ID: ${selectedUser.id}`);
    setDeleteModalOpen(false);
    showToast(`${selectedUser.name} has been deleted.`, "error");
  };

  const confirmAddUser = () => {
    console.log("Adding new user", editForm);
    setAddUserModalOpen(false);
    showToast("New user created successfully!", "success");
  };

  // Form handler
  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        text: "Active",
        icon: <MdCheckCircle className="h-3 w-3" />,
      },
      inactive: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        text: "Inactive",
        icon: <MdCancel className="h-3 w-3" />,
      },
      suspended: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        text: "Suspended",
        icon: <MdBlock className="h-3 w-3" />,
      },
      verified: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        text: "Verified",
        icon: <MdVerified className="h-3 w-3" />,
      },
      pending: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        text: "Pending",
        icon: <MdWarning className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  return (
    <div className="h-full">
      {/* Modals */}
      {/* View Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="User Details"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* User Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {selectedUser.type === "patients" ? (
                    <MdPerson className="h-8 w-8" />
                  ) : (
                    <MdLocalHospital className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                    {selectedUser.name}
                  </h4>
                  <div className="mt-1 flex items-center gap-2">
                    {getStatusBadge(selectedUser.status)}
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedUser.type === "patients"
                        ? `Patient • ${selectedUser.age} years • ${selectedUser.gender}`
                        : `${selectedUser.specialty} • ${selectedUser.verification}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h5 className="mb-2 text-sm font-medium text-gray-500">
                    Contact Information
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MdPhone className="mr-3 h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedUser.phone}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MdEmail className="mr-3 h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedUser.email}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MdLocationOn className="mr-3 h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {selectedUser.location}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedUser.type === "patients" && (
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-gray-500">
                      Medical Information
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaNotesMedical className="mr-3 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Blood Type:{" "}
                            <span className="font-medium">
                              {selectedUser.bloodType || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MdWarning className="mr-3 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Allergies:{" "}
                            <span className="font-medium">
                              {selectedUser.allergies?.join(", ") || "None"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="mb-2 text-sm font-medium text-gray-500">
                    Account Information
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MdCalendarToday className="mr-3 h-4 w-4 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedUser.type === "patients"
                            ? "Last Visit"
                            : "Last Active"}
                        </div>
                        <div className="font-medium">
                          {selectedUser.lastVisit}
                        </div>
                      </div>
                    </div>
                    {selectedUser.registeredDate && (
                      <div className="flex items-center">
                        <MdCalendarToday className="mr-3 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Registered
                          </div>
                          <div className="font-medium">
                            {selectedUser.registeredDate}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedUser.type === "providers" && (
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-gray-500">
                      Professional Details
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <FaStethoscope className="mr-3 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Registration No.
                          </div>
                          <div className="font-medium">
                            {selectedUser.registrationNo}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MdCalendarToday className="mr-3 h-4 w-4 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-700 dark:text-gray-300">
                            Experience
                          </div>
                          <div className="font-medium">
                            {selectedUser.experience}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Health Issues/Tags */}
            {selectedUser.healthIssues &&
              selectedUser.healthIssues.length > 0 && (
                <div>
                  <h5 className="mb-2 text-sm font-medium text-gray-500">
                    Health Conditions
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.healthIssues.map((issue, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit ${
          selectedUser?.type === "patients" ? "Patient" : "Provider"
        }`}
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
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
                  onChange={(e) => handleFormChange("email", e.target.value)}
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
                  onChange={(e) => handleFormChange("phone", e.target.value)}
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
                  onChange={(e) => handleFormChange("location", e.target.value)}
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
                      onChange={(e) =>
                        handleFormChange("specialty", e.target.value)
                      }
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
                      onChange={(e) =>
                        handleFormChange("clinic", e.target.value)
                      }
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
                  onChange={(e) => handleFormChange("status", e.target.value)}
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
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              >
                <MdSave className="h-5 w-5" />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Suspend/Activate Confirmation Modal */}
      <Modal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        title={
          selectedUser?.status === "suspended"
            ? "Reactivate User"
            : "Suspend User"
        }
        size="md"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center justify-center">
              <div
                className={`rounded-full p-4 ${
                  selectedUser.status === "suspended"
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-yellow-100 dark:bg-yellow-900"
                }`}
              >
                {selectedUser.status === "suspended" ? (
                  <MdLockOpen className="h-8 w-8 text-green-600 dark:text-green-300" />
                ) : (
                  <MdLock className="h-8 w-8 text-yellow-600 dark:text-yellow-300" />
                )}
              </div>
            </div>

            <div className="text-center">
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                {selectedUser.status === "suspended"
                  ? `Reactivate ${selectedUser.name}?`
                  : `Suspend ${selectedUser.name}?`}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedUser.status === "suspended"
                  ? "This user will regain access to their account and all features."
                  : "This user will lose access to their account until reactivated."}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <div className="flex items-start">
                <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {selectedUser.status === "suspended"
                    ? "Suspension reason will be cleared upon reactivation."
                    : "You can specify a suspension reason for reference."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSuspendModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmSuspend}
                className={`rounded-lg px-6 py-3 font-medium text-white ${
                  selectedUser.status === "suspended"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {selectedUser.status === "suspended"
                  ? "Reactivate User"
                  : "Suspend User"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete User"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Delete "{selectedUser?.name}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This action cannot be undone. All user data, including medical
                records and history, will be permanently deleted.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Warning:</strong> Deleting this user will remove all
                associated data including appointments, prescriptions, and
                medical history.
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
              Delete User Permanently
            </button>
          </div>
        </div>
      </Modal>

      {/* Add User Modal */}
      <Modal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        title="Add New User"
        size="lg"
      >
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
                onChange={(e) => handleFormChange("name", e.target.value)}
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
                onChange={(e) => handleFormChange("email", e.target.value)}
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
                onChange={(e) => handleFormChange("phone", e.target.value)}
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
                    onChange={(e) => handleFormChange("clinic", e.target.value)}
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
                onChange={(e) => handleFormChange("location", e.target.value)}
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
                onChange={(e) => handleFormChange("status", e.target.value)}
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
              onClick={() => setAddUserModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddUser}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdAdd className="h-5 w-5" />
              Create User
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            User Management
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage patients, providers, and user accounts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button
            onClick={handleAddUserClick}
            className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95 active:bg-brand-700"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Add New User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 ${
              stat.color === "blue"
                ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
                : stat.color === "green"
                ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
                : stat.color === "red"
                ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"
                : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.title}
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {stat.count}
                </div>
              </div>
              <div className="rounded-full bg-white p-3 dark:bg-navy-700">
                {stat.icon}
              </div>
            </div>
            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="mb-6 rounded-xl bg-white p-4 dark:bg-navy-800">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, location, or ID..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-navy-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("patients")}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                activeTab === "patients"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
              }`}
            >
              <FaUserInjured className="mr-2 h-4 w-4" />
              Patients ({patients.length})
            </button>
            <button
              onClick={() => setActiveTab("providers")}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                activeTab === "providers"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
              }`}
            >
              <FaUserMd className="mr-2 h-4 w-4" />
              Providers ({providers.length})
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                activeTab === "admins"
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
              }`}
            >
              <FaShieldAlt className="mr-2 h-4 w-4" />
              Admins
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Card extra="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              {activeTab === "patients"
                ? "Patient Management"
                : activeTab === "providers"
                ? "Healthcare Provider Management"
                : "Administrator Management"}
            </h4>
            <p className="text-sm text-gray-600">
              {activeTab === "patients"
                ? "Manage patient records and accounts"
                : activeTab === "providers"
                ? "Manage healthcare provider accounts and permissions"
                : "Manage system administrators and permissions"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700">
              <option>All Status</option>
              <option>Active Only</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  User Name
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  {activeTab === "patients" ? "Age" : "Specialty"}
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  {activeTab === "patients" ? "Location" : "Clinic"}
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  {activeTab === "patients" ? "Last Visit" : "Patients"}
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === "patients" ? patients : providers).map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 transition-all duration-300 hover:scale-[1.005] hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-navy-700"
                >
                  {/* User Name */}
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-300">
                        {activeTab === "patients" ? (
                          <MdPerson className="h-5 w-5" />
                        ) : (
                          <MdLocalHospital className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-navy-700 dark:text-white">
                          {user.name}
                        </div>
                        {activeTab === "patients" ? (
                          <div className="text-sm text-gray-500">
                            {user.gender}, {user.age} years
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Age/Specialty */}
                  <td className="py-4">
                    <div className="font-medium text-navy-700 dark:text-white">
                      {activeTab === "patients" ? user.age : user.specialty}
                    </div>
                    {activeTab === "providers" && (
                      <div className="text-xs text-gray-500">
                        {user.verification}
                      </div>
                    )}
                  </td>

                  {/* Location/Clinic */}
                  <td className="py-4">
                    <div className="flex items-center">
                      <MdLocationOn className="mr-1 h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {activeTab === "patients" ? user.location : user.clinic}
                      </span>
                    </div>
                    {activeTab === "patients" && user.healthIssues && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {user.healthIssues.map((issue, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300"
                          >
                            {issue}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Last Visit/Patients */}
                  <td className="py-4">
                    <div className="font-medium text-navy-700 dark:text-white">
                      {activeTab === "patients"
                        ? user.lastVisit
                        : user.patients}
                    </div>
                    <div className="text-sm text-gray-500">
                      {activeTab === "patients"
                        ? "Last visit"
                        : "Total patients"}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4">{getStatusBadge(user.status)}</td>

                  {/* Actions */}
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(user, activeTab)}
                        className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600"
                        title="View Details"
                      >
                        <MdVisibility className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(user, activeTab)}
                        className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600"
                        title="Edit"
                      >
                        <MdEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSuspendClick(user, activeTab)}
                        className="rounded-lg p-2 text-yellow-600 transition-all duration-200 hover:scale-110 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                        title={
                          user.status === "suspended" ? "Reactivate" : "Suspend"
                        }
                      >
                        <MdBlock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user, activeTab)}
                        className="rounded-lg p-2 text-red-600 transition-all duration-200 hover:scale-110 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600">
                        <MdMoreVert className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing 1-
            {activeTab === "patients"
              ? patients.length
              : providers.length} of{" "}
            {activeTab === "patients" ? patients.length : providers.length}{" "}
            {activeTab === "patients" ? "patients" : "providers"}
          </div>
          <div className="flex items-center space-x-2">
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
              Previous
            </button>
            <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600">
              1
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
              2
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
              3
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
              Next
            </button>
          </div>
        </div>
      </Card>

      {/* Quick Actions and Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* User Activity */}
        <Card extra="p-6">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            📈 User Activity
          </h4>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Sessions</span>
                <span className="font-bold">1,245</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-3/4 rounded-full bg-green-500 transition-all duration-1000"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Session Duration</span>
                <span className="font-bold">8m 24s</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-1/2 rounded-full bg-blue-500 transition-all duration-1000"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Failed Logins (24h)</span>
                <span className="font-bold text-red-500">42</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-1/5 rounded-full bg-red-500 transition-all duration-1000"></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Bulk Actions */}
        <Card extra="p-6">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            ⚡ Bulk Actions
          </h4>
          <div className="space-y-3">
            <button className="w-full rounded-lg bg-green-50 py-3 text-sm font-medium text-green-700 transition-all duration-200 hover:scale-105 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300">
              Send Mass Notification
            </button>
            <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
              Export User Data
            </button>
            <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:border-red-700 dark:text-red-400">
              Clean Up Inactive Accounts
            </button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card extra="p-6">
          <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
            🔔 Recent Activity
          </h4>
          <div className="space-y-3">
            <div className="flex items-start transition-all duration-300 hover:scale-[1.02]">
              <div className="mr-3 rounded-full bg-blue-100 p-1 dark:bg-blue-900">
                <MdPerson className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  New patient registered: Nthabiseng Molefe
                </div>
                <div className="text-xs text-gray-500">10 minutes ago</div>
              </div>
            </div>
            <div className="flex items-start transition-all duration-300 hover:scale-[1.02]">
              <div className="mr-3 rounded-full bg-green-100 p-1 dark:bg-green-900">
                <MdCheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Dr. Sarah Johnson account verified
                </div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start transition-all duration-300 hover:scale-[1.02]">
              <div className="mr-3 rounded-full bg-red-100 p-1 dark:bg-red-900">
                <MdBlock className="h-4 w-4 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Account suspended: Kagiso Williams
                </div>
                <div className="text-xs text-gray-500">Yesterday</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Security Note */}
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 transition-all duration-300 hover:scale-[1.01] dark:bg-red-900/20 dark:text-red-300">
        <p>
          🔒 <strong>Security Note:</strong> User data is protected under POPIA
          regulations. Always verify permissions before accessing sensitive
          medical information.
        </p>
      </div>
    </div>
  );
};

export default UserManagement;
