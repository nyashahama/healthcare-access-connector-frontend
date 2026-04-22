import React from "react";

const CriticalFeatureFallback = ({ feature = "this feature", onReset }) => (
  <div className="flex h-full w-full items-center justify-center bg-lightPrimary p-4 dark:bg-navy-900">
    <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-xl dark:bg-navy-800">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
        <svg
          className="h-8 w-8 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
        {feature} is temporarily unavailable
      </h3>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        Something went wrong loading {feature}. Your session is safe. Please
        try again or navigate elsewhere.
      </p>
      <div className="space-y-3">
        <button
          onClick={onReset}
          className="w-full rounded-lg bg-brand-500 px-4 py-3 font-medium text-white hover:bg-brand-600"
        >
          Try Again
        </button>
        <a
          href="/"
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-navy-700 hover:bg-gray-50 dark:border-navy-600 dark:text-white dark:hover:bg-navy-700"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  </div>
);

export default CriticalFeatureFallback;
