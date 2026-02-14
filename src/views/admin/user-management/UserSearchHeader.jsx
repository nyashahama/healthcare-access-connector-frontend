import React from "react";
import { MdSearch } from "react-icons/md";
import { FaUserInjured, FaUserMd, FaShieldAlt } from "react-icons/fa";

const UserSearchHeader = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  patientsCount,
  providersCount,
}) => {
  return (
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
            Patients ({patientsCount})
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
            Providers ({providersCount})
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
  );
};

export default UserSearchHeader;
