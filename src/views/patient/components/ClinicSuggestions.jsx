import React from "react";
import { MdLocationOn, MdAccessTime, MdLocalHospital } from "react-icons/md";

const ClinicSuggestions = () => {
  const clinics = [
    {
      id: 1,
      name: "Community Health Clinic",
      distance: "2.5 km",
      status: "Open Now",
      services: ["Pediatrics", "Vaccinations", "General Check-ups"],
      waitTime: "15 min",
    },
    {
      id: 2,
      name: "City Public Hospital",
      distance: "4.1 km",
      status: "24/7 Emergency",
      services: ["Emergency", "X-Ray", "Laboratory"],
      waitTime: "30 min",
    },
    {
      id: 3,
      name: "Children's Health Center",
      distance: "3.2 km",
      status: "Open Now",
      services: ["Pediatrics", "Nutrition", "Vaccinations"],
      waitTime: "20 min",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Clinics Near You
        </h5>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {clinics.map((clinic) => (
          <div
            key={clinic.id}
            className="rounded-xl border border-gray-200 p-4 hover:border-brand-500 dark:border-navy-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <MdLocalHospital className="h-5 w-5 text-brand-500" />
                  <h6 className="font-bold text-navy-700 dark:text-white">
                    {clinic.name}
                  </h6>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdLocationOn className="mr-2 h-4 w-4" />
                    {clinic.distance} away
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <MdAccessTime className="mr-2 h-4 w-4" />
                    Wait: {clinic.waitTime}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {clinic.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    clinic.status === "Open Now" ||
                    clinic.status === "24/7 Emergency"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {clinic.status}
                </span>
              </div>
            </div>

            <button className="linear mt-4 w-full rounded-xl bg-brand-500 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600">
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicSuggestions;
