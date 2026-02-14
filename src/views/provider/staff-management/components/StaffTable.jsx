import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaUserMd, FaUserNurse } from "react-icons/fa";
import Card from "components/card";

const StaffTable = ({
  clinicLoading,
  clinicId,
  loading,
  staffList,
  handleEditClick,
  handleDeleteClick,
  getRoleIcon,
  getRoleLabel,
  getStatusBadge,
  formatDate,
}) => {
  return (
    <Card extra="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Team Members
        </h4>
      </div>

      {clinicLoading ? (
        <div className="py-8 text-center text-gray-500">
          <div className="mb-2">Loading clinic information...</div>
        </div>
      ) : !clinicId ? (
        <div className="py-8 text-center">
          <div className="mb-2 text-red-500">
            Unable to load clinic information
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-brand-500 hover:text-brand-600"
          >
            Refresh page
          </button>
        </div>
      ) : loading && staffList.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          Loading staff members...
        </div>
      ) : staffList.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No staff members found. Invite your first team member!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-navy-600">
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Staff Member
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Role
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Department
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Start Date
                </th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((staff) => (
                <tr
                  key={staff.id}
                  className="border-b border-gray-100 dark:border-navy-700"
                >
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                        {getRoleIcon(staff.staff_role)}
                      </div>
                      <div>
                        <p className="font-medium text-navy-700 dark:text-white">
                          {staff.first_name} {staff.last_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {staff.work_email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        staff.staff_role === "doctor"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                          : staff.staff_role === "nurse"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                      }`}
                    >
                      {getRoleLabel(staff.staff_role)}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {staff.department || "N/A"}
                  </td>
                  <td className="py-4">
                    {getStatusBadge(staff.employment_status)}
                  </td>
                  <td className="py-4 text-sm text-gray-600">
                    {formatDate(staff.start_date)}
                  </td>
                  <td className="py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(staff)}
                        className="rounded-lg p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="Edit"
                      >
                        <MdEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(staff)}
                        className="rounded-lg p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default StaffTable;
