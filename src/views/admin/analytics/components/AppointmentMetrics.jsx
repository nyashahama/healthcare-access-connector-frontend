import React from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import {
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
} from "react-icons/md";

const AppointmentMetrics = () => {
  const appointmentData = [
    {
      name: "Appointments",
      data: [450, 520, 480, 610, 590, 670, 730, 710, 680, 750, 820, 874],
    },
    {
      name: "No-shows",
      data: [45, 52, 48, 61, 59, 67, 73, 71, 68, 75, 82, 87],
    },
  ];

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#4318FF", "#FF6B6B"],
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
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "10px",
        },
      },
    },
    grid: {
      strokeDashArray: 5,
    },
    legend: {
      show: true,
      position: "top",
    },
  };

  const appointmentStats = [
    {
      icon: <MdCalendarToday className="h-5 w-5 text-blue-500" />,
      label: "Total Booked",
      value: "1,245",
      change: "+12%",
      color: "blue",
    },
    {
      icon: <MdCheckCircle className="h-5 w-5 text-green-500" />,
      label: "Completed",
      value: "1,089",
      change: "+15%",
      color: "green",
    },
    {
      icon: <MdCancel className="h-5 w-5 text-red-500" />,
      label: "Cancelled",
      value: "98",
      change: "-3%",
      color: "red",
    },
    {
      icon: <MdAccessTime className="h-5 w-5 text-orange-500" />,
      label: "Avg. Wait Time",
      value: "2.4h",
      change: "-0.5h",
      color: "orange",
    },
  ];

  return (
    <Card extra="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Appointment Metrics
          </h4>
          <p className="text-sm text-gray-600">
            Booking trends and completion rates
          </p>
        </div>
        <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
          <option>Monthly</option>
          <option>Weekly</option>
          <option>Daily</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {appointmentStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700"
          >
            <div className="flex items-center">
              {stat.icon}
              <span className="ml-2 text-sm text-gray-600">{stat.label}</span>
            </div>
            <div className="mt-2 flex items-baseline">
              <span className="text-xl font-bold text-navy-700 dark:text-white">
                {stat.value}
              </span>
              <span
                className={`ml-2 text-xs font-bold ${
                  stat.change.startsWith("+") || stat.change.endsWith("-")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[250px]">
        <LineChart options={chartOptions} series={appointmentData} />
      </div>

      {/* Insights */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-navy-700">
        <div className="flex items-start">
          <div className="mr-3 mt-1 rounded-full bg-blue-100 p-2 dark:bg-blue-900">
            <MdCalendarToday className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-navy-700 dark:text-white">
              📈 Peak booking hours: 8-10 AM
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              Most appointments are booked in the morning. Consider adding more
              slots during these hours.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AppointmentMetrics;
