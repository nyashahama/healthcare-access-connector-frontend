import React from "react";
import Card from "components/card";
import PieChart from "components/charts/PieChart";
import { FaChild, FaMale, FaFemale, FaMapMarkerAlt } from "react-icons/fa";

const PatientDemographics = () => {
  const ageData = [42, 28, 15, 10, 5];
  const ageOptions = {
    labels: [
      "0-5 years",
      "6-12 years",
      "13-18 years",
      "19-60 years",
      "60+ years",
    ],
    colors: ["#4318FF", "#6AD2FF", "#10B981", "#F59E0B", "#EF4444"],
    legend: {
      show: false,
    },
  };

  const genderData = [58, 42];
  const genderOptions = {
    labels: ["Female", "Male"],
    colors: ["#EC4899", "#3B82F6"],
  };

  const demographics = [
    {
      icon: <FaChild className="h-4 w-4 text-blue-500" />,
      label: "Children (0-12)",
      value: "70%",
      count: "8,720",
    },
    {
      icon: <FaFemale className="h-4 w-4 text-pink-500" />,
      label: "Female Patients",
      value: "58%",
      count: "7,225",
    },
    {
      icon: <FaMale className="h-4 w-4 text-blue-500" />,
      label: "Male Patients",
      value: "42%",
      count: "5,233",
    },
    {
      icon: <FaMapMarkerAlt className="h-4 w-4 text-green-500" />,
      label: "Urban Patients",
      value: "65%",
      count: "8,098",
    },
  ];

  return (
    <Card extra="p-6">
      <h4 className="mb-6 text-lg font-bold text-navy-700 dark:text-white">
        Patient Demographics
      </h4>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Age Distribution */}
        <div>
          <h5 className="mb-4 text-sm font-medium text-gray-600">
            Age Distribution
          </h5>
          <div className="h-[200px]">
            <PieChart options={ageOptions} series={ageData} />
          </div>
          <div className="mt-4 space-y-2">
            {ageOptions.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: ageOptions.colors[index] }}
                  />
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
                <span className="text-sm font-bold text-navy-700 dark:text-white">
                  {ageData[index]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gender Distribution */}
        <div>
          <h5 className="mb-4 text-sm font-medium text-gray-600">
            Gender Distribution
          </h5>
          <div className="h-[200px]">
            <PieChart options={genderOptions} series={genderData} />
          </div>

          {/* Demographics Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {demographics.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
              >
                <div className="flex items-center">
                  {item.icon}
                  <span className="ml-2 text-xs text-gray-600">
                    {item.label}
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-bold text-navy-700 dark:text-white">
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.count} patients
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insight */}
      <div className="mt-6 rounded-lg bg-green-50 p-3 dark:bg-navy-700">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-bold text-green-600">Insight:</span> 70% of
          patients are children under 12, highlighting the focus on pediatric
          care in the platform.
        </p>
      </div>
    </Card>
  );
};

export default PatientDemographics;
