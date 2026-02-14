import React from "react";
import { MdInfo } from "react-icons/md";
import Card from "components/card";

const InfoSection = () => {
  return (
    <div className="mt-8">
      <Card extra="p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
            <MdInfo className="h-6 w-6 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="flex-1">
            <h5 className="mb-3 font-bold text-blue-700 dark:text-blue-300">
              Understanding Your Lab Results
            </h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>
                    <strong>Reference ranges</strong> vary by lab and testing
                    method
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>
                    <strong>Abnormal results</strong> don't always mean disease
                  </span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>
                    <strong>Discuss results</strong> with your healthcare
                    provider
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                  <span>
                    <strong>Track trends</strong> over time for better
                    understanding
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InfoSection;
