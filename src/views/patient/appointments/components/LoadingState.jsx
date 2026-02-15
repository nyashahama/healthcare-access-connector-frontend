import React from "react";

const LoadingState = () => {
  return (
    <div className="mb-6 py-12 text-center">
      <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-brand-500"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-300">
        Loading appointments...
      </p>
    </div>
  );
};

export default LoadingState;
