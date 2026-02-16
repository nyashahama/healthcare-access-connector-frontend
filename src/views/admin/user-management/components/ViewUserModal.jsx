import React from "react";
import Modal from "components/modal/Modal";
import {
  MdPerson,
  MdLocalHospital,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdCalendarToday,
  MdWarning,
} from "react-icons/md";
import { FaNotesMedical, FaStethoscope } from "react-icons/fa";

const ViewUserModal = ({ isOpen, onClose, selectedUser, getStatusBadge }) => {
  if (!selectedUser) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
      <div className="space-y-6">
        {/* User Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              {selectedUser.type === "patients" ? (
                <MdPerson className="h-8 w-8" />
              ) : (
                <MdLocalHospital className="h-8 w-8" />
              )}
            </div>
            <div>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                {selectedUser.name}
              </h4>
              <div className="mt-1 flex items-center gap-2">
                {getStatusBadge(selectedUser.status)}
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedUser.type === "patients"
                    ? `Patient • ${selectedUser.age} years • ${selectedUser.gender}`
                    : `${selectedUser.specialty} • ${selectedUser.verification}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Contact Information
              </h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MdPhone className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedUser.phone}
                  </span>
                </div>
                <div className="flex items-center">
                  <MdEmail className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedUser.email}
                  </span>
                </div>
                <div className="flex items-center">
                  <MdLocationOn className="mr-3 h-4 w-4 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {selectedUser.location}
                  </span>
                </div>
              </div>
            </div>

            {selectedUser.type === "patients" && (
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-500">
                  Medical Information
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaNotesMedical className="mr-3 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Blood Type:{" "}
                        <span className="font-medium">
                          {selectedUser.bloodType || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MdWarning className="mr-3 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Allergies:{" "}
                        <span className="font-medium">
                          {selectedUser.allergies?.join(", ") || "None"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Account Information
              </h5>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MdCalendarToday className="mr-3 h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedUser.type === "patients"
                        ? "Last Visit"
                        : "Last Active"}
                    </div>
                    <div className="font-medium">{selectedUser.lastVisit}</div>
                  </div>
                </div>
                {selectedUser.registeredDate && (
                  <div className="flex items-center">
                    <MdCalendarToday className="mr-3 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Registered
                      </div>
                      <div className="font-medium">
                        {selectedUser.registeredDate}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedUser.type === "providers" && (
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-500">
                  Professional Details
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaStethoscope className="mr-3 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Registration No.
                      </div>
                      <div className="font-medium">
                        {selectedUser.registrationNo}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MdCalendarToday className="mr-3 h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        Experience
                      </div>
                      <div className="font-medium">
                        {selectedUser.experience}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Health Issues/Tags */}
        {selectedUser.healthIssues && selectedUser.healthIssues.length > 0 && (
          <div>
            <h5 className="mb-2 text-sm font-medium text-gray-500">
              Health Conditions
            </h5>
            <div className="flex flex-wrap gap-2">
              {selectedUser.healthIssues.map((issue, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {issue}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ViewUserModal;
