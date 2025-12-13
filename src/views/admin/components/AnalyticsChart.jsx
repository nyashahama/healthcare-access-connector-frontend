import React from "react";
import LineChart from "components/charts/LineChart";

import BarChart from "components/charts/BarChart";

const AnalyticsChart = () => {
  // Sample data for charts
  const userGrowthData = {
    series: [
      {
        name: "Active Patients",
        data: [120, 210, 180, 340, 420, 380, 510, 620, 580, 720, 680, 850],
      },
      {
        name: "Healthcare Providers",
        data: [20, 35, 42, 58, 70, 65, 82, 95, 110, 125, 140, 160],
      },
    ],
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
      },
      colors: ["#4318FF", "#6AD2FF"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        title: {
          text: "Number of Users",
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  const serviceUsageData = {
    series: [
      {
        name: "Service Usage",
        data: [44, 55, 41, 67, 22, 43, 21],
      },
    ],
    options: {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      colors: ["#4318FF"],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "Clinic Search",
          "Symptom Checker",
          "Telemedicine",
          "Appointments",
          "Nutrition",
          "Prescriptions",
          "Emergency",
        ],
      },
      yaxis: {
        title: {
          text: "Usage Count",
        },
      },
    },
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <h5 className="mb-6 text-lg font-bold text-navy-700 dark:text-white">
        System Analytics
      </h5>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
            User Growth (Last 12 Months)
          </div>
          <div className="h-64">
            <LineChart
              series={userGrowthData.series}
              options={userGrowthData.options}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
            Service Usage Distribution
          </div>
          <div className="h-64">
            <BarChart
              chartData={serviceUsageData.series}
              chartOptions={serviceUsageData.options}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Total Appointments
          </div>
          <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
            12,458
          </div>
          <div className="text-sm text-green-500">+23% from last month</div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Active Telemedicine Chats
          </div>
          <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
            189
          </div>
          <div className="text-sm text-green-500">+15% from last month</div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            SMS Messages Sent
          </div>
          <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
            45,287
          </div>
          <div className="text-sm text-green-500">+32% from last month</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
