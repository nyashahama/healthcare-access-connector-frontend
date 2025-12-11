import React from "react";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import {
  FaStethoscope,
  FaClinicMedical,
  FaComments,
  FaBook,
  FaSearch,
} from "react-icons/fa";

const UsageTrends = () => {
  const usageData = [
    {
      name: "Symptom Checker",
      data: [320, 380, 420, 480, 520, 580, 630, 590, 640, 680, 720, 780],
    },
    {
      name: "Clinic Search",
      data: [280, 320, 350, 380, 420, 450, 480, 520, 550, 580, 610, 650],
    },
    {
      name: "Telemedicine",
      data: [120, 150, 180, 210, 240, 270, 300, 320, 350, 380, 410, 450],
    },
  ];

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#4318FF", "#10B981", "#F59E0B"],
    stroke: {
      curve: "smooth",
      width: 3,
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

  const featureUsage = [
    {
      icon: <FaStethoscope className="h-4 w-4 text-blue-500" />,
      name: "Symptom Checker",
      usage: "15,842",
      growth: "+23%",
      activeUsers: "8,245",
    },
    {
      icon: <FaSearch className="h-4 w-4 text-green-500" />,
      name: "Clinic Search",
      usage: "12,589",
      growth: "+18%",
      activeUsers: "10,123",
    },
    {
      icon: <FaComments className="h-4 w-4 text-purple-500" />,
      name: "Telemedicine",
      usage: "4,256",
      growth: "+42%",
      activeUsers: "2,845",
    },
    {
      icon: <FaBook className="h-4 w-4 text-orange-500" />,
      name: "Nutrition Library",
      usage: "3,789",
      growth: "+15%",
      activeUsers: "2,123",
    },
    {
      icon: <FaClinicMedical className="h-4 w-4 text-red-500" />,
      name: "Appointment Booking",
      usage: "8,742",
      growth: "+28%",
      activeUsers: "5,689",
    },
  ];

  const peakUsage = [
    { time: "6-8 AM", activity: "Low" },
    { time: "8-10 AM", activity: "Very High", peak: true },
    { time: "10-12 PM", activity: "High" },
    { time: "12-2 PM", activity: "Medium" },
    { time: "2-4 PM", activity: "Medium" },
    { time: "4-6 PM", activity: "High" },
    { time: "6-8 PM", activity: "Low" },
    { time: "8-10 PM", activity: "Very Low" },
  ];

  return (
    <Card extra="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Platform Usage Trends
          </h4>
          <p className="text-sm text-gray-600">
            Feature adoption and user engagement
          </p>
        </div>
        <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-navy-700">
          <option>2024</option>
          <option>2023</option>
          <option>2022</option>
        </select>
      </div>

      {/* Chart */}
      <div className="mb-6 h-[250px]">
        <LineChart options={chartOptions} series={usageData} />
      </div>

      {/* Feature Usage Breakdown */}
      <div className="mb-6">
        <h5 className="mb-4 text-sm font-medium text-gray-600">
          Feature Usage Breakdown
        </h5>
        <div className="space-y-3">
          {featureUsage.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-navy-700"
            >
              <div className="flex items-center">
                {feature.icon}
                <span className="ml-3 text-sm font-medium text-navy-700 dark:text-white">
                  {feature.name}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-sm font-bold text-navy-700 dark:text-white">
                    {feature.usage}
                  </div>
                  <div className="text-xs text-gray-500">uses</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-green-500">
                    {feature.growth}
                  </div>
                  <div className="text-xs text-gray-500">growth</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Usage Pattern */}
      <div>
        <h5 className="mb-4 text-sm font-medium text-gray-600">
          Daily Activity Pattern
        </h5>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {peakUsage.map((slot, index) => (
            <div
              key={index}
              className={`rounded-lg p-2 text-center ${
                slot.peak
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 dark:bg-navy-700"
              }`}
            >
              <div className="text-xs font-medium">{slot.time}</div>
              <div
                className={`text-xs ${
                  slot.peak ? "text-white" : "text-gray-600 dark:text-gray-300"
                }`}
              >
                {slot.activity}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Peak usage occurs during morning hours (8-10 AM) when users search for
          clinics and book appointments.
        </div>
      </div>
    </Card>
  );
};

export default UsageTrends;
