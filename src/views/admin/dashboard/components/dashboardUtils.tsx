import React from "react";

type StatusBadgeStatus = "success" | "warning" | "error" | string;

export const getStatusBadge = (status: StatusBadgeStatus): React.ReactElement => {
  const statusConfig: Record<string, { color: string; text: string }> = {
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

export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };
  return colors[severity] || colors.low;
};
