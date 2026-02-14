import React from "react";
import {
  MdScience,
  MdWarning,
  MdInfo,
  MdDownload,
  MdShare,
} from "react-icons/md";
import Card from "components/card";

const LabResultCard = ({
  result,
  onViewDetails,
  onDownload,
  onShare,
  getStatusColor,
  getPriorityColor,
}) => {
  return (
    <Card extra="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-brand-500">
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 opacity-5">
        <MdScience className="h-full w-full text-brand-500" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  result.status === "abnormal"
                    ? "bg-red-100 dark:bg-red-900"
                    : "bg-green-100 dark:bg-green-900"
                }`}
              >
                {result.status === "abnormal" ? (
                  <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
                ) : (
                  <MdScience className="h-6 w-6 text-green-600 dark:text-green-300" />
                )}
              </div>
              <div>
                <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                  {result.testName}
                </h5>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  {result.lab}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {result.priority && (
              <div className="flex items-center gap-1">
                <div
                  className={`h-2 w-2 rounded-full ${getPriorityColor(
                    result.priority
                  )}`}
                />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {result.priority}
                </span>
              </div>
            )}
            <span
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                result.status
              )}`}
            >
              {result.status}
            </span>
          </div>
        </div>

        {/* Date & Doctor Info */}
        <div className="mb-4 rounded-xl bg-gradient-to-r from-brand-50 to-blue-50 p-4 dark:from-brand-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Test Date
                </div>
                <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                  {new Date(result.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                  Ordered By
                </div>
                <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                  {result.doctor}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {result.summary && (
          <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-navy-900">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Summary
            </div>
            <div className="mt-1 text-sm text-navy-700 dark:text-white">
              {result.summary}
            </div>
          </div>
        )}

        {/* Key Results Preview */}
        {result.details && (
          <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {Object.entries(result.details)
              .slice(0, 2)
              .map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                    <MdInfo className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-navy-700 dark:text-white">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Abnormal Result Warning */}
        {result.status === "abnormal" && (
          <div className="mb-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-2">
              <MdWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
              <div>
                <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                  Follow-up Recommended
                </div>
                <div className="mt-1 text-sm text-yellow-900 dark:text-yellow-200">
                  {result.details?.recommendation ||
                    "Please consult with your healthcare provider"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewDetails(result)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
          >
            <MdInfo className="h-4 w-4" />
            View Details
          </button>
          <button
            onClick={() => onDownload(result)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
          >
            <MdDownload className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={() => onShare(result)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
          >
            <MdShare className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </Card>
  );
};

export default LabResultCard;
