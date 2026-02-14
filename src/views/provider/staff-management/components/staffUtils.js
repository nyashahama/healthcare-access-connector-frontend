import React from "react";
import { MdVerified, MdPendingActions, MdCheckCircle } from "react-icons/md";
import { FaUserMd, FaUserNurse } from "react-icons/fa";

// Get role icon
export const getRoleIcon = (role) => {
  switch (role) {
    case "doctor":
      return <FaUserMd className="text-brand-500" />;
    case "nurse":
      return <FaUserNurse className="text-green-500" />;
    default:
      return <MdVerified className="text-purple-500" />;
  }
};

// Get role label
export const getRoleLabel = (role) => {
  switch (role) {
    case "doctor":
      return "Doctor";
    case "nurse":
      return "Nurse";
    case "admin":
      return "Admin";
    case "receptionist":
      return "Receptionist";
    default:
      return role;
  }
};

// Get status badge
export const getStatusBadge = (status) => {
  switch (status) {
    case "active":
      return (
        <span className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
          <MdCheckCircle className="mr-1" />
          Active
        </span>
      );
    case "suspended":
      return (
        <span className="flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <MdPendingActions className="mr-1" />
          Suspended
        </span>
      );
    case "terminated":
      return (
        <span className="flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
          Terminated
        </span>
      );
    default:
      return (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900 dark:text-gray-300">
          {status}
        </span>
      );
  }
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
