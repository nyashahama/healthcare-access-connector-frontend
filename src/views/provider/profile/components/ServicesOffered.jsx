import React, { useState } from "react";
import {
  FaSyringe,
  FaBaby,
  FaHeartbeat,
  FaFlask,
  FaStethoscope,
  FaUserMd,
  FaChartBar,
} from "react-icons/fa";
import { MdAdd, MdCheckCircle, MdEdit } from "react-icons/md";
import Card from "components/card";

const ServicesOffered = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Immunizations",
      icon: <FaSyringe />,
      category: "Preventive",
      active: true,
      popularity: 95,
    },
    {
      id: 2,
      name: "Child Health",
      icon: <FaBaby />,
      category: "Pediatric",
      active: true,
      popularity: 88,
    },
    {
      id: 3,
      name: "Chronic Disease",
      icon: <FaHeartbeat />,
      category: "Adult",
      active: true,
      popularity: 76,
    },
    {
      id: 4,
      name: "HIV Testing",
      icon: <FaFlask />,
      category: "Testing",
      active: true,
      popularity: 82,
    },
    {
      id: 5,
      name: "TB Screening",
      icon: <FaStethoscope />,
      category: "Testing",
      active: true,
      popularity: 69,
    },
    {
      id: 6,
      name: "Prenatal Care",
      icon: <FaUserMd />,
      category: "Women's Health",
      active: false,
      popularity: 0,
    },
    {
      id: 7,
      name: "Nutrition Counseling",
      icon: "🥗",
      category: "Wellness",
      active: true,
      popularity: 54,
    },
    {
      id: 8,
      name: "Mental Health",
      icon: "🧠",
      category: "Wellness",
      active: false,
      popularity: 0,
    },
  ]);

  const toggleService = (id) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, active: !service.active } : service
      )
    );
  };

  const activeServices = services.filter((s) => s.active);
  const mostPopular = [...activeServices]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaChartBar className="mr-3 text-brand-500" />
          <div>
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Services Offered
            </h4>
            <p className="text-sm text-gray-600">
              {activeServices.length} active services
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300">
            <MdAdd className="mr-2" />
            Add Service
          </button>
          <button className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-navy-600">
            <MdEdit />
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-2 gap-3">
        {services.map((service) => (
          <div
            key={service.id}
            className={`cursor-pointer rounded-xl border p-3 transition-all ${
              service.active
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                : "border-gray-200 bg-gray-50 dark:border-navy-600 dark:bg-navy-700/50"
            }`}
            onClick={() => toggleService(service.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg ${
                    service.active
                      ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                      : "bg-gray-100 text-gray-500 dark:bg-navy-600 dark:text-gray-400"
                  }`}
                >
                  {typeof service.icon === "string" ? (
                    <span className="text-lg">{service.icon}</span>
                  ) : (
                    React.cloneElement(service.icon, { className: "text-lg" })
                  )}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      service.active
                        ? "text-green-800 dark:text-green-300"
                        : "text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {service.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {service.category}
                  </p>
                </div>
              </div>
              <MdCheckCircle
                className={`text-lg ${
                  service.active
                    ? "text-green-500"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </div>

            {service.active && service.popularity > 0 && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Popularity
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {service.popularity}%
                  </span>
                </div>
                <div className="mt-1 h-1 w-full rounded-full bg-gray-200 dark:bg-navy-600">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${service.popularity}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Service Statistics */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {activeServices.length}
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Active Services
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {Math.round(
              activeServices.reduce((acc, s) => acc + s.popularity, 0) /
                activeServices.length
            ) || 0}
            %
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Avg. Popularity
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            3
          </p>
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Most Used
          </p>
        </div>
      </div>

      {/* Popular Services */}
      <div className="mt-4">
        <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          Most popular services this month:
        </p>
        <div className="space-y-2">
          {mostPopular.map((service, index) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-navy-700"
            >
              <div className="flex items-center">
                <span className="mr-3 font-bold text-brand-500">
                  {index + 1}
                </span>
                <span className="font-medium text-navy-700 dark:text-white">
                  {service.name}
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600 dark:text-gray-400">
                  {service.popularity}% usage
                </span>
                <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${service.popularity}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ServicesOffered;
