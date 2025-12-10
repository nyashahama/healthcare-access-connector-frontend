import React from "react";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

const ClinicStats = () => {
  const stats = [
    {
      title: "Today's Patients",
      value: "24",
      change: "+12%",
      trend: "up",
      description: "vs yesterday",
    },
    {
      title: "Appointment Rate",
      value: "92%",
      change: "+5%",
      trend: "up",
      description: "filled slots",
    },
    {
      title: "Avg. Wait Time",
      value: "15 min",
      change: "-3%",
      trend: "down",
      description: "vs last week",
    },
    {
      title: "Patient Satisfaction",
      value: "4.8/5",
      change: "+0.2",
      trend: "up",
      description: "average rating",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <h5 className="mb-6 text-lg font-bold text-navy-700 dark:text-white">
        Clinic Performance
      </h5>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {stat.title}
            </div>
            <div className="mt-2 flex items-baseline">
              <div className="text-2xl font-bold text-navy-700 dark:text-white">
                {stat.value}
              </div>
              <div
                className={`ml-2 flex items-center text-sm font-medium ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {stat.trend === "up" ? (
                  <MdTrendingUp className="mr-1" />
                ) : (
                  <MdTrendingDown className="mr-1" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicStats;
