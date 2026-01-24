import React from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="inline-flex" aria-label="HealthConnect">
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28">
        <path
          className="fill-blue-600"
          fillRule="evenodd"
          d="M14 0c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14S21.732 0 14 0zm0 26c-6.627 0-12-5.373-12-12S7.373 2 14 2s12 5.373 12 12-5.373 12-12 12zm-1-18h2v4h4v2h-4v4h-2v-4H9v-2h4V8z"
          clipRule="evenodd"
        />
      </svg>
    </Link>
  );
}
