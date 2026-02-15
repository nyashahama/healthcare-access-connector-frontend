import React from "react";
import { MdWarning, MdInfo } from "react-icons/md";

const InfoCards = () => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="flex items-start gap-3">
          <MdWarning className="mt-0.5 h-6 w-6 text-red-600 dark:text-red-400" />
          <div>
            <h5 className="font-bold text-red-900 dark:text-red-300">
              Medication Safety
            </h5>
            <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-400">
              <li>• Always take medications as prescribed</li>
              <li>• Never share your prescriptions with others</li>
              <li>• Store medications in a cool, dry place</li>
              <li>• Check expiry dates before taking any medication</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <MdInfo className="mt-0.5 h-6 w-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h5 className="font-bold text-blue-900 dark:text-blue-300">
              Prescription Tips
            </h5>
            <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-400">
              <li>• Request refills 3 days before running out</li>
              <li>• Bring empty container for controlled substances</li>
              <li>• Check medical aid coverage before purchasing</li>
              <li>• Keep a digital copy as backup</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;
