import React from "react";
import { MdSecurity, MdAnalytics } from "react-icons/md";
import { FaServer } from "react-icons/fa";

const SystemStatusFooter = () => {
  const statusItems = [
    {
      icon: (
        <MdSecurity className="h-5 w-5 text-green-600 dark:text-green-300" />
      ),
      title: "Security Status",
      value: "All systems secure",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconBg: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-300",
      valueColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: <FaServer className="h-5 w-5 text-blue-600 dark:text-blue-300" />,
      title: "Uptime",
      value: "99.8% (Last 30 days)",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-800 dark:text-blue-300",
      valueColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: (
        <MdAnalytics className="h-5 w-5 text-purple-600 dark:text-purple-300" />
      ),
      title: "Response Time",
      value: "142ms average",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-800 dark:text-purple-300",
      valueColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {statusItems.map((item, index) => (
          <div
            key={index}
            className={`rounded-lg p-4 transition-all duration-300 hover:scale-[1.02] ${item.bgColor}`}
          >
            <div className="flex items-center">
              <div className={`mr-3 rounded-full p-2 ${item.iconBg}`}>
                {item.icon}
              </div>
              <div>
                <div className={`font-medium ${item.textColor}`}>
                  {item.title}
                </div>
                <div className={`text-sm ${item.valueColor}`}>{item.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Last Updated Footer */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {new Date().toLocaleString()} • System Version: 2.4.1
      </div>
    </>
  );
};

export default SystemStatusFooter;
