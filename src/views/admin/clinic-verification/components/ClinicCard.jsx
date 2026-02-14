import React from "react";
import {
  MdLocationOn,
  MdVisibility,
  MdEdit,
  MdDelete,
  MdCheckCircle,
} from "react-icons/md";
import { FaClinicMedical } from "react-icons/fa";
import { getStatusBadge } from "./clinicUtils";

const ClinicCard = ({ clinic, onViewDetails, onEdit, onDelete, onApprove }) => {
  return (
    <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-brand-200 hover:shadow-xl dark:border-navy-700 dark:bg-navy-800">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-brand-100 p-3 transition-all duration-300 group-hover:scale-110 dark:bg-brand-900/30">
            <FaClinicMedical className="h-6 w-6 text-brand-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-700 dark:text-white">
              {clinic.clinic_name}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MdLocationOn className="mr-1 h-4 w-4" />
              {clinic.city}, {clinic.province}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="mb-2">
            {getStatusBadge(clinic.verification_status)}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {clinic.contact_number || "No contact"}
          </div>
        </div>
      </div>

      {clinic.services && clinic.services.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.isArray(clinic.services)
            ? clinic.services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 transition-all duration-200 hover:scale-105 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {service}
                </span>
              ))
            : null}
          {Array.isArray(clinic.services) && clinic.services.length > 3 && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
              +{clinic.services.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex justify-end space-x-3 border-t border-gray-100 pt-4 dark:border-gray-700">
        <button
          onClick={() => onViewDetails(clinic)}
          className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
        >
          <MdVisibility className="mr-2 h-4 w-4" />
          View Details
        </button>
        {clinic.verification_status === "pending" && (
          <>
            <button
              onClick={() => onEdit(clinic)}
              className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
            >
              <MdEdit className="mr-2 h-4 w-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(clinic)}
              className="flex items-center rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
            >
              <MdDelete className="mr-2 h-4 w-4" />
              Delete
            </button>
            <button
              onClick={() => onApprove(clinic)}
              className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
            >
              <MdCheckCircle className="mr-2 h-4 w-4" />
              Approve
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClinicCard;
