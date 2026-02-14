import React from "react";
import Card from "components/card";

const AllergiesList = ({ allergies }) => {
  return (
    <div className="space-y-4">
      {allergies.map((allergy) => (
        <Card key={allergy.id} extra="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-bold text-navy-700 dark:text-white">
                {allergy.allergen}
              </h5>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Reaction: </span>
                  <span>{allergy.reaction}</span>
                </div>
                <div>
                  <span className="text-gray-500">Severity: </span>
                  <span
                    className={`font-medium ${
                      allergy.severity === "Severe"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {allergy.severity}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Diagnosed: </span>
                  <span>{allergy.diagnosed}</span>
                </div>
                <div>
                  <span className="text-gray-500">Doctor: </span>
                  <span>{allergy.doctor}</span>
                </div>
              </div>
            </div>
            <div className="ml-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  allergy.severity === "Severe"
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                }`}
              >
                {allergy.severity}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AllergiesList;
