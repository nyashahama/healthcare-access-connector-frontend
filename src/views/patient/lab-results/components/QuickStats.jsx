import React from "react";
import { MdScience, MdTrendingUp, MdCalendarToday } from "react-icons/md";
import Card from "components/card";

const QuickStats = ({ labResults }) => {
  const normalCount = labResults.filter((r) => r.status === "normal").length;
  const abnormalCount = labResults.filter(
    (r) => r.status === "abnormal"
  ).length;
  const latestDate =
    labResults.length > 0
      ? new Date(labResults[0].date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : "None";

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
          <MdScience className="h-full w-full text-green-500" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
            <MdScience className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Normal Results
            </div>
            <div className="text-3xl font-bold text-navy-700 dark:text-white">
              {normalCount}
            </div>
          </div>
        </div>
      </Card>

      <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
          <MdTrendingUp className="h-full w-full text-yellow-500" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600">
            <MdTrendingUp className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Abnormal Results
            </div>
            <div className="text-3xl font-bold text-navy-700 dark:text-white">
              {abnormalCount}
            </div>
          </div>
        </div>
      </Card>

      <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
        <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
          <MdCalendarToday className="h-full w-full text-blue-500" />
        </div>
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
            <MdCalendarToday className="h-7 w-7 text-white" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Latest Results
            </div>
            <div className="text-sm font-bold text-navy-700 dark:text-white">
              {latestDate}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuickStats;
