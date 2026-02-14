import React, { useState } from "react";
import {
  MdFilterList,
  MdAdd,
  MdBlock,
  MdCheckCircle,
  MdCancel,
  MdVerified,
  MdWarning,
} from "react-icons/md";
import { FaUserMd, FaUserInjured, FaShieldAlt } from "react-icons/fa";
import { useToast } from "hooks/useToast";
import UserStats from "./UserStats";
import UserSearchHeader from "./UserSearchHeader";
import UserTable from "./UserTable";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";
import SuspendUserModal from "./SuspendUserModal";
import DeleteUserModal from "./DeleteUserModal";
import AddUserModal from "./AddUserModal";
import QuickActions from "./QuickActions";
import Card from "components/card";

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

  // Stats data
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

  // Patients data
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

  // Providers data
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

  // Status badge generator
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
      <ViewUserModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        selectedUser={selectedUser}
        getStatusBadge={getStatusBadge}
      />
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        selectedUser={selectedUser}
        editForm={editForm}
        onFormChange={handleFormChange}
        onConfirm={confirmEdit}
      />
      <SuspendUserModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        selectedUser={selectedUser}
        onConfirm={confirmSuspend}
      />
      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedUser={selectedUser}
        onConfirm={confirmDelete}
      />
      <AddUserModal
        isOpen={addUserModalOpen}
        onClose={() => setAddUserModalOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        editForm={editForm}
        onFormChange={handleFormChange}
        onConfirm={confirmAddUser}
      />

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

      {/* Stats */}
      <UserStats stats={userStats} />

      {/* Search and Tabs */}
      <UserSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientsCount={patients.length}
        providersCount={providers.length}
      />

      {/* Main Table */}
      <Card extra="p-6">
        <UserTable
          activeTab={activeTab}
          patients={patients}
          providers={providers}
          onView={handleViewDetails}
          onEdit={handleEditClick}
          onSuspend={handleSuspendClick}
          onDelete={handleDeleteClick}
          getStatusBadge={getStatusBadge}
        />
      </Card>

      {/* Quick Actions and Activity */}
      <QuickActions />
    </div>
  );
};

export default UserManagement;
