import React from "react";
import Modal from "components/modal/Modal";
import {
  MdWarning,
  MdAssignment,
  MdCallMade,
  MdScience,
  MdInfo,
} from "react-icons/md";

// --- End Consultation Modal ---
export const EndConsultationModal = ({
  isOpen,
  onClose,
  onConfirm,
  patient,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <MdWarning className="text-2xl text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-navy-700 dark:text-white">
          End Consultation
        </h3>
      </div>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        Are you sure you want to end the consultation with{" "}
        <span className="font-medium">{patient?.name}</span>? The chat and
        clinical notes will be saved to their records.
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
        >
          Continue Consultation
        </button>
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          End Consultation
        </button>
      </div>
    </div>
  </Modal>
);

// --- Prescription Modal ---
export const PrescriptionModal = ({ isOpen, onClose, patient, onConfirm }) => {
  const [form, setForm] = React.useState({
    medication: "",
    dosage: "",
    frequency: "Once daily",
    duration: "7 days",
    instructions: "",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.medication || !form.dosage) return;
    onConfirm(form);
    setForm({
      medication: "",
      dosage: "",
      frequency: "Once daily",
      duration: "7 days",
      instructions: "",
    });
  };

  const fieldClass =
    "w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-navy-700";
  const labelClass =
    "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
            <MdAssignment className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Issue Prescription
            </h3>
            {patient && (
              <p className="text-sm text-gray-500">For: {patient.name}</p>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className={labelClass}>Medication *</label>
            <input
              value={form.medication}
              onChange={handleChange("medication")}
              className={fieldClass}
              placeholder="e.g. Amoxicillin"
            />
          </div>
          <div>
            <label className={labelClass}>Dosage *</label>
            <input
              value={form.dosage}
              onChange={handleChange("dosage")}
              className={fieldClass}
              placeholder="e.g. 500mg"
            />
          </div>
          <div>
            <label className={labelClass}>Frequency</label>
            <select
              value={form.frequency}
              onChange={handleChange("frequency")}
              className={fieldClass}
            >
              <option>Once daily</option>
              <option>Twice daily</option>
              <option>Three times daily</option>
              <option>As needed</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Duration</label>
            <select
              value={form.duration}
              onChange={handleChange("duration")}
              className={fieldClass}
            >
              <option>3 days</option>
              <option>5 days</option>
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Instructions</label>
            <input
              value={form.instructions}
              onChange={handleChange("instructions")}
              className={fieldClass}
              placeholder="e.g. Take with food"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.medication || !form.dosage}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Issue Prescription
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- Referral Modal ---
export const ReferralModal = ({ isOpen, onClose, patient, onConfirm }) => {
  const [form, setForm] = React.useState({
    specialist: "",
    facility: "",
    reason: "",
    urgency: "Routine",
  });

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.specialist) return;
    onConfirm(form);
    setForm({ specialist: "", facility: "", reason: "", urgency: "Routine" });
  };

  const fieldClass =
    "w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-navy-700";
  const labelClass =
    "mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
            <MdCallMade className="text-2xl text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Refer Patient
            </h3>
            {patient && (
              <p className="text-sm text-gray-500">For: {patient.name}</p>
            )}
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Specialist *</label>
            <input
              value={form.specialist}
              onChange={handleChange("specialist")}
              className={fieldClass}
              placeholder="e.g. Cardiologist"
            />
          </div>
          <div>
            <label className={labelClass}>Urgency</label>
            <select
              value={form.urgency}
              onChange={handleChange("urgency")}
              className={fieldClass}
            >
              <option>Routine</option>
              <option>Soon (within 2 weeks)</option>
              <option>Urgent (within 48 hrs)</option>
              <option>Emergency</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Facility</label>
            <input
              value={form.facility}
              onChange={handleChange("facility")}
              className={fieldClass}
              placeholder="e.g. Netcare Milpark Hospital"
            />
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Reason for Referral</label>
            <textarea
              value={form.reason}
              onChange={handleChange("reason")}
              className={fieldClass}
              rows="3"
              placeholder="Clinical reason..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.specialist}
            className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50"
          >
            Send Referral
          </button>
        </div>
      </div>
    </Modal>
  );
};

// --- Lab Order Modal ---
export const LabOrderModal = ({ isOpen, onClose, patient, onConfirm }) => {
  const availableTests = [
    "Full Blood Count (FBC)",
    "Comprehensive Metabolic Panel",
    "Lipid Panel",
    "HbA1c",
    "Thyroid Function (TSH)",
    "COVID-19 PCR",
    "Chest X-Ray",
    "Urine Dipstick",
    "Liver Function Tests",
    "Renal Function Tests",
  ];

  const [selectedTests, setSelectedTests] = React.useState([]);
  const [urgency, setUrgency] = React.useState("Routine");

  const toggleTest = (test) => {
    setSelectedTests((prev) =>
      prev.includes(test) ? prev.filter((t) => t !== test) : [...prev, test]
    );
  };

  const handleSubmit = () => {
    if (!selectedTests.length) return;
    onConfirm({ tests: selectedTests, urgency });
    setSelectedTests([]);
    setUrgency("Routine");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-center">
          <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <MdScience className="text-2xl text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-700 dark:text-white">
              Order Lab Tests
            </h3>
            {patient && (
              <p className="text-sm text-gray-500">For: {patient.name}</p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Urgency
          </label>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-navy-700"
          >
            <option>Routine</option>
            <option>Urgent</option>
            <option>STAT</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Select Tests
          </label>
          <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto">
            {availableTests.map((test) => (
              <label
                key={test}
                className={`flex cursor-pointer items-center rounded-lg border p-3 text-sm transition-all ${
                  selectedTests.includes(test)
                    ? "border-green-500 bg-green-50 dark:border-green-700 dark:bg-green-900/20"
                    : "border-gray-200 hover:border-green-300 dark:border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTests.includes(test)}
                  onChange={() => toggleTest(test)}
                  className="mr-3"
                />
                {test}
              </label>
            ))}
          </div>
        </div>

        {selectedTests.length > 0 && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs text-blue-800 dark:text-blue-300">
                {selectedTests.length} test(s) selected · Urgency: {urgency}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 dark:bg-navy-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedTests.length}
            className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
          >
            Submit Order
          </button>
        </div>
      </div>
    </Modal>
  );
};
