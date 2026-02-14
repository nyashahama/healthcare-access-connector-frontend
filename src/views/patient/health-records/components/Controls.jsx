import React from "react";
import { MdSearch, MdFilterList, MdDownload } from "react-icons/md";

const Controls = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search health records..."
            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300">
          <MdFilterList className="mr-2 h-4 w-4" />
          Filter
        </button>
        <button className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
          <MdDownload className="mr-2 h-4 w-4" />
          Export Records
        </button>
      </div>
    </div>
  );
};

export default Controls;
