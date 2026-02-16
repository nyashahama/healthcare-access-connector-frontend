import React from "react";
import {
  MdAdd,
  MdFilterList,
  MdSearch,
  MdDownload,
  MdRefresh,
} from "react-icons/md";

const ControlsBar = ({
  searchTerm,
  onSearchChange,
  onAddClick,
  onFilterClick,
  onDownloadClick,
  onRefreshClick,
}) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1">
        <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search appointments..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 dark:border-navy-600 dark:bg-navy-800"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-800"
        >
          <MdFilterList className="h-5 w-5" />
          <span className="hidden sm:inline">Filter</span>
        </button>
        <button
          onClick={onDownloadClick}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-800"
        >
          <MdDownload className="h-5 w-5" />
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          onClick={onRefreshClick}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-800"
        >
          <MdRefresh className="h-5 w-5" />
        </button>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
        >
          <MdAdd className="h-5 w-5" />
          New
        </button>
      </div>
    </div>
  );
};

export default ControlsBar;
