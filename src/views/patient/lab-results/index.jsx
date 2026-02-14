import React, { useState } from "react";
import {
  MdScience,
  MdWarning,
  MdInfo,
  MdAdd,
  MdSearch,
  MdFilterList,
} from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import QuickStats from "./components/QuickStats";
import Controls from "./components/Controls";
import LabResultCard from "./components/LabResultCard";
import ShareModal from "./components/ShareModal";
import DetailsModal from "./components/DetailsModal";
import InfoSection from "./components/InfoSection";

const LabResults = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
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
      priority: "low",
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
      priority: "low",
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
      priority: "low",
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
    // Note: No modal UI for upload in original code; kept as is.
  };

  const handleDownloadResult = (result) => {
    showToast(`Downloading ${result.testName} results...`, "info");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "abnormal":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Lab Results
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          View and manage your laboratory test results
        </p>
      </div>

      {/* Quick Stats */}
      <QuickStats labResults={labResults} />

      {/* Controls */}
      <Controls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterOpen={filterOpen}
        setFilterOpen={setFilterOpen}
        handleUploadResult={handleUploadResult}
      />

      {/* Results List */}
      <div className="space-y-4">
        {labResults.length === 0 ? (
          <Card extra="p-12 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 dark:bg-navy-700">
              <MdScience className="h-10 w-10 text-gray-400" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              No lab results found
            </h4>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              You don't have any lab results yet. Upload your first results or
              wait for test results from your provider.
            </p>
            <button
              onClick={handleUploadResult}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              <MdAdd className="h-5 w-5" />
              Upload Results
            </button>
          </Card>
        ) : (
          labResults.map((result) => (
            <LabResultCard
              key={result.id}
              result={result}
              onViewDetails={handleViewDetails}
              onDownload={handleDownloadResult}
              onShare={handleShareResult}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
            />
          ))
        )}
      </div>

      {/* Information Section */}
      <InfoSection />

      {/* Share Modal */}
      <ShareModal
        isOpen={modalState.share}
        onClose={() => setModalState({ ...modalState, share: false })}
        selectedResult={selectedResult}
        confirmShare={confirmShare}
      />

      {/* Details Modal */}
      <DetailsModal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        selectedResult={selectedResult}
        onDownload={handleDownloadResult}
        getStatusColor={getStatusColor}
      />
    </div>
  );
};

export default LabResults;
