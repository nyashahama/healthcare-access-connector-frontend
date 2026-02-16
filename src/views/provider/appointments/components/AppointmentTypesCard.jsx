import React from "react";
import Card from "components/card";

const AppointmentTypesCard = ({ types }) => {
  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Appointment Types
      </h4>
      <div className="space-y-3">
        {types.map((type, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`mr-3 h-3 w-3 rounded-full ${type.color}`}></div>
              <span className="text-sm text-gray-600">{type.type}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">{type.count}</span>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                <div
                  className={`h-full rounded-full ${type.color}`}
                  style={{
                    width: `${Math.min((type.count / 62) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AppointmentTypesCard;
