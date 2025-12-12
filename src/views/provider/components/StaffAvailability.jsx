import React from "react";
import { FaUserMd, FaUserNurse } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";

const StaffAvailability = () => {
  const staff = [
    {
      id: 1,
      name: "Dr. Michael Smith",
      role: "Doctor",
      specialization: "General Practitioner",
      available: true,
      currentPatients: 3,
      maxCapacity: 8,
    },
    {
      id: 2,
      name: "Dr. Thandi Nkosi",
      role: "Doctor",
      specialization: "Pediatrician",
      available: true,
      currentPatients: 5,
      maxCapacity: 10,
    },
    {
      id: 3,
      name: "Nurse Sarah Johnson",
      role: "Nurse",
      specialization: "Vaccinations",
      available: true,
      currentPatients: 2,
      maxCapacity: 6,
    },
    {
      id: 4,
      name: "Dr. Robert Wilson",
      role: "Doctor",
      specialization: "Family Medicine",
      available: false,
      currentPatients: 0,
      maxCapacity: 8,
    },
  ];

  const getAvailabilityColor = (currentPatients, maxCapacity) => {
    const percentage = (currentPatients / maxCapacity) * 100;
    if (percentage >= 80) return "bg-red-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Staff Availability
        </h5>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-bold text-green-600">
            {staff.filter((s) => s.available).length}
          </span>{" "}
          / {staff.length} Available
        </div>
      </div>

      <div className="space-y-3">
        {staff.map((member) => (
          <div
            key={member.id}
            className="rounded-xl border border-gray-200 p-4 dark:border-navy-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                  {member.role === "Doctor" ? (
                    <FaUserMd className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  ) : (
                    <FaUserNurse className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h6 className="font-bold text-navy-700 dark:text-white">
                    {member.name}
                  </h6>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {member.specialization}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {member.available ? (
                  <MdCheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <MdCancel className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>

            {member.available && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">
                    Patient Load
                  </span>
                  <span className="font-medium">
                    {member.currentPatients} / {member.maxCapacity}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-navy-600">
                  <div
                    className={`h-full rounded-full ${getAvailabilityColor(
                      member.currentPatients,
                      member.maxCapacity
                    )}`}
                    style={{
                      width: `${
                        (member.currentPatients / member.maxCapacity) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffAvailability;
