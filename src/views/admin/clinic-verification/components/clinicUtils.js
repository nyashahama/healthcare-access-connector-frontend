import React from "react";
import {
  MdVerified,
  MdPendingActions,
  MdCancel,
  MdCheckCircle,
} from "react-icons/md";

// Get status badge component
export const getStatusBadge = (status) => {
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

// Format operating hours
export const formatOperatingHours = (hours) => {
  if (!hours) return "Not specified";

  // If it's already a string, return it
  if (typeof hours === "string") {
    return hours;
  }

  // If it's an object (from API), format it nicely
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
        // Check if the value exists, is a string, and is not "Closed"
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

// Get time ago string
export const getTimeAgo = (dateString) => {
  if (!dateString) return "Unknown";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
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

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
