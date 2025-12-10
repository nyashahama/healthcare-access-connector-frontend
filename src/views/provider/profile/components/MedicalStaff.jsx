import React from "react";
import {
  FaUserMd,
  FaUserNurse,
  FaStethoscope,
  FaUserPlus,
} from "react-icons/fa";
import { MdEdit, MdVerified } from "react-icons/md";
import Card from "components/card";

const MedicalStaff = () => {
  const staffMembers = [
    {
      id: 1,
      name: "Dr. Michael Smith",
      role: "General Practitioner",
      specialization: "Family Medicine, Pediatrics",
      status: "available",
      avatar: "MS",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      id: 2,
      name: "Nurse Sarah Johnson",
      role: "Registered Nurse",
      specialization: "Immunizations, Wound Care",
      status: "busy",
      avatar: "SJ",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    },
    {
      id: 3,
      name: "Dr. Thandi Nkosi",
      role: "Pediatrician",
      specialization: "Child Health, Vaccinations",
      status: "available",
      avatar: "TN",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    },
    {
      id: 4,
      name: "Nurse David Brown",
      role: "Clinic Manager",
      specialization: "Chronic Disease Management",
      status: "offline",
      avatar: "DB",
      color:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case "busy":
        return <div className="h-2 w-2 rounded-full bg-yellow-500"></div>;
      case "offline":
        return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-400"></div>;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "busy":
        return "With Patient";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaUserMd className="mr-3 text-brand-500" />
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Medical Staff
            </h4>
            <p className="text-sm text-gray-600">
              4 staff members • 2 available now
            </p>
          </div>
        </div>
        <button className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
          <FaUserPlus className="mr-2" />
          Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="space-y-4">
        {staffMembers.map((staff) => (
          <div
            key={staff.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 p-4 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
          >
            <div className="flex items-center">
              <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-full ${staff.color}`}
              >
                <span className="font-bold">{staff.avatar}</span>
              </div>
              <div>
                <div className="flex items-center">
                  <h5 className="font-bold text-navy-700 dark:text-white">
                    {staff.name}
                  </h5>
                  <MdVerified className="ml-2 text-blue-500" />
                </div>
                <p className="text-sm text-gray-600">{staff.role}</p>
                <div className="mt-1 flex items-center">
                  {staff.role.includes("Dr.") ? (
                    <FaStethoscope className="mr-1 text-gray-400" />
                  ) : (
                    <FaUserNurse className="mr-1 text-gray-400" />
                  )}
                  <p className="text-xs text-gray-500">
                    {staff.specialization}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center justify-end">
                {getStatusIcon(staff.status)}
                <span className="ml-2 text-sm font-medium">
                  {getStatusText(staff.status)}
                </span>
              </div>
              <button className="mt-2 flex items-center text-sm text-brand-500 hover:text-brand-600">
                <MdEdit className="mr-1" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Staff Schedule */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="flex items-start">
          <div className="mr-3 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              !
            </span>
          </div>
          <div>
            <h5 className="font-bold text-blue-800 dark:text-blue-300">
              Staff Schedule This Week
            </h5>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">Dr. Smith</p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Mon-Fri: 8AM-5PM
                </p>
              </div>
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">
                  Nurse Johnson
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Mon-Wed: 9AM-4PM
                </p>
              </div>
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">Dr. Nkosi</p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Thu-Fri: 10AM-3PM
                </p>
              </div>
              <div className="text-sm">
                <p className="text-blue-700 dark:text-blue-400">Nurse Brown</p>
                <p className="text-xs text-blue-600 dark:text-blue-500/80">
                  Mon-Fri: 8AM-4PM
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MedicalStaff;
