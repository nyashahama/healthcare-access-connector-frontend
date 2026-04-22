import React from "react";

const MinimalErrorFallback = ({ onReset }) => (
  <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
    <p className="mb-2 text-sm text-red-700 dark:text-red-300">
      Unable to load this section.
    </p>
    <button
      onClick={onReset}
      className="text-sm font-medium text-brand-500 hover:text-brand-600"
    >
      Retry
    </button>
  </div>
);

export default MinimalErrorFallback;
