import React from "react";
import { MdPendingActions, MdCheckCircle, MdCancel } from "react-icons/md";

const RegistrationQueue = ({ onApprove, onReject, onViewAll }) => {
  const pendingClinics = [
    {
      id: 1,
      name: "Sunrise Medical Center",
      location: "Johannesburg, GP",
      submitted: "2 days ago",
      type: "Private Clinic",
      documents: "3/3",
    },
    {
      id: 2,
      name: "Rural Health Outreach",
      location: "Limpopo Province",
      submitted: "1 day ago",
      type: "NGO Clinic",
      documents: "2/3",
    },
    {
      id: 3,
      name: "City Pediatrics",
      location: "Cape Town, WC",
      submitted: "3 days ago",
      type: "Specialist Clinic",
      documents: "3/3",
    },
    {
      id: 4,
      name: "Community Wellness",
      location: "Durban, KZN",
      submitted: "5 hours ago",
      type: "Public Clinic",
      documents: "1/3",
    },
    {
      id: 5,
      name: "Urban Dental Care",
      location: "Pretoria, GP",
      submitted: "1 week ago",
      type: "Private Clinic",
      documents: "3/3",
    },
    {
      id: 6,
      name: "Maternal Health Clinic",
      location: "Eastern Cape",
      submitted: "2 days ago",
      type: "Public Clinic",
      documents: "2/3",
    },
    {
      id: 7,
      name: "Specialist Oncology",
      location: "Johannesburg, GP",
      submitted: "4 days ago",
      type: "Specialist Clinic",
      documents: "3/3",
    },
    {
      id: 8,
      name: "Rural Mobile Clinic",
      location: "North West Province",
      submitted: "6 hours ago",
      type: "NGO Clinic",
      documents: "1/3",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Clinic Registration Queue
        </h5>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MdPendingActions className="mr-2 h-4 w-4" />
          <span className="font-bold text-brand-500">8</span> pending
          verification
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-200 dark:border-navy-700">
              <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Clinic Name
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Location
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Type
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                Documents
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
            {pendingClinics.slice(0, 4).map((clinic) => (
              <tr
                key={clinic.id}
                className="border-b border-gray-200 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-700/50"
              >
                <td className="py-4">
                  <div className="font-medium text-navy-700 dark:text-white">
                    {clinic.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Submitted {clinic.submitted}
                  </div>
                </td>
                <td className="py-4 text-gray-600 dark:text-gray-300">
                  {clinic.location}
                </td>
                <td className="py-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300">
                    {clinic.type}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                        <div
                          className={`h-2 rounded-full ${
                            clinic.documents === "3/3"
                              ? "w-full bg-green-500"
                              : clinic.documents === "2/3"
                              ? "w-2/3 bg-yellow-500"
                              : "w-1/3 bg-red-500"
                          }`}
                        ></div>
                      </div>
                      <span
                        className={`absolute -right-6 top-1/2 -translate-y-1/2 text-xs font-medium ${
                          clinic.documents === "3/3"
                            ? "text-green-600 dark:text-green-400"
                            : clinic.documents === "2/3"
                            ? "text-yellow-600 dark:text-yellow-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {clinic.documents}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      clinic.documents === "3/3"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    }`}
                  >
                    {clinic.documents === "3/3"
                      ? "Ready for Review"
                      : "Documents Pending"}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApprove(clinic)}
                      className="flex items-center rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
                    >
                      <MdCheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onReject(clinic)}
                      className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-navy-600 dark:text-gray-300"
                    >
                      <MdCancel className="mr-2 h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <button
          onClick={onViewAll}
          className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
        >
          View All Pending Registrations →
        </button>
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Complete (3/3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
            <span>Partial (2/3)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500"></div>
            <span>Incomplete (1/3)</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing 4 of 8 pending clinics
        </div>
      </div>
    </div>
  );
};

export default RegistrationQueue;
