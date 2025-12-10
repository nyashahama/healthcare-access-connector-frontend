import React from "react";
import { FaBaby, FaCalendarAlt, FaHeartbeat } from "react-icons/fa";
import Card from "components/card";
import { MdEdit, MdAdd } from "react-icons/md";

const MyChildren = () => {
  const children = [
    {
      id: 1,
      name: "Emily Johnson",
      age: "5 years",
      gender: "Female",
      lastCheckup: "2 weeks ago",
      nextAppointment: "Next month",
      healthStatus: "Good",
    },
    {
      id: 2,
      name: "James Johnson",
      age: "2 years",
      gender: "Male",
      lastCheckup: "1 month ago",
      nextAppointment: "In 3 months",
      healthStatus: "Excellent",
    },
  ];

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            My Children
          </h4>
          <p className="mt-1 text-sm text-gray-600">
            Manage health information for your dependents
          </p>
        </div>
        <button className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
          <MdAdd className="mr-1" />
          Add Child
        </button>
      </div>

      <div className="space-y-4">
        {children.map((child) => (
          <div
            key={child.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
          >
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900/30">
                <FaBaby className="text-xl text-pink-600 dark:text-pink-400" />
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h5 className="font-bold text-navy-700 dark:text-white">
                    {child.name}
                  </h5>
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    {child.age}
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-600">
                  <span>{child.gender}</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center">
                    <FaHeartbeat className="mr-1 text-green-500" />
                    {child.healthStatus}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-brand-500" />
                    Last: {child.lastCheckup}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
                Book Check-up
              </button>
              <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-navy-600">
                <MdEdit />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              !
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              Ensure your child's vaccination records are up to date
            </p>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              Next vaccination due: Emily (6-year shots in July 2024)
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MyChildren;
