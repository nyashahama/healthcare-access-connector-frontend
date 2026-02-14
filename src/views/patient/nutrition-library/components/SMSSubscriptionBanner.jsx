import React from "react";
import { FaAppleAlt } from "react-icons/fa";

const SMSSubscriptionBanner = ({ onSubscribe }) => {
  return (
    <div className="mt-6 rounded-lg bg-green-50 p-6 dark:bg-green-900/20">
      <div className="flex flex-col items-center text-center md:flex-row md:text-left">
        <div className="mb-4 md:mb-0 md:mr-6">
          <FaAppleAlt className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-bold text-green-800 dark:text-green-300">
            Get Daily Nutrition Tips via SMS
          </h4>
          <p className="mt-2 text-green-600 dark:text-green-400">
            Text "NUTRITION" to 12345 to receive daily nutrition tips for your
            child's age group. Free service, standard SMS rates apply.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              placeholder="Enter your child's age"
              className="rounded-lg border border-green-300 bg-white px-4 py-2 dark:border-green-700 dark:bg-navy-800"
            />
            <button
              onClick={onSubscribe}
              className="linear rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700"
            >
              Subscribe to SMS Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSSubscriptionBanner;
