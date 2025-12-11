import React from "react";
import Card from "components/card";
import {
  MdStar,
  MdTrendingUp,
  MdLocationOn,
  MdAccessTime,
} from "react-icons/md";

const ClinicPerformance = () => {
  const topClinics = [
    {
      name: "Soweto Community Health Center",
      location: "Soweto, Gauteng",
      patients: 1245,
      rating: 4.8,
      waitTime: "1.2h",
      growth: "+12%",
      status: "Excellent",
    },
    {
      name: "Khayelitsha District Hospital",
      location: "Khayelitsha, WC",
      patients: 980,
      rating: 4.6,
      waitTime: "1.8h",
      growth: "+8%",
      status: "Good",
    },
    {
      name: "Hillbrow Community Clinic",
      location: "Hillbrow, Gauteng",
      patients: 856,
      rating: 4.5,
      waitTime: "1.5h",
      growth: "+15%",
      status: "Excellent",
    },
    {
      name: "Mitchells Plain CHC",
      location: "Mitchells Plain, WC",
      patients: 745,
      rating: 4.4,
      waitTime: "2.1h",
      growth: "+5%",
      status: "Good",
    },
    {
      name: "Alexandra Health Center",
      location: "Alexandra, Gauteng",
      patients: 689,
      rating: 4.3,
      waitTime: "1.9h",
      growth: "+10%",
      status: "Good",
    },
  ];

  const performanceMetrics = [
    { label: "Avg. Clinic Rating", value: "4.5/5.0", change: "+0.2" },
    { label: "Patient Satisfaction", value: "92%", change: "+3%" },
    { label: "Avg. Wait Time", value: "1.7h", change: "-0.3h" },
    { label: "No-show Rate", value: "8%", change: "-2%" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Good":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <Card extra="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Clinic Performance
          </h4>
          <p className="text-sm text-gray-600">
            Top performing clinics and metrics
          </p>
        </div>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
          View All Clinics →
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {performanceMetrics.map((metric, index) => (
          <div
            key={index}
            className="rounded-xl bg-gray-50 p-3 dark:bg-navy-700"
          >
            <div className="text-xs text-gray-600">{metric.label}</div>
            <div className="mt-1 flex items-baseline">
              <span className="text-lg font-bold text-navy-700 dark:text-white">
                {metric.value}
              </span>
              <span
                className={`ml-2 text-xs font-bold ${
                  metric.change.startsWith("+") || metric.change.endsWith("-")
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Clinics Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Clinic
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Patients
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Rating
              </th>
              <th className="pb-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {topClinics.map((clinic, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 dark:border-gray-800"
              >
                <td className="py-3">
                  <div>
                    <p className="font-medium text-navy-700 dark:text-white">
                      {clinic.name}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MdLocationOn className="mr-1 h-3 w-3" />
                      {clinic.location}
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div>
                    <p className="font-bold text-navy-700 dark:text-white">
                      {clinic.patients.toLocaleString()}
                    </p>
                    <div className="flex items-center text-xs text-green-500">
                      <MdTrendingUp className="mr-1 h-3 w-3" />
                      {clinic.growth}
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center">
                    <MdStar className="mr-1 h-4 w-4 text-yellow-500" />
                    <span className="font-bold">{clinic.rating}</span>
                    <span className="ml-1 text-xs text-gray-500">/5.0</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <MdAccessTime className="mr-1 h-3 w-3" />
                    {clinic.waitTime} wait
                  </div>
                </td>
                <td className="py-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${getStatusColor(
                      clinic.status
                    )}`}
                  >
                    {clinic.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Regional Insight */}
      <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-navy-700">
        <div className="flex items-start">
          <div className="mr-3 mt-1 rounded-full bg-purple-100 p-2 dark:bg-purple-900">
            <MdLocationOn className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-navy-700 dark:text-white">
              🏙️ Gauteng leads in clinic performance
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
              3 of the top 5 clinics are in Gauteng, indicating higher resource
              allocation in urban areas.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClinicPerformance;
