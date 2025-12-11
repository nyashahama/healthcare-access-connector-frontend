import React from "react";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import {
  FaMapMarkerAlt,
  FaMobileAlt,
  FaGlobeAfrica,
  FaRoad,
} from "react-icons/fa";

const AccessibilityInsights = () => {
  const accessibilityData = [
    {
      name: "Coverage",
      data: [85, 72, 68, 45, 38, 55, 62, 78, 82, 65, 58, 42],
    },
  ];

  const accessibilityOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    colors: ["#10B981"],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "60%",
      },
    },
    xaxis: {
      categories: [
        "GP",
        "WC",
        "KZN",
        "EC",
        "LP",
        "MP",
        "NW",
        "FS",
        "NC",
        "GT",
        "Other",
      ],
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "10px",
        },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        style: {
          colors: "#A3AED0",
          fontSize: "10px",
        },
        formatter: (value) => `${value}%`,
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  const accessibilityStats = [
    {
      icon: <FaMapMarkerAlt className="h-5 w-5 text-blue-500" />,
      label: "Rural Coverage",
      value: "68%",
      description: "Clinics in rural areas",
    },
    {
      icon: <FaMobileAlt className="h-5 w-5 text-green-500" />,
      label: "Mobile Access",
      value: "92%",
      description: "Users on mobile devices",
    },
    {
      icon: <FaGlobeAfrica className="h-5 w-5 text-purple-500" />,
      label: "Language Support",
      value: "5",
      description: "Local languages",
    },
    {
      icon: <FaRoad className="h-5 w-5 text-orange-500" />,
      label: "Travel Distance",
      value: "15km",
      description: "Avg. to nearest clinic",
    },
  ];

  const barriers = [
    { issue: "Transportation", percentage: 45, severity: "high" },
    { issue: "Internet Access", percentage: 38, severity: "medium" },
    { issue: "Language", percentage: 22, severity: "medium" },
    { issue: "Digital Literacy", percentage: 31, severity: "medium" },
    { issue: "Service Hours", percentage: 18, severity: "low" },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card extra="p-6">
      <h4 className="mb-6 text-lg font-bold text-navy-700 dark:text-white">
        Accessibility Insights
      </h4>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {accessibilityStats.map((stat, index) => (
          <div
            key={index}
            className="rounded-lg bg-gray-50 p-3 dark:bg-navy-700"
          >
            <div className="flex items-center">
              {stat.icon}
              <span className="ml-2 text-xs text-gray-600">{stat.label}</span>
            </div>
            <div className="mt-2">
              <div className="text-lg font-bold text-navy-700 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500">{stat.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Coverage Chart */}
      <div className="mb-6">
        <h5 className="mb-4 text-sm font-medium text-gray-600">
          Provincial Coverage (% of population served)
        </h5>
        <div className="h-[200px]">
          <BarChart
            chartData={accessibilityData}
            chartOptions={accessibilityOptions}
          />
        </div>
      </div>

      {/* Accessibility Barriers */}
      <div>
        <h5 className="mb-4 text-sm font-medium text-gray-600">
          Common Accessibility Barriers
        </h5>
        <div className="space-y-3">
          {barriers.map((barrier, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {barrier.issue}
                </span>
                <span className="font-medium">{barrier.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${getSeverityColor(
                    barrier.severity
                  )}`}
                  style={{ width: `${barrier.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation */}
      <div className="mt-6 rounded-lg bg-yellow-50 p-4 dark:bg-navy-700">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-bold text-yellow-600">Recommendation:</span>{" "}
          Focus on transportation solutions and offline access features to
          improve accessibility in rural areas where coverage is lowest.
        </p>
      </div>
    </Card>
  );
};

export default AccessibilityInsights;
