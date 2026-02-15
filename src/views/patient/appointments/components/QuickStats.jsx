import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { MdHistory, MdCheckCircle } from "react-icons/md";
import Card from "components/card";

const QuickStats = ({ categorizedAppointments }) => {
  const stats = [
    {
      title: "Upcoming",
      value: categorizedAppointments.upcoming.length,
      icon: <FaCalendarAlt className="h-7 w-7 text-white" />,
      bgGradient: "from-green-400 to-green-600",
      bgPattern: "text-green-500",
    },
    {
      title: "Past Visits",
      value: categorizedAppointments.past.length,
      icon: <MdHistory className="h-7 w-7 text-white" />,
      bgGradient: "from-blue-400 to-blue-600",
      bgPattern: "text-blue-500",
    },
    {
      title: "Next Visit",
      value: categorizedAppointments.upcoming[0]
        ? `${new Date(
            categorizedAppointments.upcoming[0].appointment_datetime
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} at ${new Date(
            categorizedAppointments.upcoming[0].appointment_datetime
          ).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "None scheduled",
      icon: <MdCheckCircle className="h-7 w-7 text-white" />,
      bgGradient: "from-brand-400 to-brand-600",
      bgPattern: "text-brand-500",
      isText: true,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon =
          index === 0 ? FaCalendarAlt : index === 1 ? MdHistory : MdCheckCircle;

        return (
          <Card
            key={stat.title}
            extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all"
          >
            <div
              className={`absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10`}
            >
              <Icon className={`h-full w-full ${stat.bgPattern}`} />
            </div>
            <div className="relative flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.bgGradient}`}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {stat.title}
                </div>
                <div
                  className={`${
                    stat.isText ? "text-sm" : "text-3xl"
                  } font-bold text-navy-700 dark:text-white`}
                >
                  {stat.value}
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
