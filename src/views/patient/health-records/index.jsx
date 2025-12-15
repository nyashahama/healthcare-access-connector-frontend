import React, { useState } from "react";
import {
  MdHealthAndSafety,
  MdCalendarToday,
  MdAdd,
  MdEdit,
  MdDownload,
  MdPrint,
  MdShare,
  MdSearch,
  MdFilterList,
  MdWarning,
  MdInfo,
} from "react-icons/md";
import {
  FaHeartbeat,
  FaAllergies,
  FaPills,
  FaSyringe,
  FaUserMd,
} from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const HealthRecords = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  const healthData = {
    conditions: [
      {
        id: 1,
        name: "Asthma",
        diagnosed: "2020-03-15",
        doctor: "Dr. Sarah Johnson",
        status: "Active",
        severity: "Mild",
        medications: ["Albuterol inhaler"],
        notes: "Well-controlled with medication",
      },
      {
        id: 2,
        name: "Seasonal Allergies",
        diagnosed: "2021-05-10",
        doctor: "Dr. Michael Smith",
        status: "Active",
        severity: "Mild",
        medications: ["Cetirizine"],
        notes: "Symptoms in spring and fall",
      },
    ],
    allergies: [
      {
        id: 1,
        allergen: "Penicillin",
        reaction: "Rash, difficulty breathing",
        severity: "Severe",
        diagnosed: "2019-08-20",
        doctor: "Dr. Emergency",
      },
      {
        id: 2,
        allergen: "Peanuts",
        reaction: "Swelling, hives",
        severity: "Moderate",
        diagnosed: "2020-01-15",
        doctor: "Dr. Allergist",
      },
    ],
    medications: [
      {
        id: 1,
        name: "Albuterol Inhaler",
        dosage: "2 puffs as needed",
        startDate: "2020-03-20",
        doctor: "Dr. Sarah Johnson",
        purpose: "Asthma relief",
        status: "Active",
      },
      {
        id: 2,
        name: "Cetirizine 10mg",
        dosage: "1 tablet daily",
        startDate: "2021-05-15",
        doctor: "Dr. Michael Smith",
        purpose: "Allergy control",
        status: "Active",
      },
    ],
    vaccinations: [
      {
        id: 1,
        vaccine: "COVID-19 Vaccine",
        date: "2022-01-15",
        dose: "Booster",
        location: "Community Health Center",
        nextDue: "2024-01-15",
        status: "Complete",
      },
      {
        id: 2,
        vaccine: "Influenza Vaccine",
        date: "2023-10-20",
        dose: "Annual",
        location: "Workplace Clinic",
        nextDue: "2024-10-20",
        status: "Complete",
      },
    ],
    surgeries: [
      {
        id: 1,
        procedure: "Appendectomy",
        date: "2018-06-10",
        hospital: "City General Hospital",
        doctor: "Dr. Surgeon",
        reason: "Acute appendicitis",
        outcome: "Successful",
      },
    ],
    familyHistory: [
      {
        id: 1,
        relation: "Mother",
        condition: "Type 2 Diabetes",
        age: "Diagnosed at 45",
        notes: "Controlled with medication",
      },
      {
        id: 2,
        relation: "Father",
        condition: "Hypertension",
        age: "Diagnosed at 50",
        notes: "On medication",
      },
    ],
  };

  const OverviewCard = () => (
    <Card extra="p-6">
      <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
        Health Summary
      </h4>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaHeartbeat className="mx-auto h-6 w-6 text-red-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Conditions
          </div>
          <div className="text-xl font-bold">
            {healthData.conditions.length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaAllergies className="mx-auto h-6 w-6 text-yellow-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Allergies
          </div>
          <div className="text-xl font-bold">{healthData.allergies.length}</div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaPills className="mx-auto h-6 w-6 text-blue-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Medications
          </div>
          <div className="text-xl font-bold">
            {healthData.medications.length}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 p-4 text-center dark:border-gray-700">
          <FaSyringe className="mx-auto h-6 w-6 text-green-500" />
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Vaccinations
          </div>
          <div className="text-xl font-bold">
            {healthData.vaccinations.length}
          </div>
        </div>
      </div>
    </Card>
  );

  const renderSection = () => {
    switch (activeTab) {
      case "conditions":
        return (
          <div className="space-y-4">
            {healthData.conditions.map((condition) => (
              <Card key={condition.id} extra="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-bold text-navy-700 dark:text-white">
                      {condition.name}
                    </h5>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Diagnosed: </span>
                        <span>{condition.diagnosed}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Doctor: </span>
                        <span>{condition.doctor}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Status: </span>
                        <span
                          className={`font-medium ${
                            condition.status === "Active"
                              ? "text-green-600"
                              : "text-gray-600"
                          }`}
                        >
                          {condition.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Severity: </span>
                        <span>{condition.severity}</span>
                      </div>
                    </div>
                    {condition.notes && (
                      <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {condition.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case "allergies":
        return (
          <div className="space-y-4">
            {healthData.allergies.map((allergy) => (
              <Card key={allergy.id} extra="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-bold text-navy-700 dark:text-white">
                      {allergy.allergen}
                    </h5>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Reaction: </span>
                        <span>{allergy.reaction}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Severity: </span>
                        <span
                          className={`font-medium ${
                            allergy.severity === "Severe"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {allergy.severity}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Diagnosed: </span>
                        <span>{allergy.diagnosed}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Doctor: </span>
                        <span>{allergy.doctor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        allergy.severity === "Severe"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {allergy.severity}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      // Add similar cases for other sections...
      default:
        return <OverviewCard />;
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Health Records
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Comprehensive view of your medical history
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search health records..."
              className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-gray-600 dark:bg-navy-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button className="flex items-center rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
          </button>
          <button className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600">
            <MdDownload className="mr-2 h-4 w-4" />
            Export Records
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            "overview",
            "conditions",
            "allergies",
            "medications",
            "vaccinations",
            "surgeries",
            "familyHistory",
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300"
              }`}
            >
              {tab
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {renderSection()}

      {/* Emergency Information */}
      <div className="mt-6">
        <Card extra="p-6">
          <div className="flex items-start">
            <MdWarning className="mr-3 h-5 w-5 text-red-500" />
            <div>
              <h5 className="font-bold text-red-700 dark:text-red-300">
                Emergency Health Information
              </h5>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                This information is critical for emergency responders. Keep your
                medical ID updated on your phone and consider wearing a medical
                alert bracelet if you have severe allergies or conditions.
              </p>
              <button className="linear mt-3 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300">
                Update Emergency Info
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HealthRecords;
