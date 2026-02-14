import React from "react";
import { MdSearch } from "react-icons/md";

const SearchBar = ({ searchQuery, setSearchQuery, languages }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Search Bar */}
      <div className="lg:col-span-2">
        <div className="rounded-xl bg-white p-4 dark:bg-navy-800">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-navy-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Language Filter */}
      <div className="rounded-xl bg-white p-4 dark:bg-navy-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Language:</span>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
            <option>All Languages</option>
            {languages.map((lang) => (
              <option key={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
