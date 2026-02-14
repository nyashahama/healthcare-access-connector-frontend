import React from "react";
import Card from "components/card";

const SurgeriesList = ({ surgeries }) => {
  return (
    <div className="space-y-4">
      {surgeries.map((surgery) => (
        <Card key={surgery.id} extra="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-bold text-navy-700 dark:text-white">
                {surgery.procedure}
              </h5>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Date: </span>
                  <span>{surgery.date}</span>
                </div>
                <div>
                  <span className="text-gray-500">Hospital: </span>
                  <span>{surgery.hospital}</span>
                </div>
                <div>
                  <span className="text-gray-500">Doctor: </span>
                  <span>{surgery.doctor}</span>
                </div>
                <div>
                  <span className="text-gray-500">Reason: </span>
                  <span>{surgery.reason}</span>
                </div>
                <div>
                  <span className="text-gray-500">Outcome: </span>
                  <span className="text-green-600">{surgery.outcome}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SurgeriesList;
