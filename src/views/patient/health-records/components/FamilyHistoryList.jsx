import React from "react";
import Card from "components/card";

const FamilyHistoryList = ({ familyHistory }) => {
  return (
    <div className="space-y-4">
      {familyHistory.map((item) => (
        <Card key={item.id} extra="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h5 className="font-bold text-navy-700 dark:text-white">
                {item.relation}
              </h5>
              <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Condition: </span>
                  <span>{item.condition}</span>
                </div>
                <div>
                  <span className="text-gray-500">Age: </span>
                  <span>{item.age}</span>
                </div>
                <div>
                  <span className="text-gray-500">Notes: </span>
                  <span>{item.notes}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FamilyHistoryList;
