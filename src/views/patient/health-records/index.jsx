import React, { useState } from "react";
import { useToast } from "hooks/useToast";
import Overview from "./components/Overview";
import ConditionsList from "./components/ConditionsList";
import AllergiesList from "./components/AllergiesList";
import MedicationsList from "./components/MedicationsList";
import VaccinationsList from "./components/VaccinationsList";
import SurgeriesList from "./components/SurgeriesList";
import FamilyHistoryList from "./components/FamilyHistoryList";
import EmergencyInfo from "./components/EmergencyInfo";
import Controls from "./components/Controls";
import Tabs from "./components/Tabs";

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
      <Controls searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Navigation Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="mt-6">
        {activeTab === "overview" && <Overview healthData={healthData} />}
        {activeTab === "conditions" && (
          <ConditionsList conditions={healthData.conditions} />
        )}
        {activeTab === "allergies" && (
          <AllergiesList allergies={healthData.allergies} />
        )}
        {activeTab === "medications" && (
          <MedicationsList medications={healthData.medications} />
        )}
        {activeTab === "vaccinations" && (
          <VaccinationsList vaccinations={healthData.vaccinations} />
        )}
        {activeTab === "surgeries" && (
          <SurgeriesList surgeries={healthData.surgeries} />
        )}
        {activeTab === "familyHistory" && (
          <FamilyHistoryList familyHistory={healthData.familyHistory} />
        )}
      </div>

      {/* Emergency Information */}
      <EmergencyInfo />
    </div>
  );
};

export default HealthRecords;
