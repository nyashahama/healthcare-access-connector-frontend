import React from "react";
import { FaHeartbeat, FaAllergies, FaPills, FaSyringe } from "react-icons/fa";
import Card from "components/card";

const Overview = ({ healthData }) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Health Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaHeartbeat className="mx-auto h-6 w-6 text-red-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Conditions
          </div>
          <div className="text-xl font-bold">
            {healthData.conditions.length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaAllergies className="mx-auto h-6 w-6 text-yellow-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Allergies
          </div>
          <div className="text-xl font-bold">{healthData.allergies.length}</div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaPills className="mx-auto h-6 w-6 text-blue-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Medications
          </div>
          <div className="text-xl font-bold">
            {healthData.medications.length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaSyringe className="mx-auto h-6 w-6 text-green-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Vaccinations
          </div>
          <div className="text-xl font-bold">
            {healthData.vaccinations.length}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Overview;
