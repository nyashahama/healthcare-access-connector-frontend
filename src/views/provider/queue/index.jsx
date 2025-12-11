import React from "react";
import { MdTimer, MdPeople, MdHistory } from "react-icons/md";
import Card from "components/card";
import PatientQueue from "../components/PatientQueue";

const Queue = () => {
  const queueStats = [
    {
      title: "Total Waiting",
      value: "12",
      change: "+3",
      icon: <MdPeople className="h-6 w-6" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Avg. Wait Time",
      value: "18 min",
      change: "-2 min",
      icon: <MdTimer className="h-6 w-6" />,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Completed Today",
      value: "24",
      change: "+5",
      icon: <MdHistory className="h-6 w-6" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
  ];

  const queueFilters = [
    { label: "All", count: 12 },
    { label: "High Priority", count: 3 },
    { label: "Telemedicine", count: 4 },
    { label: "Walk-ins", count: 5 },
  ];

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
          <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-navy-600 dark:bg-navy-700 dark:hover:bg-navy-600">
            Export List
          </button>
          <button className="linear rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
            Add Patient to Queue
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {queueStats.map((stat, index) => (
          <Card key={index} extra="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-bold text-navy-700 dark:text-white">
                    {stat.value}
                  </p>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      stat.change.includes("+")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Queue Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {queueFilters.map((filter, index) => (
            <button
              key={index}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                index === 0
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
