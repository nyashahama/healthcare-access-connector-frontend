import React, { useState } from "react";
import {
  FaChartLine,
  FaUserCheck,
  FaClock,
  FaStar,
  FaCalendarCheck,
  FaDownload,
  FaEye,
} from "react-icons/fa";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdWarning,
  MdInfo,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const PerformanceMetrics = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const { showToast } = useToast();

  const metrics = [
    {
      id: 1,
      title: "Patient Satisfaction",
      value: "4.8",
      change: "+2.4%",
      trend: "up",
      icon: <FaStar />,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      description: "Based on patient feedback surveys",
      target: "4.5",
      details: "1247 responses collected this month",
    },
    {
      id: 2,
      title: "Appointment Rate",
      value: "94%",
      change: "+5.2%",
      trend: "up",
      icon: <FaCalendarCheck />,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      description: "Completed vs scheduled appointments",
      target: "90%",
      details: "1180 appointments completed out of 1255 scheduled",
    },
    {
      id: 3,
      title: "Avg. Wait Time",
      value: "15 min",
      change: "-3.1%",
      trend: "down",
      icon: <FaClock />,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      description: "Average patient waiting time",
      target: "20 min",
      details: "Improved from 15.5 minutes last month",
    },
    {
      id: 4,
      title: "No-Show Rate",
      value: "8%",
      change: "-1.2%",
      trend: "down",
      icon: <FaUserCheck />,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      description: "Missed appointments without notice",
      target: "10%",
      details: "100 no-shows out of 1255 appointments",
    },
  ];

  const weeklyStats = [
    { day: "Mon", appointments: 18, completed: 16 },
    { day: "Tue", appointments: 22, completed: 20 },
    { day: "Wed", appointments: 20, completed: 19 },
    { day: "Thu", appointments: 24, completed: 22 },
    { day: "Fri", appointments: 16, completed: 15 },
    { day: "Sat", appointments: 10, completed: 9 },
  ];

  const serviceMetrics = [
    { service: "Immunizations", patients: 45, revenue: "R12,500" },
    { service: "Chronic Care", patients: 38, revenue: "R18,200" },
    { service: "Child Health", patients: 32, revenue: "R9,600" },
    { service: "HIV Testing", patients: 28, revenue: "R8,400" },
  ];

  const handleViewMetric = (metric) => {
    setSelectedMetric(metric);
    setDetailModalOpen(true);
  };

  const handleDownloadReport = () => {
    console.log(`Downloading report in ${downloadFormat} format`);
    setDownloadModalOpen(false);
    showToast("Report download started!", "success");
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* Download Report Modal */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Download Performance Report"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Format *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDownloadFormat("pdf")}
                className={`rounded-lg p-3 ${
                  downloadFormat === "pdf"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                }`}
              >
                PDF
              </button>
              <button
                onClick={() => setDownloadFormat("excel")}
                className={`rounded-lg p-3 ${
                  downloadFormat === "excel"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    : "bg-gray-100 text-gray-700 dark:bg-navy-700 dark:text-gray-300"
                }`}
              >
                Excel
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Period
            </label>
            <select className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700">
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Report will include all performance metrics, service data, and
                patient statistics.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDownloadModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <FaDownload className="h-5 w-5" />
              Download Report
            </button>
          </div>
        </div>
      </Modal>

      {/* Metric Details Modal */}
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title={selectedMetric?.title || "Metric Details"}
        size="lg"
      >
        {selectedMetric && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg ${selectedMetric.bgColor} p-4`}>
                <div className="flex items-center">
                  <div className={`text-3xl ${selectedMetric.color}`}>
                    {selectedMetric.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-4xl font-bold text-navy-700 dark:text-white">
                      {selectedMetric.value}
                    </p>
                    <div className="flex items-center">
                      {selectedMetric.trend === "up" ? (
                        <MdTrendingUp className="mr-1 text-green-500" />
                      ) : (
                        <MdTrendingDown className="mr-1 text-red-500" />
                      )}
                      <span
                        className={`font-medium ${
                          selectedMetric.trend === "up"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {selectedMetric.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Description
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedMetric.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                <p className="text-sm text-gray-600">Target</p>
                <p className="text-xl font-bold text-navy-700 dark:text-white">
                  {selectedMetric.target}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                <p className="text-sm text-green-600">Status</p>
                <p className="text-xl font-bold text-green-700 dark:text-green-300">
                  {selectedMetric.trend === "up" ? "Exceeding" : "Below"} Target
                </p>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-500">
                Details
              </h5>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedMetric.details}
              </p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaChartLine className="mr-3 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Performance Metrics
          </h4>
        </div>
        <select className="rounded-lg border border-gray-300 bg-white p-2 text-sm dark:border-navy-600 dark:bg-navy-700">
          <option>This Week</option>
          <option>This Month</option>
          <option>Last 3 Months</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className={`rounded-xl ${metric.bgColor} cursor-pointer p-4 transition-all duration-300 hover:scale-[1.05]`}
            onClick={() => handleViewMetric(metric)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{metric.title}</p>
                <div className="mt-1 flex items-baseline">
                  <p className="text-2xl font-bold text-navy-700 dark:text-white">
                    {metric.value}
                  </p>
                  <div
                    className={`ml-2 flex items-center text-sm ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <MdTrendingUp className="mr-1" />
                    ) : (
                      <MdTrendingDown className="mr-1" />
                    )}
                    {metric.change}
                  </div>
                </div>
              </div>
              <div className={`text-2xl ${metric.color}`}>{metric.icon}</div>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500">
              <FaEye className="mr-1 h-3 w-3" />
              Click for details
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Performance */}
      <div className="mb-6">
        <h5 className="mb-3 font-bold text-navy-700 dark:text-white">
          Weekly Performance
        </h5>
        <div className="space-y-3">
          {weeklyStats.map((day) => {
            const completionRate = Math.round(
              (day.completed / day.appointments) * 100
            );

            return (
              <div key={day.day} className="flex items-center">
                <div className="w-12 text-sm font-medium text-gray-600">
                  {day.day}
                </div>
                <div className="ml-2 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {day.appointments} appointments
                    </span>
                    <span className="font-medium text-green-600">
                      {completionRate}% completed
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200 dark:bg-navy-600">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Performance */}
      <div className="mb-6">
        <h5 className="mb-3 font-bold text-navy-700 dark:text-white">
          Service Performance
        </h5>
        <div className="space-y-3">
          {serviceMetrics.map((service) => (
            <div
              key={service.service}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-3 transition-all duration-300 hover:scale-[1.02] dark:border-navy-600"
            >
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  {service.service}
                </p>
                <p className="text-sm text-gray-600">
                  {service.patients} patients
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600 dark:text-green-400">
                  {service.revenue}
                </p>
                <p className="text-sm text-gray-600">Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-brand-50 p-4 dark:bg-brand-900/20">
          <p className="text-sm text-brand-600 dark:text-brand-400">
            Total Patients
          </p>
          <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
            1,247
          </p>
          <p className="text-xs text-brand-600/80 dark:text-brand-400/80">
            +12% from last month
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Avg. Revenue/Day
          </p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            R8,450
          </p>
          <p className="text-xs text-purple-600/80 dark:text-purple-400/80">
            +8.5% from last month
          </p>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={() => setDownloadModalOpen(true)}
        className="linear mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:scale-105 hover:bg-brand-600"
      >
        <FaDownload className="h-5 w-5" />
        Download Full Report
      </button>
    </Card>
  );
};

export default PerformanceMetrics;
