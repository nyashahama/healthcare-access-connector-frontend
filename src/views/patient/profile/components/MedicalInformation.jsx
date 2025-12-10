import React from "react";
import { FaAllergies, FaPills, FaHeart, FaNotesMedical } from "react-icons/fa";
import Card from "components/card";
import { MdEdit } from "react-icons/md";

const MedicalInformation = () => {
  const medicalData = {
    bloodType: "O+",
    allergies: ["Penicillin", "Peanuts", "Dust mites"],
    medications: [
      { name: "Salbutamol inhaler", dosage: "As needed", for: "Asthma" },
      { name: "Multivitamin", dosage: "Daily", for: "General health" },
    ],
    conditions: [
      { name: "Asthma", status: "Controlled", diagnosed: "2018" },
      { name: "Seasonal allergies", status: "Mild", diagnosed: "2020" },
    ],
    surgeries: [
      {
        procedure: "Appendectomy",
        year: "2015",
        hospital: "Johannesburg General",
      },
    ],
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      <div className="mb-6 flex items-center justify-between">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Medical Information
        </h4>
        <button className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600">
          <MdEdit className="mr-1" />
          Update
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Blood Type & Allergies */}
        <div>
          <div className="mb-4 flex items-center">
            <FaHeart className="mr-2 text-red-500" />
            <h5 className="font-bold text-navy-700 dark:text-white">
              Blood Type
            </h5>
          </div>
          <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {medicalData.bloodType}
            </p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              Last updated: March 2023
            </p>
          </div>

          <div className="mt-6">
            <div className="mb-4 flex items-center">
              <FaAllergies className="mr-2 text-orange-500" />
              <h5 className="font-bold text-navy-700 dark:text-white">
                Allergies
              </h5>
            </div>
            <div className="space-y-2">
              {medicalData.allergies.map((allergy, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-900/20"
                >
                  <span className="font-medium text-orange-700 dark:text-orange-300">
                    {allergy}
                  </span>
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-800 dark:text-orange-300">
                    Severe
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Medications */}
        <div>
          <div className="mb-4 flex items-center">
            <FaPills className="mr-2 text-purple-500" />
            <h5 className="font-bold text-navy-700 dark:text-white">
              Current Medications
            </h5>
          </div>
          <div className="space-y-3">
            {medicalData.medications.map((med, index) => (
              <div
                key={index}
                className="rounded-lg border border-purple-200 bg-white p-3 dark:border-purple-800 dark:bg-navy-700"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-navy-700 dark:text-white">
                    {med.name}
                  </p>
                  <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    {med.dosage}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  For: {med.for}
                </p>
              </div>
            ))}
          </div>

          {/* Chronic Conditions */}
          <div className="mt-6">
            <div className="mb-4 flex items-center">
              <FaNotesMedical className="mr-2 text-green-500" />
              <h5 className="font-bold text-navy-700 dark:text-white">
                Chronic Conditions
              </h5>
            </div>
            <div className="space-y-2">
              {medicalData.conditions.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-green-50 px-3 py-2 dark:bg-green-900/20"
                >
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      {condition.name}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Diagnosed {condition.diagnosed}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-300">
                    {condition.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Access Section */}
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="font-bold text-blue-800 dark:text-blue-300">
              🏥 Emergency Access
            </h5>
            <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
              Healthcare providers can access critical information in
              emergencies
            </p>
          </div>
          <button className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300">
            View Access Log
          </button>
        </div>
      </div>
    </Card>
  );
};

export default MedicalInformation;
