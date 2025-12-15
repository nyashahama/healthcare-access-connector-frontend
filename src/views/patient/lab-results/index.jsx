// views/patient/lab-results/index.jsx
import React, { useState } from "react";
import {
  MdScience,
  MdCalendarToday,
  MdDownload,
  MdShare,
  MdWarning,
  MdInfo,
  MdSearch,
  MdFilterList,
  MdAdd,
  MdPrint,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { FaFileMedical, FaNotesMedical } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const LabResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [modalState, setModalState] = useState({
    details: false,
    share: false,
    upload: false,
  });
  const { showToast } = useToast();

  const labResults = [
    {
      id: 1,
      testName: "Complete Blood Count (CBC)",
      date: "2024-01-10",
      lab: "City Pathology Lab",
      doctor: "Dr. Sarah Johnson",
      status: "normal",
      summary: "All values within normal range",
      details: {
        hemoglobin: "12.5 g/dL (Normal: 11.5-15.5)",
        wbc: "7.2 ×10³/μL (Normal: 4.5-11.0)",
        platelets: "250 ×10³/μL (Normal: 150-450)",
      },
      attachment: true,
      fileSize: "2.4 MB",
    },
    {
      id: 2,
      testName: "Urinalysis",
      date: "2024-01-10",
      lab: "Community Diagnostic Center",
      doctor: "Dr. Michael Smith",
      status: "normal",
      summary: "No abnormalities detected",
      details: {
        color: "Yellow (Normal)",
        clarity: "Clear",
        protein: "Negative",
        glucose: "Negative",
      },
    },
    {
      id: 3,
      testName: "Vitamin D Level",
      date: "2024-01-05",
      lab: "National Health Labs",
      doctor: "Dr. Online Consultant",
      status: "abnormal",
      summary: "Low vitamin D levels detected",
      details: {
        result: "15 ng/mL (Normal: 30-100)",
        interpretation: "Vitamin D deficiency",
        recommendation: "Supplement with Vitamin D3 1000IU daily",
      },
      priority: "medium",
    },
    {
      id: 4,
      testName: "Blood Glucose",
      date: "2024-11-15",
      lab: "Diabetes Care Center",
      doctor: "Dr. Endocrine Specialist",
      status: "normal",
      summary: "Fasting glucose within normal limits",
      details: {
        fasting: "85 mg/dL (Normal: 70-100)",
        postprandial: "110 mg/dL (Normal: <140)",
        hba1c: "5.2% (Normal: <5.7%)",
      },
    },
  ];

  const handleViewDetails = (result) => {
    setSelectedResult(result);
    setModalState({ ...modalState, details: true });
  };

  const handleShareResult = (result) => {
    setSelectedResult(result);
    setModalState({ ...modalState, share: true });
  };

  const handleUploadResult = () => {
    setModalState({ ...modalState, upload: true });
  };

  const handleDownloadResult = (result) => {
    showToast(`Downloading ${result.testName} results...`, "info");
    // Simulate download
    setTimeout(() => {
      showToast("Results downloaded successfully", "success");
    }, 1000);
  };

  const confirmShare = (method) => {
    setModalState({ ...modalState, share: false });
    showToast(`Results shared via ${method}`, "success");
  };

  const handleFileUpload = (files) => {
    setModalState({ ...modalState, upload: false });
    showToast("Lab results uploaded successfully", "success");
  };

  const LabResultCard = ({ result }) => (
    <Card extra="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-navy-700 dark:text-white">
                {result.testName}
              </h5>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {result.lab}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                result.status === "normal"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <MdCalendarToday className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">
                {new Date(result.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <FaFileMedical className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">Dr. {result.doctor}</span>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {result.summary}
            </p>
          </div>

          {result.status === "abnormal" && (
            <div className="mt-3 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
              <div className="flex items-center">
                <MdWarning className="mr-2 h-4 w-4 text-yellow-600" />
                <span className="text-sm text-yellow-700 dark:text-yellow-300">
                  {result.details.recommendation || "Follow-up recommended"}
                </span>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => handleViewDetails(result)}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
            >
              View Details
            </button>
            <button
              onClick={() => handleDownloadResult(result)}
              className="flex items-center justify-center rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <MdDownload className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleShareResult(result)}
              className="flex items-center justify-center rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
            >
              <MdShare className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      {/* Result Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        title={selectedResult?.testName || "Lab Results"}
        size="lg"
      >
        {selectedResult && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {selectedResult.testName}
                </h4>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {selectedResult.lab} • {selectedResult.doctor}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium">
                  {new Date(selectedResult.date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Summary
              </h5>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                <p className="text-gray-700 dark:text-gray-300">
                  {selectedResult.summary}
                </p>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Detailed Results
              </h5>
              <div className="space-y-3">
                {Object.entries(selectedResult.details).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <span className="capitalize text-gray-600 dark:text-gray-300">
                      {key.replace(/([A-Z])/g, " $1")}:
                    </span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedResult.attachment && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-800 dark:text-blue-300">
                      Full Report Available
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      {selectedResult.fileSize}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadResult(selectedResult)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalState({ ...modalState, details: false })}
                className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalState({ ...modalState, details: false, share: true });
                }}
                className="rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600"
              >
                Share Results
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          Lab Results
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          View and manage your laboratory test results
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lab results..."
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
          <button
            onClick={handleUploadResult}
            className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Upload Results
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {labResults.length === 0 ? (
          <Card extra="p-6 text-center">
            <MdScience className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
              No lab results found
            </h4>
            <p className="mt-2 text-gray-600">
              You don't have any lab results yet
            </p>
            <button
              onClick={handleUploadResult}
              className="linear mt-4 rounded-lg bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
            >
              Upload Your First Results
            </button>
          </Card>
        ) : (
          labResults.map((result) => (
            <LabResultCard key={result.id} result={result} />
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card extra="p-4">
          <div className="flex items-center">
            <MdScience className="mr-4 h-8 w-8 text-green-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Normal Results
              </div>
              <div className="text-2xl font-bold">
                {labResults.filter((r) => r.status === "normal").length}
              </div>
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-center">
            <MdTrendingUp className="mr-4 h-8 w-8 text-yellow-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Abnormal Results
              </div>
              <div className="text-2xl font-bold">
                {labResults.filter((r) => r.status === "abnormal").length}
              </div>
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-center">
            <MdCalendarToday className="mr-4 h-8 w-8 text-blue-500" />
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Latest Results
              </div>
              <div className="text-lg font-bold">
                {labResults.length > 0
                  ? new Date(labResults[0].date).toLocaleDateString()
                  : "None"}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Important Notes */}
      <div className="mt-6">
        <Card extra="p-6">
          <div className="flex items-start">
            <MdInfo className="mr-3 h-5 w-5 text-blue-500" />
            <div>
              <h5 className="font-bold text-blue-700 dark:text-blue-300">
                Understanding Your Lab Results
              </h5>
              <ul className="mt-2 space-y-2 text-sm text-blue-600 dark:text-blue-400">
                <li>
                  • <strong>Reference ranges</strong> vary by lab and testing
                  method
                </li>
                <li>
                  • <strong>Abnormal results</strong> don't always mean disease
                </li>
                <li>
                  • <strong>Discuss results</strong> with your healthcare
                  provider
                </li>
                <li>
                  • <strong>Track trends</strong> over time for better
                  understanding
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LabResults;
