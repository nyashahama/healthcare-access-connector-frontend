import React from "react";
import LineChart from "components/charts/LineChart";
import BarChart from "components/charts/BarChart";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";

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
      {
        name: "Clinic Partners",
        data: [5, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42],
      },
    ],
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      colors: ["#4318FF", "#6AD2FF", "#00B69B"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        width: 3,
      },
      grid: {
        borderColor: "#f1f1f1",
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
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Number of Users",
          style: {
            color: "#6B7280",
            fontSize: "12px",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        fontSize: "12px",
        markers: {
          radius: 12,
        },
      },
      tooltip: {
        theme: "dark",
        x: {
          show: true,
        },
        y: {
          formatter: function (val) {
            return val.toLocaleString() + " users";
          },
        },
      },
    },
  };

  const serviceUsageData = {
    series: [
      {
        name: "Service Usage",
        data: [44, 55, 41, 67, 22, 43, 21, 35, 28, 39, 52, 48],
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
          borderRadius: 6,
          horizontal: false,
          columnWidth: "55%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        borderColor: "#f1f1f1",
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
          "Lab Results",
          "Health Records",
          "Medication Reminders",
          "Health Tips",
          "Community Forum",
        ],
        labels: {
          rotate: -45,
          rotateAlways: true,
          style: {
            colors: "#6B7280",
            fontSize: "10px",
          },
        },
      },
      yaxis: {
        title: {
          text: "Usage Count (thousands)",
          style: {
            color: "#6B7280",
            fontSize: "12px",
          },
        },
        labels: {
          style: {
            colors: "#6B7280",
            fontSize: "12px",
          },
          formatter: function (val) {
            return (val / 1000).toFixed(0) + "k";
          },
        },
      },
      tooltip: {
        theme: "dark",
        y: {
          formatter: function (val) {
            return val.toLocaleString() + " uses";
          },
        },
      },
    },
  };

  const metrics = [
    {
      title: "Avg. Session Duration",
      value: "12m 34s",
      change: "+8%",
      trending: "up",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Bounce Rate",
      value: "24.5%",
      change: "-12%",
      trending: "down",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
    },
    {
      title: "New Users",
      value: "1,245",
      change: "+23%",
      trending: "up",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Active Sessions",
      value: "4,589",
      change: "+15%",
      trending: "up",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h5 className="text-lg font-bold text-navy-700 dark:text-white">
            System Analytics
          </h5>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Performance metrics and usage patterns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm dark:border-gray-600 dark:bg-navy-700">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>Today</option>
          </select>
          <button className="rounded-lg bg-brand-50 px-4 py-2 text-sm font-medium text-brand-500 transition-all duration-200 hover:scale-105 hover:bg-brand-100 dark:bg-brand-500/20 dark:text-white">
            Export Report
          </button>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] ${metric.bgColor}`}
          >
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {metric.title}
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-2xl font-bold text-navy-700 dark:text-white">
                {metric.value}
              </div>
              <div className={`flex items-center ${metric.color}`}>
                {metric.trending === "up" ? (
                  <MdTrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <MdTrendingDown className="mr-1 h-4 w-4" />
                )}
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                User Growth (Last 12 Months)
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Monthly active users across all categories
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-navy-700 dark:text-white">
                +48.5%
              </div>
              <div className="text-xs text-green-500">Total growth</div>
            </div>
          </div>
          <div className="h-64">
            <LineChart
              series={userGrowthData.series}
              options={userGrowthData.options}
            />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-[#4318FF]"></div>
              <span>Patients</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-[#6AD2FF]"></div>
              <span>Providers</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full bg-[#00B69B]"></div>
              <span>Clinics</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Service Usage Distribution
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Most used features by all users
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-navy-700 dark:text-white">
                1.2M
              </div>
              <div className="text-xs text-green-500">Total interactions</div>
            </div>
          </div>
          <div className="h-64">
            <BarChart
              chartData={serviceUsageData.series}
              chartOptions={serviceUsageData.options}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
            Telemedicine is the most used service (67,000 interactions)
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Appointments
              </div>
              <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
                12,458
              </div>
            </div>
            <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
              <MdTrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-500">+23% from last month</span>
            <span className="ml-2 text-gray-500">1,234 today</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Active Telemedicine Chats
              </div>
              <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
                189
              </div>
            </div>
            <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
              <MdTrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-500">+15% from last month</span>
            <span className="ml-2 text-gray-500">Avg. duration: 18m</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4 dark:border-navy-700">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                SMS Messages Sent
              </div>
              <div className="mt-2 text-2xl font-bold text-navy-700 dark:text-white">
                45,287
              </div>
            </div>
            <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
              <MdTrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-sm">
            <span className="text-green-500">+32% from last month</span>
            <span className="ml-2 text-gray-500">Delivery rate: 98.7%</span>
          </div>
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="mt-6 rounded-xl border border-gray-200 p-4 dark:border-navy-700">
        <div className="mb-4 text-sm font-medium text-gray-600 dark:text-gray-300">
          Platform Usage Distribution
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Mobile App
              </span>
              <span className="font-medium">68%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-navy-600">
              <div className="h-2 w-3/4 rounded-full bg-blue-500"></div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Web Portal
              </span>
              <span className="font-medium">24%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-navy-600">
              <div className="h-2 w-1/4 rounded-full bg-green-500"></div>
            </div>
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                SMS/USSD
              </span>
              <span className="font-medium">8%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-navy-600">
              <div className="h-2 w-[8%] rounded-full bg-purple-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
