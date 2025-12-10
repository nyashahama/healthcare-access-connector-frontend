import React from "react";
import { FaUser, FaBaby, FaHeartbeat, FaNotesMedical } from "react-icons/fa";
import avatar from "assets/img/avatars/avatar11.png";
import Card from "components/card";

const PatientBanner = () => {
  return (
    <Card extra={"items-center w-full h-full p-[16px]"}>
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-pink-400 shadow-xl dark:border-navy-700">
            <img
              className="h-full w-full rounded-full"
              src={avatar}
              alt="Patient"
            />
          </div>
        </div>

        {/* Patient Info */}
        <div className="flex-grow text-center md:text-left">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            Sarah Johnson
          </h4>
          <p className="text-base font-normal text-gray-600">
            Patient & Mother of 2 • Johannesburg, Gauteng
          </p>

          {/* Health Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaBaby className="mr-2 text-brand-500" />
                <p className="text-sm font-medium text-gray-600">Children</p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                2
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaHeartbeat className="mr-2 text-green-500" />
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                2
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaNotesMedical className="mr-2 text-purple-500" />
                <p className="text-sm font-medium text-gray-600">
                  Consultations
                </p>
              </div>
              <p className="text-xl font-bold text-navy-700 dark:text-white">
                12
              </p>
            </div>

            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                <p className="text-sm font-medium text-gray-600">
                  Health Score
                </p>
              </div>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                Good
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex-shrink-0">
          <button className="linear rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
            Edit Profile
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PatientBanner;
