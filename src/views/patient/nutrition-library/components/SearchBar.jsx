import React from "react";
import { MdSearch, MdFilterList } from "react-icons/md";

const SearchBar = ({ searchQuery, setSearchQuery, onFilterClick }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row">
      <div className="relative flex-1">
        <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search nutrition guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-navy-800"
        />
      </div>
      <button
        onClick={onFilterClick}
        className="flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 font-medium hover:bg-gray-50 dark:border-gray-600"
      >
        <MdFilterList className="mr-2 h-5 w-5" />
        Filter
      </button>
    </div>
  );
};

export default SearchBar;
