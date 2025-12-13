import React, { useState } from "react";
import { FaAllergies, FaPills, FaHeart, FaNotesMedical } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import {
  MdEdit,
  MdAdd,
  MdDelete,
  MdSave,
  MdWarning,
  MdVisibility,
} from "react-icons/md";

const MedicalInformation = () => {
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addMedicationModalOpen, setAddMedicationModalOpen] = useState(false);
  const [addAllergyModalOpen, setAddAllergyModalOpen] = useState(false);
  const [viewLogModalOpen, setViewLogModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState("");

  const [medicalData, setMedicalData] = useState({
    bloodType: "O+",
    allergies: [
      { id: 1, name: "Penicillin", severity: "Severe" },
      { id: 2, name: "Peanuts", severity: "Moderate" },
      { id: 3, name: "Dust mites", severity: "Mild" },
    ],
    medications: [
      {
        id: 1,
        name: "Salbutamol inhaler",
        dosage: "As needed",
        for: "Asthma",
        frequency: "When symptomatic",
      },
      {
        id: 2,
        name: "Multivitamin",
        dosage: "Daily",
        for: "General health",
        frequency: "Once daily",
      },
    ],
    conditions: [
      {
        id: 1,
        name: "Asthma",
        status: "Controlled",
        diagnosed: "2018",
        type: "Chronic",
      },
      {
        id: 2,
        name: "Seasonal allergies",
        status: "Mild",
        diagnosed: "2020",
        type: "Seasonal",
      },
    ],
    surgeries: [
      {
        id: 1,
        procedure: "Appendectomy",
        year: "2015",
        hospital: "Johannesburg General",
        notes: "Recovered well",
      },
    ],
    bloodTypeLastUpdated: "March 2023",
  });

  const [bloodTypeForm, setBloodTypeForm] = useState({
    bloodType: medicalData.bloodType,
    lastUpdated: medicalData.bloodTypeLastUpdated,
  });

  const [medicationForm, setMedicationForm] = useState({
    name: "",
    dosage: "",
    for: "",
    frequency: "Daily",
  });

  const [allergyForm, setAllergyForm] = useState({
    name: "",
    severity: "Mild",
    reaction: "",
  });

  const handleEditBloodType = () => {
    setBloodTypeForm({
      bloodType: medicalData.bloodType,
      lastUpdated: medicalData.bloodTypeLastUpdated,
    });
    setActionType("bloodType");
    setEditModalOpen(true);
  };

  const handleAddMedication = () => {
    setMedicationForm({
      name: "",
      dosage: "",
      for: "",
      frequency: "Daily",
    });
    setActionType("addMedication");
    setAddMedicationModalOpen(true);
  };

  const handleAddAllergy = () => {
    setAllergyForm({
      name: "",
      severity: "Mild",
      reaction: "",
    });
    setActionType("addAllergy");
    setAddAllergyModalOpen(true);
  };

  const handleDeleteItem = (type, id) => {
    setSelectedItem({ type, id });
    setDeleteModalOpen(true);
  };

  const handleFormChange = (formSetter) => (field, value) => {
    formSetter((prev) => ({ ...prev, [field]: value }));
  };

  const confirmBloodTypeUpdate = () => {
    setMedicalData((prev) => ({
      ...prev,
      bloodType: bloodTypeForm.bloodType,
      bloodTypeLastUpdated: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    }));
    setEditModalOpen(false);
    showToast("Blood type updated successfully!", "success");
  };

  const confirmAddMedication = () => {
    const newMedication = {
      id: Date.now(),
      ...medicationForm,
    };
    setMedicalData((prev) => ({
      ...prev,
      medications: [...prev.medications, newMedication],
    }));
    setAddMedicationModalOpen(false);
    showToast("Medication added successfully!", "success");
  };

  const confirmAddAllergy = () => {
    const newAllergy = {
      id: Date.now(),
      name: allergyForm.name,
      severity: allergyForm.severity,
    };
    setMedicalData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, newAllergy],
    }));
    setAddAllergyModalOpen(false);
    showToast("Allergy added successfully!", "success");
  };

  const confirmDelete = () => {
    const { type, id } = selectedItem;
    setMedicalData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item.id !== id),
    }));
    setDeleteModalOpen(false);
    showToast("Item removed successfully!", "error");
  };

  return (
    <>
      {/* Edit Blood Type Modal */}
      <Modal
        isOpen={editModalOpen && actionType === "bloodType"}
        onClose={() => setEditModalOpen(false)}
        title="Update Blood Type"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Blood Type *
              </label>
              <select
                value={bloodTypeForm.bloodType}
                onChange={(e) =>
                  handleFormChange(setBloodTypeForm)(
                    "bloodType",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Test Date
              </label>
              <input
                type="text"
                value={bloodTypeForm.lastUpdated}
                onChange={(e) =>
                  handleFormChange(setBloodTypeForm)(
                    "lastUpdated",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Month Year"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setEditModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmBloodTypeUpdate}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdSave className="h-5 w-5" />
              Update Blood Type
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Medication Modal */}
      <Modal
        isOpen={addMedicationModalOpen}
        onClose={() => setAddMedicationModalOpen(false)}
        title="Add Medication"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Medication Name *
              </label>
              <input
                type="text"
                value={medicationForm.name}
                onChange={(e) =>
                  handleFormChange(setMedicationForm)("name", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Salbutamol inhaler"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dosage *
              </label>
              <input
                type="text"
                value={medicationForm.dosage}
                onChange={(e) =>
                  handleFormChange(setMedicationForm)("dosage", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., 2 puffs"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Frequency *
              </label>
              <select
                value={medicationForm.frequency}
                onChange={(e) =>
                  handleFormChange(setMedicationForm)(
                    "frequency",
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Daily">Daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Weekly">Weekly</option>
                <option value="As needed">As needed</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                For (Condition)
              </label>
              <input
                type="text"
                value={medicationForm.for}
                onChange={(e) =>
                  handleFormChange(setMedicationForm)("for", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Asthma"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddMedicationModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddMedication}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdAdd className="h-5 w-5" />
              Add Medication
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Allergy Modal */}
      <Modal
        isOpen={addAllergyModalOpen}
        onClose={() => setAddAllergyModalOpen(false)}
        title="Add Allergy"
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Allergy Name *
              </label>
              <input
                type="text"
                value={allergyForm.name}
                onChange={(e) =>
                  handleFormChange(setAllergyForm)("name", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Penicillin, Peanuts"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Severity *
              </label>
              <select
                value={allergyForm.severity}
                onChange={(e) =>
                  handleFormChange(setAllergyForm)("severity", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Life-threatening">Life-threatening</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reaction (Optional)
              </label>
              <textarea
                value={allergyForm.reaction}
                onChange={(e) =>
                  handleFormChange(setAllergyForm)("reaction", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                rows="2"
                placeholder="Describe the reaction..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setAddAllergyModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmAddAllergy}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdAdd className="h-5 w-5" />
              Add Allergy
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Remove Item"
        size="sm"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Remove this item?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This information will be removed from your medical records.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      </Modal>

      {/* View Access Log Modal */}
      <Modal
        isOpen={viewLogModalOpen}
        onClose={() => setViewLogModalOpen(false)}
        title="Emergency Access Log"
        size="lg"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This log shows when healthcare providers accessed your medical
              information during emergencies.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                date: "2024-03-15",
                time: "14:30",
                provider: "Dr. Michael Chen",
                reason: "Emergency consultation",
              },
              {
                date: "2024-02-28",
                time: "09:15",
                provider: "Hillbrow Clinic",
                reason: "After-hours emergency",
              },
              {
                date: "2024-01-10",
                time: "22:45",
                provider: "Ambulance Services",
                reason: "Emergency transport",
              },
            ].map((log, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-navy-700 dark:text-white">
                      {log.provider}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-navy-700 dark:text-white">
                      {log.date}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setViewLogModalOpen(false)}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      <Card extra={"w-full h-full p-6"}>
        <div className="mb-6 flex items-center justify-between">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Medical Information
          </h4>
          <button
            onClick={handleEditBloodType}
            className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            <MdEdit className="mr-1" />
            Update
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Blood Type & Allergies */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaHeart className="mr-2 text-red-500" />
                <h5 className="font-bold text-navy-700 dark:text-white">
                  Blood Type
                </h5>
              </div>
              <button
                onClick={handleEditBloodType}
                className="text-xs text-brand-500 hover:text-brand-600"
              >
                Update
              </button>
            </div>
            <div className="rounded-xl bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                {medicalData.bloodType}
              </p>
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Last updated: {medicalData.bloodTypeLastUpdated}
              </p>
            </div>

            <div className="mt-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FaAllergies className="mr-2 text-orange-500" />
                  <h5 className="font-bold text-navy-700 dark:text-white">
                    Allergies
                  </h5>
                </div>
                <button
                  onClick={handleAddAllergy}
                  className="text-xs text-brand-500 hover:text-brand-600"
                >
                  Add Allergy
                </button>
              </div>
              <div className="space-y-2">
                {medicalData.allergies.map((allergy) => (
                  <div
                    key={allergy.id}
                    className="flex items-center justify-between rounded-lg bg-orange-50 px-3 py-2 dark:bg-orange-900/20"
                  >
                    <div className="flex items-center">
                      <span className="font-medium text-orange-700 dark:text-orange-300">
                        {allergy.name}
                      </span>
                      <button
                        onClick={() =>
                          handleDeleteItem("allergies", allergy.id)
                        }
                        className="ml-2 text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800 dark:bg-orange-800 dark:text-orange-300">
                      {allergy.severity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <FaPills className="mr-2 text-purple-500" />
                <h5 className="font-bold text-navy-700 dark:text-white">
                  Current Medications
                </h5>
              </div>
              <button
                onClick={handleAddMedication}
                className="text-xs text-brand-500 hover:text-brand-600"
              >
                Add Medication
              </button>
            </div>
            <div className="space-y-3">
              {medicalData.medications.map((med) => (
                <div
                  key={med.id}
                  className="rounded-lg border border-purple-200 bg-white p-3 dark:border-purple-800 dark:bg-navy-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy-700 dark:text-white">
                        {med.name}
                      </p>
                      <div className="mt-1 flex gap-2">
                        <button
                          onClick={() =>
                            handleDeleteItem("medications", med.id)
                          }
                          className="text-xs text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      {med.dosage}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      For: {med.for}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {med.frequency}
                    </span>
                  </div>
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
                {medicalData.conditions.map((condition) => (
                  <div
                    key={condition.id}
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
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-800 dark:text-green-300">
                        {condition.status}
                      </span>
                      <button
                        onClick={() =>
                          handleDeleteItem("conditions", condition.id)
                        }
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
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
            <button
              onClick={() => setViewLogModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-300"
            >
              <MdVisibility className="h-4 w-4" />
              View Access Log
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MedicalInformation;
