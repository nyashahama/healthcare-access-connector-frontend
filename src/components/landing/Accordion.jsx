import React, { useState } from "react";

export default function Accordion({ children, title, id, active = false }) {
  const [accordionOpen, setAccordionOpen] = useState(active);

  return (
    <div className="relative mb-4 rounded-xl bg-white shadow-lg">
      <h2>
        <button
          className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-gray-900"
          onClick={(e) => {
            e.preventDefault();
            setAccordionOpen((prevState) => !prevState);
          }}
          aria-expanded={accordionOpen}
          aria-controls={`accordion-text-${id}`}
        >
          <span>{title}</span>
          <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50">
            <svg
              className={`transform fill-gray-600 transition duration-200 ease-out ${
                accordionOpen ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              width={12}
              height={8}
              fill="none"
              viewBox="0 0 12 8"
            >
              <path
                d="M10.59.59 6 5.17 1.41.59 0 2l6 6 6-6L10.59.59Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </button>
      </h2>
      <div
        id={`accordion-text-${id}`}
        role="region"
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          accordionOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 text-gray-600">{children}</div>
      </div>
    </div>
  );
}
