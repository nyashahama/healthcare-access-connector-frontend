import React from "react";
import {
  MdCheckCircle,
  MdError,
  MdWarning,
  MdInfo,
  MdRefresh,
} from "react-icons/md";
import { FaServer, FaDatabase, FaShieldAlt } from "react-icons/fa";

const SystemHealth = () => {
  const services = [
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.9%",
      icon: <FaServer className="h-5 w-5" />,
      responseTime: "45ms",
    },
    {
      name: "Database Cluster",
      status: "operational",
      uptime: "99.8%",
      icon: <FaDatabase className="h-5 w-5" />,
      responseTime: "12ms",
    },
    {
      name: "SMS Gateway",
      status: "warning",
      uptime: "97.5%",
      icon: <MdInfo className="h-5 w-5" />,
      responseTime: "210ms",
    },
    {
      name: "Payment Processing",
      status: "operational",
      uptime: "99.7%",
      icon: <FaShieldAlt className="h-5 w-5" />,
      responseTime: "89ms",
    },
    {
      name: "Analytics Engine",
      status: "degraded",
      uptime: "95.2%",
      icon: <MdRefresh className="h-5 w-5" />,
      responseTime: "350ms",
    },
    {
      name: "File Storage",
      status: "operational",
      uptime: "99.6%",
      icon: <FaDatabase className="h-5 w-5" />,
      responseTime: "67ms",
    },
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

  const getStatusCount = () => {
    const counts = {
      operational: services.filter((s) => s.status === "operational").length,
      warning: services.filter((s) => s.status === "warning").length,
      degraded: services.filter((s) => s.status === "degraded").length,
    };

    const totalUptime =
      services.reduce((acc, service) => {
        const uptime = parseFloat(service.uptime);
        return acc + (isNaN(uptime) ? 0 : uptime);
      }, 0) / services.length;

    return { counts, totalUptime: totalUptime.toFixed(1) };
  };

  const statusData = getStatusCount();

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h5 className="text-lg font-bold text-navy-700 dark:text-white">
            System Health Status
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Real-time monitoring of critical services
          </p>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Last updated: Just now
        </div>
      </div>

      {/* Overall Status */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4 dark:from-blue-900/20 dark:to-blue-800/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-600 dark:text-blue-300">
              Overall System Health
            </div>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {statusData.totalUptime}% Uptime
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {statusData.counts.operational > 0 && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-sm">
                  {statusData.counts.operational} Operational
                </span>
              </div>
            )}
            {statusData.counts.warning > 0 && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="ml-2 text-sm">
                  {statusData.counts.warning} Warning
                </span>
              </div>
            )}
            {statusData.counts.degraded > 0 && (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="ml-2 text-sm">
                  {statusData.counts.degraded} Degraded
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`mr-3 rounded-full p-2 ${
                    service.status === "operational"
                      ? "bg-green-100 dark:bg-green-900"
                      : service.status === "warning"
                      ? "bg-yellow-100 dark:bg-yellow-900"
                      : "bg-red-100 dark:bg-red-900"
                  }`}
                >
                  <div
                    className={`${
                      service.status === "operational"
                        ? "text-green-600 dark:text-green-300"
                        : service.status === "warning"
                        ? "text-yellow-600 dark:text-yellow-300"
                        : "text-red-600 dark:text-red-300"
                    }`}
                  >
                    {service.icon}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-navy-700 dark:text-white">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {service.responseTime} response
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                    service.status
                  )}`}
                >
                  {getStatusIcon(service.status)}
                  <span className="ml-1">{service.status}</span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Uptime: {service.uptime}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-green-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-green-900/20">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-green-100 p-2 dark:bg-green-900">
              <MdCheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statusData.counts.operational}
              </div>
              <div className="text-sm text-green-800 dark:text-green-300">
                Operational
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-yellow-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-yellow-900/20">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <MdWarning className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {statusData.counts.warning}
              </div>
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                Warning
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-red-50 p-4 transition-all duration-300 hover:scale-[1.02] dark:bg-red-900/20">
          <div className="flex items-center">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdError className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {statusData.counts.degraded}
              </div>
              <div className="text-sm text-red-800 dark:text-red-300">
                Degraded
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
