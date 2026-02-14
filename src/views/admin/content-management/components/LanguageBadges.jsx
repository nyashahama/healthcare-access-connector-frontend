import React from "react";
import { getLanguageName } from "./contentUtils";

const LanguageBadges = ({ languages }) => {
  return (
    <div className="flex flex-wrap gap-1">
      {languages.map((lang) => (
        <span
          key={lang}
          className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
        >
          {getLanguageName(lang)}
        </span>
      ))}
    </div>
  );
};

export default LanguageBadges;
