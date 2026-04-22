import React from "react";

const GenericErrorFallback = ({ onReset }) => (
  <div className="flex h-screen w-full items-center justify-center bg-lightPrimary p-4 dark:bg-navy-900">
    <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-xl dark:bg-navy-800">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-8 w-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
        Something went wrong
      </h3>
      <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
        We are sorry, but an unexpected error occurred. Your session is still
        active.
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
          Go to Home
        </a>
      </div>
    </div>
  </div>
);

export default GenericErrorFallback;
