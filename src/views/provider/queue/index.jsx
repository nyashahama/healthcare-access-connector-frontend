import React, { useState, useEffect } from "react";
import {
  MdTimer,
  MdPeople,
  MdHistory,
  MdFilterList,
  MdDownload,
  MdRefresh,
  MdAdd,
} from "react-icons/md";
import Card from "components/card";
import PatientQueue from "../components/PatientQueue";

const Queue = () => {
  const [queueStats, setQueueStats] = useState({
    totalWaiting: 12,
    avgWaitTime: "18 min",
    completedToday: 24,
  });

  const [queueFilters, setQueueFilters] = useState([
    { label: "All", count: 12, active: true },
    { label: "High Priority", count: 3, active: false },
    { label: "Telemedicine", count: 4, active: false },
    { label: "Walk-ins", count: 5, active: false },
    { label: "My Patients", count: 6, active: false },
  ]);

  const handleFilterClick = (index) => {
    const updatedFilters = queueFilters.map((filter, i) => ({
      ...filter,
      active: i === index,
    }));
    setQueueFilters(updatedFilters);
  };

  const refreshQueue = () => {
    // Simulate API call
    setQueueStats({
      totalWaiting: Math.floor(Math.random() * 20) + 1,
      avgWaitTime: `${Math.floor(Math.random() * 30) + 5} min`,
      completedToday: Math.floor(Math.random() * 30) + 10,
    });
  };

  return (
    <div className="h-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Patient Queue
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and monitor patient waiting times
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={refreshQueue}
            className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600"
          >
            <MdRefresh className="mr-2" />
            Refresh
          </button>
          <button className="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
            <MdDownload className="mr-2" />
            Export List
          </button>
          <button className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
            <MdAdd className="mr-2" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Waiting</p>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">
                  {queueStats.totalWaiting}
                </p>
                <span className="ml-2 text-sm font-medium text-green-600">
                  +3
                </span>
              </div>
            </div>
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
              <MdPeople className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Wait Time</p>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">
                  {queueStats.avgWaitTime}
                </p>
                <span className="ml-2 text-sm font-medium text-green-600">
                  -2 min
                </span>
              </div>
            </div>
            <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-300">
              <MdTimer className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card extra="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <div className="mt-1 flex items-baseline">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">
                  {queueStats.completedToday}
                </p>
                <span className="ml-2 text-sm font-medium text-green-600">
                  +5
                </span>
              </div>
            </div>
            <div className="rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300">
              <MdHistory className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Queue Filters */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Filter Queue
          </h4>
          <div className="flex items-center text-sm text-gray-600">
            <MdFilterList className="mr-1" />
            Sort by:
            <select className="bg-transparent ml-2 rounded-lg border border-gray-300 p-1 text-sm dark:border-navy-600">
              <option>Priority</option>
              <option>Wait Time</option>
              <option>Name</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {queueFilters.map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(index)}
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

      {/* Queue Management */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Queue */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                Active Queue
              </h4>
              <select className="rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-navy-600 dark:bg-navy-700">
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <PatientQueue />
          </Card>
        </div>

        {/* Queue Controls */}
        <div>
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Queue Controls
            </h4>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h5 className="mb-2 font-medium text-blue-800 dark:text-blue-300">
                  Queue Settings
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Auto-assign Patients
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Send Wait Time Updates
                    </span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" className="peer sr-only" />
                      <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-brand-500 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-700"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                <h5 className="mb-2 font-medium text-navy-700 dark:text-white">
                  Quick Actions
                </h5>
                <div className="space-y-2">
                  <button className="linear w-full rounded-lg bg-brand-500 py-2.5 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
                    Call Next Patient
                  </button>
                  <button className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
                    Mark All as Seen
                  </button>
                  <button className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
                    Clear Queue
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <h5 className="mb-2 font-medium text-yellow-800 dark:text-yellow-300">
                  Queue Status
                </h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Average Wait Time</span>
                    <span className="font-medium">18 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Longest Wait</span>
                    <span className="font-medium">45 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Staff Available</span>
                    <span className="font-medium text-green-600">3/4</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Queue;
