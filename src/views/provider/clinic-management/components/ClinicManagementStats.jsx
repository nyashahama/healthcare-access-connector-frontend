import React from "react";
import Card from "components/card";

const ClinicManagementStats = ({ stats }) => {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} extra="p-4">
          <p className="text-sm text-gray-600">{stat.label}</p>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {stat.value}
            </p>
            <span
              className={`ml-2 text-sm font-medium ${
                stat.change.includes("+") ? "text-green-600" : "text-red-600"
              }`}
            >
              {stat.change}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ClinicManagementStats;
