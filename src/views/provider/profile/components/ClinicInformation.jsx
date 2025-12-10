import React from "react";
import {
  MdBusiness,
  MdDescription,
  MdAccessible,
  MdLanguage,
  MdLocalHospital,
  MdPayment,
} from "react-icons/md";
import Card from "components/card";

const ClinicInformation = () => {
  const clinicInfo = {
    name: "Sunninghill Community Clinic",
    type: "Public Health Facility",
    description:
      "Providing comprehensive healthcare services including immunizations, chronic disease management, maternal and child health, and health education.",
    facilities: [
      "Wheelchair Accessible",
      "Pharmacy",
      "Laboratory",
      "Ambulance Services",
    ],
    languages: ["English", "Zulu", "Afrikaans", "Sotho"],
    paymentMethods: ["Free Services", "Medical Aid", "Cash"],
    accreditation: "Department of Health Accredited",
    operatingSince: "2015",
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Clinic Information
        </h4>
        <button className="text-sm font-medium text-brand-500 hover:text-brand-600">
          Edit Details
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MdBusiness className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Clinic Type</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.type}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdDescription className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.description}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdAccessible className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Facilities & Accessibility</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {clinicInfo.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                >
                  {facility}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdLanguage className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Languages Spoken</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {clinicInfo.languages.map((language, index) => (
                <span
                  key={index}
                  className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MdPayment className="mt-1 text-gray-500" />
          <div>
            <p className="text-sm text-gray-600">Payment Methods</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {clinicInfo.paymentMethods.map((method, index) => (
                <span
                  key={index}
                  className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 dark:border-navy-600">
          <div>
            <p className="text-sm text-gray-600">Accreditation</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.accreditation}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Operating Since</p>
            <p className="font-medium text-navy-700 dark:text-white">
              {clinicInfo.operatingSince}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClinicInformation;
