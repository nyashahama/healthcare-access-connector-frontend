import React from "react";
import { MdFilterList } from "react-icons/md";

const QueueFilters = ({ filters, onFilterClick, sortBy, setSortBy }) => {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Filter Queue
        </h4>
        <div className="flex items-center text-sm text-gray-600">
          <MdFilterList className="mr-1" />
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent ml-2 rounded-lg border border-gray-300 p-1 text-sm dark:border-navy-600"
          >
            <option value="priority">Priority</option>
            <option value="waitTime">Wait Time</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter, index) => (
          <button
            key={index}
            onClick={() => onFilterClick(index)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter.active
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
            }`}
          >
            {filter.label}
            <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {filter.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QueueFilters;
