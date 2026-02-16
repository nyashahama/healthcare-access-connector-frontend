import React from "react";
import { MdTimer, MdPeople, MdHistory } from "react-icons/md";
import Card from "components/card";

const QueueStats = ({ stats }) => {
  const statCards = [
    {
      label: "Total Waiting",
      value: stats.totalWaiting,
      icon: <MdPeople className="h-6 w-6" />,
      bgColor: "bg-blue-500",
    },
    {
      label: "Average Wait Time",
      value: stats.avgWaitTime,
      icon: <MdTimer className="h-6 w-6" />,
      bgColor: "bg-green-500",
    },
    {
      label: "Completed Today",
      value: stats.completedToday,
      icon: <MdHistory className="h-6 w-6" />,
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {statCards.map((stat, index) => (
        <Card key={index} extra="p-6">
          <div className="flex items-center">
            <div className={`mr-4 rounded-full ${stat.bgColor} p-3 text-white`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                {stat.value}
              </h4>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QueueStats;
