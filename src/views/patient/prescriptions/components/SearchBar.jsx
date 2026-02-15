import React from "react";
import { MdSearch, MdFilterList } from "react-icons/md";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="relative">
          <MdSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search prescriptions by medication, doctor, or RX number..."
            className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-navy-800 dark:text-gray-200">
          <MdFilterList className="h-4 w-4" />
          Filter
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
