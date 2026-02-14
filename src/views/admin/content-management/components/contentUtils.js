import React from "react";
import { MdPublic, MdSchedule, MdWarning } from "react-icons/md";

// Get status badge component
export const getStatusBadge = (status) => {
  const statusConfig = {
    published: {
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      icon: <MdPublic className="h-3 w-3" />,
      text: "Published",
    },
    draft: {
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      icon: <MdSchedule className="h-3 w-3" />,
      text: "Draft",
    },
    pending: {
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      icon: <MdWarning className="h-3 w-3" />,
      text: "Pending Review",
    },
  };

  const config = statusConfig[status] || statusConfig.draft;
  return (
    <span
      className={`flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
    >
      {config.icon}
      <span className="ml-1">{config.text}</span>
    </span>
  );
};

// Language name mapping
export const languageNames = {
  en: "English",
  zu: "isiZulu",
  xh: "isiXhosa",
  af: "Afrikaans",
  st: "Sesotho",
};

// Get language name
export const getLanguageName = (code) => {
  return languageNames[code] || code;
};
