import React from "react";
import { MdSearch, MdFilterList, MdAdd } from "react-icons/md";

const Controls = ({
  searchQuery,
  setSearchQuery,
  filterOpen,
  setFilterOpen,
  handleUploadResult,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row">
      <div className="flex-1">
        <div className="relative">
          <MdSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by test name, lab, or doctor..."
            className="w-full rounded-xl border-2 border-gray-300 bg-white py-3 pl-12 pr-4 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:hover:bg-navy-700"
        >
          <MdFilterList className="h-5 w-5" />
          Filter
        </button>
        <button
          onClick={handleUploadResult}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
        >
          <MdAdd className="h-5 w-5" />
          Upload Results
        </button>
      </div>
    </div>
  );
};

export default Controls;
