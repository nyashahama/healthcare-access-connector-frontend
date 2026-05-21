import React from "react";
import {
  MdVerified,
  MdPendingActions,
  MdCancel,
} from "react-icons/md";

type Status = "verified" | "pending" | "rejected" | string;
type OperatingHours = Record<string, string> | string | null | undefined;

export const getStatusBadge = (status: Status): React.ReactElement => {
  switch (status) {
    case "verified":
      return (
        <span className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
          <MdVerified className="mr-1 h-3 w-3" />
          Verified
        </span>
      );
    case "pending":
      return (
        <span className="flex items-center rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
          <MdPendingActions className="mr-1 h-3 w-3" />
          Pending
        </span>
      );
    case "rejected":
      return (
        <span className="flex items-center rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
          <MdCancel className="mr-1 h-3 w-3" />
          Rejected
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

export const formatOperatingHours = (hours: OperatingHours): string => {
  if (!hours) return "Not specified";

  if (typeof hours === "string") {
    return hours;
  }

  if (typeof hours === "object" && hours !== null) {
    const daysOrder = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const formattedDays = daysOrder
      .filter((day) => {
        const dayValue = hours[day];
        return (
          dayValue &&
          typeof dayValue === "string" &&
          dayValue !== "Closed" &&
          dayValue.trim() !== ""
        );
      })
      .map(
        (day) => `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day]}`
      );

    return formattedDays.length > 0
      ? formattedDays.join(", ")
      : "Not specified";
  }

  return "Not specified";
};

export const getTimeAgo = (dateString: string | null | undefined): string => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString();
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
