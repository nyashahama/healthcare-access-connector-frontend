import React, { useState } from "react";
import { FaClock, FaCalendarAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Card from "components/card";

const OperatingHours = () => {
  const [hours, setHours] = useState({
    monday: { open: "08:00", close: "17:00", closed: false },
    tuesday: { open: "08:00", close: "17:00", closed: false },
    wednesday: { open: "08:00", close: "17:00", closed: false },
    thursday: { open: "08:00", close: "17:00", closed: false },
    friday: { open: "08:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "13:00", closed: false },
    sunday: { open: "", close: "", closed: true },
  });

  const holidays = [
    { date: "27 April 2024", name: "Freedom Day", closed: true },
    { date: "1 May 2024", name: "Workers' Day", closed: true },
    { date: "16 June 2024", name: "Youth Day", closed: true },
  ];

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaClock className="mr-2 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Operating Hours
          </h4>
        </div>
        <button className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600">
          <MdEdit className="mr-1" />
          Edit Hours
        </button>
      </div>

      {/* Regular Hours */}
      <div className="space-y-3">
        {Object.entries(hours).map(([day, data]) => (
          <div
            key={day}
            className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-navy-700"
          >
            <span className="font-medium capitalize text-navy-700 dark:text-white">
              {day}
            </span>
            {data.closed ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                Closed
              </span>
            ) : (
              <span className="font-medium text-navy-700 dark:text-white">
                {data.open} - {data.close}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Hours */}
      <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-800">
            <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
              !
            </span>
          </div>
          <div>
            <p className="font-medium text-yellow-800 dark:text-yellow-300">
              24/7 Emergency Services
            </p>
            <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
              Emergency department operates 24 hours, 7 days a week
            </p>
          </div>
        </div>
      </div>

      {/* Holiday Schedule */}
      <div className="mt-6">
        <div className="mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-purple-500" />
          <h5 className="font-bold text-navy-700 dark:text-white">
            Upcoming Holiday Schedule
          </h5>
        </div>
        <div className="space-y-2">
          {holidays.map((holiday, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-navy-600"
            >
              <div>
                <p className="font-medium text-navy-700 dark:text-white">
                  {holiday.name}
                </p>
                <p className="text-sm text-gray-600">{holiday.date}</p>
              </div>
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
                Clinic Closed
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OperatingHours;
