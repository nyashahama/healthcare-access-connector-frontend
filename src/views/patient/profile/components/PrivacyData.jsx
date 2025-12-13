import React, { useState } from "react";
import { FaShieldAlt, FaUserLock, FaFileExport } from "react-icons/fa";
import {
  MdHistory,
  MdDelete,
  MdSave,
  MdWarning,
  MdInfo,
  MdDownload,
  MdVisibility,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const PrivacyData = () => {
  const { showToast } = useToast();
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [exportForm, setExportForm] = useState({
    format: "PDF",
    dateRange: "all",
    include: ["medical", "appointments", "prescriptions"],
  });

  const [consents, setConsents] = useState({
    healthData: true,
    research: false,
    emergencyAccess: true,
  });

  const handleConsentToggle = (consent) => {
    setConsents((prev) => ({
      ...prev,
      [consent]: !prev[consent],
    }));
  };

  const handleExportClick = () => {
    setExportForm({
      format: "PDF",
      dateRange: "all",
      include: ["medical", "appointments", "prescriptions"],
    });
    setExportModalOpen(true);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleHistoryClick = () => {
    setHistoryModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setExportForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleIncludeToggle = (item) => {
    setExportForm((prev) => ({
      ...prev,
      include: prev.include.includes(item)
        ? prev.include.filter((i) => i !== item)
        : [...prev.include, item],
    }));
  };

  const confirmExport = () => {
    setExportModalOpen(false);
    showToast(
      "Your data export has been initiated. You'll receive an email when it's ready.",
      "success"
    );
  };

  const confirmDelete = () => {
    setDeleteModalOpen(false);
    showToast(
      "Account deletion request submitted. Our team will contact you within 48 hours.",
      "warning"
    );
  };

  const confirmSaveConsents = () => {
    setSaveModalOpen(false);
    showToast("Privacy preferences saved successfully!", "success");
  };

  return (
    <>
      {/* Export Data Modal */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export My Data"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Export Format
              </label>
              <select
                value={exportForm.format}
                onChange={(e) => handleFormChange("format", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="PDF">PDF Document</option>
                <option value="CSV">CSV Spreadsheet</option>
                <option value="JSON">JSON Data</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Date Range
              </label>
              <select
                value={exportForm.dateRange}
                onChange={(e) => handleFormChange("dateRange", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="all">All Time</option>
                <option value="year">Past Year</option>
                <option value="6months">Past 6 Months</option>
                <option value="3months">Past 3 Months</option>
                <option value="month">Past Month</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Include in Export
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "medical",
                  label: "Medical Records",
                  description: "Diagnoses, allergies, medications",
                },
                {
                  id: "appointments",
                  label: "Appointments",
                  description: "All past and upcoming appointments",
                },
                {
                  id: "prescriptions",
                  label: "Prescriptions",
                  description: "Medication history and refills",
                },
                {
                  id: "lab",
                  label: "Lab Results",
                  description: "Blood tests, scans, and reports",
                },
                {
                  id: "billing",
                  label: "Billing Information",
                  description: "Invoices and payment history",
                },
              ].map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`include-${item.id}`}
                    checked={exportForm.include.includes(item.id)}
                    onChange={() => handleIncludeToggle(item.id)}
                    className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  />
                  <label htmlFor={`include-${item.id}`} className="ml-3 flex-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.label}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {item.description}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Large exports may take up to 24 hours to process. You'll receive
                an email with a download link.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setExportModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmExport}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdDownload className="h-5 w-5" />
              Request Export
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Account"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Delete Your Account?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This action will permanently delete all your health data and
                cannot be undone.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-red-500" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  What will be deleted:
                </p>
                <ul className="ml-4 list-disc text-sm text-red-600 dark:text-red-400">
                  <li>All medical records and history</li>
                  <li>Appointment history</li>
                  <li>Prescription information</li>
                  <li>Personal contact information</li>
                  <li>Payment and billing history</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for leaving (optional)
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              rows="3"
              placeholder="Help us improve by telling us why you're leaving..."
            />
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
              Request Account Deletion
            </button>
          </div>
        </div>
      </Modal>

      {/* Data History Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title="Data Access History"
        size="lg"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This log shows every time your health data was accessed, including
              by you and healthcare providers.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                date: "2024-03-15",
                time: "14:30",
                user: "You",
                action: "Viewed medical records",
                location: "Johannesburg, ZA",
              },
              {
                date: "2024-03-15",
                time: "10:15",
                user: "Dr. Michael Chen",
                action: "Emergency access",
                location: "Hillbrow Clinic",
              },
              {
                date: "2024-03-14",
                time: "09:45",
                user: "Lab Technician",
                action: "Uploaded lab results",
                location: "PathCare Labs",
              },
              {
                date: "2024-03-10",
                time: "16:20",
                user: "You",
                action: "Updated contact information",
                location: "Johannesburg, ZA",
              },
              {
                date: "2024-03-08",
                time: "11:30",
                user: "Dr. Sarah Johnson",
                action: "Regular consultation",
                location: "Soweto CHC",
              },
            ].map((log, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-navy-700 dark:text-white">
                      {log.user}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.action}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{log.location}</p>
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
              onClick={() => setHistoryModalOpen(false)}
              className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Save Consents Modal */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Save Privacy Preferences"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <MdSave className="h-8 w-8 text-green-600 dark:text-green-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Save Changes?
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Your privacy preferences will be updated.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSaveModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSaveConsents}
              className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
            >
              <MdSave className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Card extra={"w-full h-full p-6"}>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <FaShieldAlt className="mr-3 text-brand-500" />
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Privacy & Data
            </h4>
          </div>
          <button
            onClick={() => setSaveModalOpen(true)}
            className="text-sm font-medium text-brand-500 hover:text-brand-600"
          >
            Save
          </button>
        </div>

        {/* POPIA Compliance */}
        <div className="mb-6">
          <div className="mb-4 flex items-center">
            <FaUserLock className="mr-2 text-green-500" />
            <h5 className="font-bold text-navy-700 dark:text-white">
              POPIA Compliance
            </h5>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="popia-consent"
                  checked={consents.healthData}
                  onChange={() => handleConsentToggle("healthData")}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <div className="ml-3">
                  <label
                    htmlFor="popia-consent"
                    className="font-medium text-green-800 dark:text-green-300"
                  >
                    Health Data Consent
                  </label>
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                    I consent to the collection and use of my health data as per
                    POPIA regulations
                  </p>
                  <p className="mt-1 text-xs text-green-500 dark:text-green-500/80">
                    Last updated: 15 March 2024
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="research-consent"
                  checked={consents.research}
                  onChange={() => handleConsentToggle("research")}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <label
                    htmlFor="research-consent"
                    className="font-medium text-blue-800 dark:text-blue-300"
                  >
                    Anonymized Research
                  </label>
                  <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                    Allow anonymized health data to be used for medical research
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="emergency-access"
                  checked={consents.emergencyAccess}
                  onChange={() => handleConsentToggle("emergencyAccess")}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div className="ml-3">
                  <label
                    htmlFor="emergency-access"
                    className="font-medium text-purple-800 dark:text-purple-300"
                  >
                    Emergency Access
                  </label>
                  <p className="mt-1 text-sm text-purple-600 dark:text-purple-400">
                    Allow healthcare providers to access critical information in
                    emergencies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h5 className="mb-4 font-bold text-navy-700 dark:text-white">
            Data Management
          </h5>

          <div className="space-y-3">
            <button
              onClick={handleHistoryClick}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
            >
              <div className="flex items-center">
                <MdHistory className="mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium text-navy-700 dark:text-white">
                    View Data History
                  </p>
                  <p className="text-sm text-gray-600">
                    See who accessed your health data and when
                  </p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleExportClick}
              className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
            >
              <div className="flex items-center">
                <FaFileExport className="mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium text-navy-700 dark:text-white">
                    Export My Data
                  </p>
                  <p className="text-sm text-gray-600">
                    Download all your health records
                  </p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </button>

            <button
              onClick={handleDeleteClick}
              className="flex w-full items-center justify-between rounded-lg border border-red-200 p-3 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
            >
              <div className="flex items-center">
                <MdDelete className="mr-3 text-red-500" />
                <div className="text-left">
                  <p className="font-medium text-red-700 dark:text-red-300">
                    Delete Account
                  </p>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Permanently delete all your data
                  </p>
                </div>
              </div>
              <span className="text-red-400">→</span>
            </button>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-bold">Your privacy is important to us.</span>
            We never share your health data without your explicit consent. All
            data is encrypted and stored securely in compliance with South
            African POPIA regulations.
          </p>
        </div>
      </Card>
    </>
  );
};

export default PrivacyData;
