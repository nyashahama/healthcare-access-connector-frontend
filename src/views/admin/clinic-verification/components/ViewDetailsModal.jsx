import React from "react";
import Modal from "components/modal/Modal";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdCalendarToday,
} from "react-icons/md";
import { FaClinicMedical } from "react-icons/fa";
import {
  getStatusBadge,
  formatOperatingHours,
  formatDate,
} from "./clinicUtils";

const ViewDetailsModal = ({ isOpen, onClose, clinic }) => {
  if (!clinic) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[80vh] overflow-y-auto p-6">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-brand-100 p-3 dark:bg-brand-900/30">
              <FaClinicMedical className="h-6 w-6 text-brand-500" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                {clinic.clinic_name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {clinic.clinic_type || "Private Clinic"}
              </p>
            </div>
          </div>
          {getStatusBadge(clinic.verification_status)}
        </div>

        <div className="space-y-6">
          {/* Contact Information */}
          <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-900">
            <h4 className="mb-3 font-semibold text-navy-700 dark:text-white">
              Contact Information
            </h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MdLocationOn className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {clinic.city}, {clinic.province}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MdPhone className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {clinic.primary_phone || "Not provided"}
                </span>
              </div>
              <div className="flex items-center text-sm">
                <MdEmail className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-gray-700 dark:text-gray-300">
                  {clinic.email || "Not provided"}
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          {clinic.services && clinic.services.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-navy-700 dark:text-white">
                Services Offered
              </h4>
              <div className="flex flex-wrap gap-2">
                {clinic.services.map((service, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Operating Hours */}
          <div>
            <h4 className="mb-3 font-semibold text-navy-700 dark:text-white">
              Operating Hours
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {formatOperatingHours(clinic.operating_hours)}
            </p>
          </div>

          {/* Timestamps */}
          <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Created</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  {formatDate(clinic.created_at)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Last Updated</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  {formatDate(clinic.updated_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ViewDetailsModal;
