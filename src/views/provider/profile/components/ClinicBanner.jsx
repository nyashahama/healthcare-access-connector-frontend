import React from "react";
import {
  MdVerified,
  MdLocationOn,
  MdPhone,
  MdCalendarToday,
} from "react-icons/md";
import { FaUsers, FaStar, FaClock } from "react-icons/fa";
import clinicLogo from "assets/img/profile/image1.png"; //should be clinics instead of profile, i'll change that
import Card from "components/card";

const ClinicBanner = () => {
  const clinicStats = {
    name: "Sunninghill Community Clinic",
    type: "Public Health Clinic",
    rating: 4.8,
    totalPatients: 1247,
    todayAppointments: 18,
    waitTime: "15 min",
  };

  return (
    <Card extra={"w-full h-full p-[16px]"}>
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Clinic Logo & Verification */}
        <div className="relative flex-shrink-0">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-white bg-white shadow-xl dark:border-navy-700 dark:bg-navy-700">
            <img
              className="h-full w-full rounded-2xl"
              src={clinicLogo}
              alt="Clinic"
            />
          </div>
          <div className="absolute -right-2 -top-2 flex items-center rounded-full bg-green-100 px-2 py-1 dark:bg-green-900">
            <MdVerified className="mr-1 text-green-600 dark:text-green-400" />
            <span className="text-xs font-bold text-green-700 dark:text-green-300">
              Verified
            </span>
          </div>
        </div>

        {/* Clinic Info */}
        <div className="flex-grow text-center md:text-left">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                {clinicStats.name}
              </h4>
              <div className="mt-2 flex items-center justify-center md:justify-start">
                <span className="rounded-full bg-brand-100 px-3 py-1 text-sm font-medium text-brand-800 dark:bg-brand-900 dark:text-brand-300">
                  {clinicStats.type}
                </span>
                <div className="ml-3 flex items-center">
                  <FaStar className="mr-1 text-yellow-500" />
                  <span className="font-bold text-navy-700 dark:text-white">
                    {clinicStats.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-600">
                    (247 reviews)
                  </span>
                </div>
              </div>
            </div>
            <button className="linear mt-3 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 md:mt-0">
              Edit Clinic Profile
            </button>
          </div>

          {/* Contact & Location */}
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="flex items-center justify-center md:justify-start">
              <MdLocationOn className="mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  123 Health St, Johannesburg
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start">
              <MdPhone className="mr-2 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-navy-700 dark:text-white">
                  +27 11 123 4567
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaUsers className="mr-2 text-blue-500" />
                <p className="text-sm font-medium text-gray-600">
                  Total Patients
                </p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {clinicStats.totalPatients.toLocaleString()}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <MdCalendarToday className="mr-2 text-brand-500" />
                <p className="text-sm font-medium text-gray-600">Today</p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {clinicStats.todayAppointments}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaClock className="mr-2 text-green-500" />
                <p className="text-sm font-medium text-gray-600">Avg. Wait</p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                {clinicStats.waitTime}
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <MdVerified className="mr-2 text-purple-500" />
                <p className="text-sm font-medium text-gray-600">
                  Staff Online
                </p>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                3
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClinicBanner;
