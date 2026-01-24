import React, { useState } from "react";

export default function Banner() {
  const [bannerOpen, setBannerOpen] = useState(true);

  if (!bannerOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:bottom-8 md:right-12 md:w-auto">
      <div className="flex justify-between bg-blue-800 p-3 text-sm text-white shadow-lg md:rounded-sm">
        <div className="inline-flex">
          <a
            className="font-medium text-blue-50 hover:underline"
            href="https://healthconnect.org/download"
            target="_blank"
            rel="noreferrer"
          >
            Download App<span className="hidden sm:inline"> for Free</span>
          </a>{" "}
          <span className="px-1.5 italic text-gray-300">or</span>{" "}
          <a
            className="font-medium text-green-400 hover:underline"
            href="https://healthconnect.org/premium"
            target="_blank"
            rel="noreferrer"
          >
            Partner with Us
          </a>
        </div>
        <button
          className="ml-3 border-l border-blue-700 pl-2 text-gray-300 hover:text-white"
          onClick={() => setBannerOpen(false)}
        >
          <span className="sr-only">Close</span>
          <svg className="fill-current h-4 w-4 shrink-0" viewBox="0 0 16 16">
            <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
