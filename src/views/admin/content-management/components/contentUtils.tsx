import React from "react";
import { MdPublic, MdSchedule, MdWarning } from "react-icons/md";

type ContentStatus = "published" | "draft" | "pending" | string;

export const getStatusBadge = (status: ContentStatus): React.ReactElement => {
  const statusConfig: Record<string, { color: string; icon: React.ReactElement; text: string }> = {
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

export const languageNames: Record<string, string> = {
  en: "English",
  zu: "isiZulu",
  xh: "isiXhosa",
  af: "Afrikaans",
  st: "Sesotho",
};

export const getLanguageName = (code: string): string => {
  return languageNames[code] || code;
};
