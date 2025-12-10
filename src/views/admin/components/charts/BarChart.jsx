import React from "react";

const BarChart = ({ chartData, chartOptions }) => {
  return (
    <div className="h-full w-full p-4">
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-navy-700">
        <div className="text-center">
          <div className="text-lg font-bold text-navy-700 dark:text-white">
            Service Usage Chart
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Chart visualization would appear here
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Bar Chart: {chartOptions?.xaxis?.categories?.length || 0} categories
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
