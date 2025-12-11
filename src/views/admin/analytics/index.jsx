import React from "react";
import { MdDownload, MdFilterList, MdOutlineRefresh } from "react-icons/md";

// Import Analytics Components
import AppointmentMetrics from "./components/AppointmentMetrics";
import PatientDemographics from "./components/PatientDemographics";
import ClinicPerformance from "./components/ClinicPerformance";
import AccessibilityInsights from "./components/AccessibilityInsights";
import UsageTrends from "./components/UsageTrends";

const Analytics = () => {
  const handleExportReport = () => {
    console.log("Exporting analytics report...");
    // Implement export functionality
  };

  const handleRefreshData = () => {
    console.log("Refreshing analytics data...");
    // Implement data refresh
  };

  return (
    <div className="h-full">
      {/* Header with Controls */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Healthcare Analytics Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time insights into healthcare access and system performance
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRefreshData}
            className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20"
          >
            <MdOutlineRefresh className="mr-2 h-4 w-4" />
            Refresh Data
          </button>
          <button className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button
            onClick={handleExportReport}
            className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700"
          >
            <MdDownload className="mr-2 h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Time Period Selector */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 dark:bg-navy-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">Period:</span>
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
            <option>Last 7 days</option>
            <option selected>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
            <option>Custom range</option>
          </select>
        </div>
        <div className="text-sm text-gray-500">Last updated: Today, 14:30</div>
      </div>

      {/* Key Performance Indicators Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
          <div className="text-sm opacity-90">Active Patients</div>
          <div className="text-2xl font-bold">12,458</div>
          <div className="mt-2 flex items-center text-sm">
            <span className="flex items-center text-green-300">
              +12.5% from last month
            </span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="rounded-xl bg-gradient-to-r from-green-500 to-green-600 p-4 text-white">
          <div className="text-sm opacity-90">Appointments Completed</div>
          <div className="text-2xl font-bold">8,742</div>
          <div className="mt-2 flex items-center text-sm">
            <span className="flex items-center text-green-300">
              +18.3% from last month
            </span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white">
          <div className="text-sm opacity-90">Avg. Response Time</div>
          <div className="text-2xl font-bold">4.2h</div>
          <div className="mt-2 flex items-center text-sm">
            <span className="flex items-center text-green-300">
              -0.8h from last month
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-4 text-white">
          <div className="text-sm opacity-90">Rural Coverage</div>
          <div className="text-2xl font-bold">68%</div>
          <div className="mt-2 flex items-center text-sm">
            <span className="flex items-center text-green-300">
              +5% from last quarter
            </span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          <UsageTrends />
          <PatientDemographics />
          <AccessibilityInsights />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <AppointmentMetrics />
          <ClinicPerformance />

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl bg-white p-5 dark:bg-navy-800">
              <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                SMS Engagement
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Messages Sent</span>
                  <span className="font-bold">24,589</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Rate</span>
                  <span className="font-bold text-green-500">42%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div className="h-2 w-3/4 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-5 dark:bg-navy-800">
              <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
                System Health
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">API Status</span>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                    Healthy
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Uptime</span>
                  <span className="font-bold">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-bold">1,245</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-800 dark:bg-navy-700 dark:text-blue-200">
        <p>
          📊 <strong>Note:</strong> All data is anonymized and aggregated in
          compliance with POPIA regulations. Real-time data updates every 15
          minutes.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
