import React from "react";
import {
  MdVisibility,
  MdRefresh,
  MdShare,
  MdDownload,
  MdMedicalServices,
  MdLocalPharmacy,
  MdAccessTime,
} from "react-icons/md";
import { FaPrescription } from "react-icons/fa";

const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "expired":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const PrescriptionCard = ({
  prescription,
  onViewDetails,
  onRequestRefill,
  onShare,
  onDownload,
}) => {
  return (
    <div
      key={prescription.id}
      className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-brand-500 hover:shadow-lg dark:border-navy-700 dark:hover:border-brand-500"
    >
      {/* Gradient accent on hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

      {/* Background pattern */}
      <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-5">
        <FaPrescription className="h-full w-full text-brand-500" />
      </div>

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
                <FaPrescription className="h-6 w-6 text-white" />
              </div>
              <div>
                <h6 className="text-lg font-bold text-navy-700 dark:text-white">
                  {prescription.medication}
                </h6>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {prescription.dosage}
                  </span>
                  {prescription.rxNumber && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-navy-700 dark:text-gray-300">
                      {prescription.rxNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(
              prescription.status
            )}`}
          >
            {prescription.status}
          </span>
        </div>

        {/* Details Grid */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
              <MdMedicalServices className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Doctor
              </div>
              <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                {prescription.doctor}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
              <MdLocalPharmacy className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Pharmacy
              </div>
              <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                {prescription.pharmacy}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
              <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {prescription.expiry ? "Expires" : "Estimated Ready"}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                {prescription.expiry
                  ? new Date(prescription.expiry).toLocaleDateString()
                  : prescription.estimatedReady}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onViewDetails(prescription)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
          >
            <MdVisibility className="h-4 w-4" />
            Details
          </button>

          {prescription.status === "active" && prescription.refills > 0 && (
            <button
              onClick={() => onRequestRefill(prescription)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <MdRefresh className="h-4 w-4" />
              Refill ({prescription.refills} left)
            </button>
          )}

          <button
            onClick={() => onShare(prescription)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
          >
            <MdShare className="h-4 w-4" />
            Share
          </button>

          <button
            onClick={() => onDownload(prescription)}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
          >
            <MdDownload className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
