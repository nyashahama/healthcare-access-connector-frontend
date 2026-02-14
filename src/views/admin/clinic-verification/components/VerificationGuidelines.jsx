import React from "react";
import Card from "components/card";
import { MdCheckCircle, MdWarning, MdVerified } from "react-icons/md";

const VerificationGuidelines = () => {
  const guidelines = [
    {
      icon: (
        <MdCheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
      ),
      title: "Required Documents",
      description: "Registration certificate, medical license, facility photos",
      color: "green",
    },
    {
      icon: (
        <MdWarning className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
      ),
      title: "Common Issues",
      description: "Blurry photos, expired licenses, incomplete forms",
      color: "yellow",
    },
    {
      icon: <MdVerified className="h-4 w-4 text-blue-600 dark:text-blue-300" />,
      title: "Priority Clinics",
      description: "Rural areas, pediatric services, emergency care",
      color: "blue",
    },
  ];

  return (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        📋 Verification Guidelines
      </h4>
      <div className="space-y-3">
        {guidelines.map((item, index) => (
          <div
            key={index}
            className="flex items-start transition-all duration-300 hover:scale-[1.02]"
          >
            <div
              className={`mr-3 rounded-full p-1 ${
                item.color === "green"
                  ? "bg-green-100 dark:bg-green-900"
                  : item.color === "yellow"
                  ? "bg-yellow-100 dark:bg-yellow-900"
                  : "bg-blue-100 dark:bg-blue-900"
              }`}
            >
              {item.icon}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.title}
              </div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default VerificationGuidelines;
