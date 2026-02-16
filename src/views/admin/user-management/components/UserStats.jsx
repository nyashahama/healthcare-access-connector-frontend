import React from "react";

const UserStats = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 ${
            stat.color === "blue"
              ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
              : stat.color === "green"
              ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
              : stat.color === "red"
              ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"
              : "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.title}
              </div>
              <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                {stat.count}
              </div>
            </div>
            <div className="rounded-full bg-white p-3 dark:bg-navy-700">
              {stat.icon}
            </div>
          </div>
          <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
            {stat.trend}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;
