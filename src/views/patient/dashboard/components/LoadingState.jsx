import React from "react";

const LoadingState = () => {
  return (
    <div className="mt-6 rounded-[20px] bg-white p-6 shadow-sm dark:bg-navy-800">
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">
          Loading appointments...
        </span>
      </div>
    </div>
  );
};

export default LoadingState;
