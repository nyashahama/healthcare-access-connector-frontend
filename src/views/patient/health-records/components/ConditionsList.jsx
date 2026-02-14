import React from "react";
import Card from "components/card";

const ConditionsList = ({ conditions }) => {
  return (
    <div className="space-y-4">
      {conditions.map((condition) => (
        <Card key={condition.id} extra="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-bold text-navy-700 dark:text-white">
                {condition.name}
              </h5>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Diagnosed: </span>
                  <span>{condition.diagnosed}</span>
                </div>
                <div>
                  <span className="text-gray-500">Doctor: </span>
                  <span>{condition.doctor}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status: </span>
                  <span
                    className={`font-medium ${
                      condition.status === "Active"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {condition.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Severity: </span>
                  <span>{condition.severity}</span>
                </div>
              </div>
              {condition.notes && (
                <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {condition.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ConditionsList;
