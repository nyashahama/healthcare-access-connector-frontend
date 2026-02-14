import React from "react";
import { MdWarning } from "react-icons/md";

const DisclaimerBanner = () => {
  return (
    <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
      <div className="flex items-start">
        <MdWarning className="mr-3 mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Important:</strong> This information is for educational
            purposes only. Always consult with a healthcare provider or
            nutritionist for personalized dietary advice, especially for
            infants, pregnant women, or individuals with medical conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
