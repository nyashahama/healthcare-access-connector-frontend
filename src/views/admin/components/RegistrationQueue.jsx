import React from "react";
import { MdPendingActions, MdCheckCircle, MdCancel } from "react-icons/md";

const RegistrationQueue = () => {
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
        <table className="w-full">
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pendingClinics.map((clinic) => (
              <tr
                key={clinic.id}
                className="border-b border-gray-200 dark:border-navy-700"
              >
                <td className="py-4">
                  <div className="font-medium text-navy-700 dark:text-white">
                    {clinic.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {clinic.submitted}
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
                    <span
                      className={`font-medium ${
                        clinic.documents === "3/3"
                          ? "text-green-600 dark:text-green-400"
                          : "text-yellow-600 dark:text-yellow-400"
                      }`}
                    >
                      {clinic.documents}
                    </span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      {clinic.documents === "3/3" ? "Complete" : "Incomplete"}
                    </span>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="flex items-center rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600">
                      <MdCheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </button>
                    <button className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-navy-600 dark:text-gray-300">
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

      <div className="mt-6 flex justify-between">
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
          View All Pending Registrations →
        </button>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing 4 of 8 pending clinics
        </div>
      </div>
    </div>
  );
};

export default RegistrationQueue;
