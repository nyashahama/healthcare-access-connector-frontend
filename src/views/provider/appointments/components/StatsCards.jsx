import React from "react";
import { MdCalendarToday, MdCancel, MdWarning } from "react-icons/md";
import Card from "components/card";

const StatsCards = ({ stats }) => {
  const statsConfig = [
    {
      title: "Today's Appointments",
      value: stats.today,
      icon: <MdCalendarToday className="h-7 w-7" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: <MdCalendarToday className="h-7 w-7" />,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Cancellations",
      value: stats.cancellations,
      icon: <MdCancel className="h-7 w-7" />,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "No Shows",
      value: stats.noShows,
      icon: <MdWarning className="h-7 w-7" />,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => (
        <Card key={index} extra="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <h4 className="mt-2 text-3xl font-bold text-navy-700 dark:text-white">
                {stat.value}
              </h4>
            </div>
            <div className={`rounded-full ${stat.bgColor} p-3`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
