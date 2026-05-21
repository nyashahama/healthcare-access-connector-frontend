import React from "react";
import { MdVerified, MdPendingActions, MdCheckCircle } from "react-icons/md";
import { FaUserMd, FaUserNurse } from "react-icons/fa";

type StaffRole = "doctor" | "nurse" | "admin" | "receptionist" | string;
type StaffStatus = "active" | "suspended" | "terminated" | string;

export const getRoleIcon = (role: StaffRole): React.ReactElement => {
  switch (role) {
    case "doctor":
      return <FaUserMd className="text-brand-500" />;
    case "nurse":
      return <FaUserNurse className="text-green-500" />;
    default:
      return <MdVerified className="text-purple-500" />;
  }
};

export const getRoleLabel = (role: StaffRole): string => {
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

export const getStatusBadge = (status: StaffStatus): React.ReactElement => {
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

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
