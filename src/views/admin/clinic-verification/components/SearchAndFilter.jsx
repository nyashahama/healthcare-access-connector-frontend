import React from "react";
import { MdSearch, MdFilterList, MdRefresh, MdAdd } from "react-icons/md";

const SearchAndFilter = ({
  searchQuery,
  setSearchQuery,
  onRefresh,
  onCreateClick,
  loading,
}) => {
  return (
    <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <div className="relative w-full sm:w-96">
        <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by clinic name, city, or province..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-all duration-200 hover:border-brand-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200 dark:border-navy-600 dark:bg-navy-800 dark:text-white"
        />
      </div>
      <div className="flex space-x-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:opacity-50 dark:border-navy-600 dark:bg-navy-800 dark:text-gray-300"
        >
          <MdRefresh
            className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
        <button
          onClick={onCreateClick}
          className="flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600"
        >
          <MdAdd className="mr-2 h-4 w-4" />
          Create Clinic
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;
