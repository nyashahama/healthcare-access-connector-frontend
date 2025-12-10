import React from "react";
import { FaShieldAlt, FaUserLock, FaFileExport } from "react-icons/fa";
import { MdHistory, MdDelete } from "react-icons/md";
import Card from "components/card";

const PrivacyData = () => {
  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center">
        <FaShieldAlt className="mr-3 text-brand-500" />
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Privacy & Data
        </h4>
      </div>

      {/* POPIA Compliance */}
      <div className="mb-6">
        <div className="mb-4 flex items-center">
          <FaUserLock className="mr-2 text-green-500" />
          <h5 className="font-bold text-navy-700 dark:text-white">
            POPIA Compliance
          </h5>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="popia-consent"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <div className="ml-3">
                <label
                  htmlFor="popia-consent"
                  className="font-medium text-green-800 dark:text-green-300"
                >
                  Health Data Consent
                </label>
                <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                  I consent to the collection and use of my health data as per
                  POPIA regulations
                </p>
                <p className="mt-1 text-xs text-green-500 dark:text-green-500/80">
                  Last updated: 15 March 2024
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="research-consent"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <label
                  htmlFor="research-consent"
                  className="font-medium text-blue-800 dark:text-blue-300"
                >
                  Anonymized Research
                </label>
                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                  Allow anonymized health data to be used for medical research
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="emergency-access"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="ml-3">
                <label
                  htmlFor="emergency-access"
                  className="font-medium text-purple-800 dark:text-purple-300"
                >
                  Emergency Access
                </label>
                <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
                  Allow healthcare providers to access critical information in
                  emergencies
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div>
        <h5 className="mb-4 font-bold text-navy-700 dark:text-white">
          Data Management
        </h5>

        <div className="space-y-3">
          <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700">
            <div className="flex items-center">
              <MdHistory className="mr-3 text-gray-500" />
              <div className="text-left">
                <p className="font-medium text-navy-700 dark:text-white">
                  View Data History
                </p>
                <p className="text-sm text-gray-600">
                  See who accessed your health data and when
                </p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700">
            <div className="flex items-center">
              <FaFileExport className="mr-3 text-gray-500" />
              <div className="text-left">
                <p className="font-medium text-navy-700 dark:text-white">
                  Export My Data
                </p>
                <p className="text-sm text-gray-600">
                  Download all your health records
                </p>
              </div>
            </div>
            <span className="text-gray-400">→</span>
          </button>

          <button className="flex w-full items-center justify-between rounded-lg border border-red-200 p-3 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
            <div className="flex items-center">
              <MdDelete className="mr-3 text-red-500" />
              <div className="text-left">
                <p className="font-medium text-red-700 dark:text-red-300">
                  Delete Account
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Permanently delete all your data
                </p>
              </div>
            </div>
            <span className="text-red-400">→</span>
          </button>
        </div>
      </div>

      {/* Privacy Note */}
      <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-bold">Your privacy is important to us.</span>
          We never share your health data without your explicit consent. All
          data is encrypted and stored securely in compliance with South African
          POPIA regulations.
        </p>
      </div>
    </Card>
  );
};

export default PrivacyData;
