import React from "react";

// Get status badge component
export const getStatusBadge = (status) => {
  const statusConfig = {
    success: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      text: "Operational",
    },
    warning: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      text: "Warning",
    },
    error: {
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      text: "Error",
    },
  };

  const config = statusConfig[status] || statusConfig.success;
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
    >
      {config.text}
    </span>
  );
};

// Get severity color
export const getSeverityColor = (severity) => {
  const colors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };
  return colors[severity] || colors.low;
};
