import React from "react";
import { MdCheckCircle, MdError, MdWarning } from "react-icons/md";

const SystemHealth = () => {
  const services = [
    { name: "API Gateway", status: "operational", uptime: "99.9%" },
    { name: "Database", status: "operational", uptime: "99.8%" },
    { name: "SMS Gateway", status: "warning", uptime: "97.5%" },
    { name: "Payment Processing", status: "operational", uptime: "99.7%" },
    { name: "Analytics Engine", status: "degraded", uptime: "95.2%" },
    { name: "File Storage", status: "operational", uptime: "99.6%" },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return <MdCheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <MdWarning className="h-5 w-5 text-yellow-500" />;
      case "degraded":
        return <MdError className="h-5 w-5 text-red-500" />;
      default:
        return <MdError className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "degraded":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          System Health Status
        </h5>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Last updated: Just now
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(service.status)}
                <div className="ml-3">
                  <div className="font-medium text-navy-700 dark:text-white">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    Uptime: {service.uptime}
                  </div>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                  service.status
                )}`}
              >
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            4
          </div>
          <div className="text-sm text-green-800 dark:text-green-300">
            Operational
          </div>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            1
          </div>
          <div className="text-sm text-yellow-800 dark:text-yellow-300">
            Warning
          </div>
        </div>
        <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            1
          </div>
          <div className="text-sm text-red-800 dark:text-red-300">Degraded</div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
