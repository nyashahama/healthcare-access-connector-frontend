import React from "react";
import {
  MdPerson,
  MdLocalHospital,
  MdLocationOn,
  MdVisibility,
  MdEdit,
  MdBlock,
  MdDelete,
  MdMoreVert,
} from "react-icons/md";

const UserTable = ({
  activeTab,
  patients,
  providers,
  onView,
  onEdit,
  onSuspend,
  onDelete,
  getStatusBadge,
}) => {
  const users = activeTab === "patients" ? patients : providers;

  return (
    <>
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
            {users.map((user) => (
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
                    {activeTab === "patients" ? user.lastVisit : user.patients}
                  </div>
                  <div className="text-sm text-gray-500">
                    {activeTab === "patients" ? "Last visit" : "Total patients"}
                  </div>
                </td>

                {/* Status */}
                <td className="py-4">{getStatusBadge(user.status)}</td>

                {/* Actions */}
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(user, activeTab)}
                      className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600"
                      title="View Details"
                    >
                      <MdVisibility className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(user, activeTab)}
                      className="rounded-lg p-2 text-gray-600 transition-all duration-200 hover:scale-110 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-600"
                      title="Edit"
                    >
                      <MdEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onSuspend(user, activeTab)}
                      className="rounded-lg p-2 text-yellow-600 transition-all duration-200 hover:scale-110 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:bg-yellow-900/20"
                      title={
                        user.status === "suspended" ? "Reactivate" : "Suspend"
                      }
                    >
                      <MdBlock className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(user, activeTab)}
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
          Showing 1-{users.length} of {users.length}{" "}
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
    </>
  );
};

export default UserTable;
