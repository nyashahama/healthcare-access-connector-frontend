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
} from "react-icons/md";
import { FaUserMd, FaUserInjured, FaShieldAlt } from "react-icons/fa";
import Card from "components/card";

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("patients");
  const [searchQuery, setSearchQuery] = useState("");

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

  const patientColumns = [
    { key: "name", label: "Patient Name" },
    { key: "age", label: "Age" },
    { key: "location", label: "Location" },
    { key: "lastVisit", label: "Last Visit" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const providerColumns = [
    { key: "name", label: "Provider Name" },
    { key: "specialty", label: "Specialty" },
    { key: "clinic", label: "Clinic" },
    { key: "patients", label: "Patients" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const patients = [
    {
      id: 1,
      name: "Nthabiseng Molefe",
      age: "28",
      gender: "Female",
      location: "Soweto, Gauteng",
      phone: "+27 71 234 5678",
      lastVisit: "2024-01-15",
      status: "active",
      healthIssues: ["Asthma", "Pregnancy"],
    },
    {
      id: 2,
      name: "Thabo Mokoena",
      age: "5",
      gender: "Male",
      location: "Alexandra, Gauteng",
      phone: "+27 82 345 6789",
      lastVisit: "2024-01-14",
      status: "active",
      healthIssues: ["Malnutrition", "Immunizations"],
    },
    {
      id: 3,
      name: "Zanele Ndlovu",
      age: "65",
      gender: "Female",
      location: "Khayelitsha, WC",
      phone: "+27 83 456 7890",
      lastVisit: "2024-01-10",
      status: "inactive",
      healthIssues: ["Diabetes", "Hypertension"],
    },
    {
      id: 4,
      name: "Lerato Smith",
      age: "32",
      gender: "Female",
      location: "Durban, KZN",
      phone: "+27 74 567 8901",
      lastVisit: "2024-01-08",
      status: "active",
      healthIssues: ["HIV Management"],
    },
    {
      id: 5,
      name: "Kagiso Williams",
      age: "8",
      gender: "Male",
      location: "Polokwane, LP",
      phone: "+27 76 678 9012",
      lastVisit: "2024-01-05",
      status: "suspended",
      healthIssues: ["Tuberculosis"],
    },
    {
      id: 6,
      name: "Nomvula Jones",
      age: "45",
      gender: "Female",
      location: "Port Elizabeth, EC",
      phone: "+27 78 789 0123",
      lastVisit: "2023-12-20",
      status: "active",
      healthIssues: ["Arthritis", "Chronic Pain"],
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
    },
  ];

  const handleEditUser = (userId, type) => {
    console.log(`Editing ${type} with ID: ${userId}`);
  };

  const handleDeleteUser = (userId, type) => {
    console.log(`Deleting ${type} with ID: ${userId}`);
  };

  const handleSuspendUser = (userId, type) => {
    console.log(`Suspending ${type} with ID: ${userId}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        text: "Active",
      },
      inactive: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        text: "Inactive",
      },
      suspended: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        text: "Suspended",
      },
      verified: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        text: "Verified",
      },
      pending: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        text: "Pending",
      },
    };

    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="h-full">
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
          <button className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700">
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
            className={`rounded-xl border border-gray-200 p-4 dark:border-gray-700 ${
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
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("patients")}
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
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
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
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
              className={`flex items-center rounded-lg px-4 py-2 text-sm font-medium ${
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
                : "Healthcare Provider Management"}
            </h4>
            <p className="text-sm text-gray-600">
              {activeTab === "patients"
                ? "Manage patient records and accounts"
                : "Manage healthcare provider accounts and permissions"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
              <option>All Status</option>
              <option>Active Only</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium dark:border-gray-600">
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {(activeTab === "patients"
                  ? patientColumns
                  : providerColumns
                ).map((column) => (
                  <th
                    key={column.key}
                    className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(activeTab === "patients" ? patients : providers).map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-navy-700"
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
                        onClick={() => handleEditUser(user.id, activeTab)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600"
                        title="Edit"
                      >
                        <MdEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleSuspendUser(user.id, activeTab)}
                        className="rounded-lg p-2 text-yellow-600 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                        title="Suspend/Activate"
                      >
                        <MdBlock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, activeTab)}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <MdDelete className="h-4 w-4" />
                      </button>
                      <button className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600">
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
            Showing 1-6 of{" "}
            {activeTab === "patients" ? patients.length : providers.length}{" "}
            {activeTab === "patients" ? "patients" : "providers"}
          </div>
          <div className="flex items-center space-x-2">
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
              Previous
            </button>
            <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white">
              1
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
              2
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
              3
            </button>
            <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm dark:border-gray-600">
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
                <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Avg. Session Duration</span>
                <span className="font-bold">8m 24s</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-1/2 rounded-full bg-blue-500"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Failed Logins (24h)</span>
                <span className="font-bold text-red-500">42</span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div className="h-2 w-1/5 rounded-full bg-red-500"></div>
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
            <button className="w-full rounded-lg bg-green-50 py-3 text-sm font-medium text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300">
              Send Mass Notification
            </button>
            <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
              Export User Data
            </button>
            <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400">
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
            <div className="flex items-start">
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
            <div className="flex items-start">
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
            <div className="flex items-start">
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
      <div className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
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
