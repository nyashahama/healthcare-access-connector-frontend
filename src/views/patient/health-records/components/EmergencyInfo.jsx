import React from "react";
import { MdWarning } from "react-icons/md";
import Card from "components/card";

const EmergencyInfo = () => {
  return (
    <div className="mt-6">
      <Card extra="p-6">
        <div className="flex items-start">
          <MdWarning className="mr-3 h-5 w-5 text-red-500" />
          <div>
            <h5 className="font-bold text-red-700 dark:text-red-300">
              Emergency Health Information
            </h5>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              This information is critical for emergency responders. Keep your
              medical ID updated on your phone and consider wearing a medical
              alert bracelet if you have severe allergies or conditions.
            </p>
            <button className="linear mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300">
              Update Emergency Info
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmergencyInfo;
