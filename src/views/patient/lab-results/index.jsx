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
  MdLocalHospital,
  MdFilePresent,
  MdArrowBack,
  MdClose,
  MdCheckCircle,
  MdEmail,
  MdPhone,
} from "react-icons/md";
import { FaFileMedical, FaNotesMedical } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

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

  const LabResultCard = ({ result }) => {
    return (
      <Card extra="group relative overflow-hidden p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-l-brand-500">
        {/* Background Pattern */}
        <div className="absolute right-0 top-0 h-32 w-32 -translate-y-8 translate-x-8 opacity-5">
          <MdScience className="h-full w-full text-brand-500" />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    result.status === "abnormal"
                      ? "bg-red-100 dark:bg-red-900"
                      : "bg-green-100 dark:bg-green-900"
                  }`}
                >
                  {result.status === "abnormal" ? (
                    <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
                  ) : (
                    <MdScience className="h-6 w-6 text-green-600 dark:text-green-300" />
                  )}
                </div>
                <div>
                  <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                    {result.testName}
                  </h5>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {result.lab}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {result.priority && (
                <div className="flex items-center gap-1">
                  <div
                    className={`h-2 w-2 rounded-full ${getPriorityColor(
                      result.priority
                    )}`}
                  />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {result.priority}
                  </span>
                </div>
              )}
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                  result.status
                )}`}
              >
                {result.status}
              </span>
            </div>
          </div>

          {/* Date & Doctor Info */}
          <div className="mb-4 rounded-xl bg-gradient-to-r from-brand-50 to-blue-50 p-4 dark:from-brand-900/20 dark:to-blue-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Test Date
                  </div>
                  <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                    {new Date(result.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Ordered By
                  </div>
                  <div className="mt-1 text-lg font-bold text-navy-700 dark:text-white">
                    {result.doctor}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          {result.summary && (
            <div className="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-navy-900">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Summary
              </div>
              <div className="mt-1 text-sm text-navy-700 dark:text-white">
                {result.summary}
              </div>
            </div>
          )}

          {/* Key Results Preview */}
          {result.details && (
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(result.details)
                .slice(0, 2)
                .map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                      <MdInfo className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-navy-700 dark:text-white">
                        {value}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Abnormal Result Warning */}
          {result.status === "abnormal" && (
            <div className="mb-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-2">
                <MdWarning className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600 dark:text-yellow-500" />
                <div>
                  <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-300">
                    Follow-up Recommended
                  </div>
                  <div className="mt-1 text-sm text-yellow-900 dark:text-yellow-200">
                    {result.details?.recommendation ||
                      "Please consult with your healthcare provider"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleViewDetails(result)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
            >
              <MdInfo className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={() => handleDownloadResult(result)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
            >
              <MdDownload className="h-4 w-4" />
              Download
            </button>
            <button
              onClick={() => handleShareResult(result)}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
            >
              <MdShare className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="h-full">
      {/* Share Modal */}
      <Modal
        isOpen={modalState.share}
        onClose={() => setModalState({ ...modalState, share: false })}
        title="Share Lab Results"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900">
              <MdShare className="h-8 w-8 text-brand-600 dark:text-brand-300" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Share {selectedResult?.testName}
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Select how you'd like to share these results
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => confirmShare("Email")}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                <MdEmail className="h-6 w-6 text-red-600 dark:text-red-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-navy-700 dark:text-white">
                  Email
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Send as secure email attachment
                </div>
              </div>
            </button>

            <button
              onClick={() => confirmShare("Print")}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                <MdPrint className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-navy-700 dark:text-white">
                  Print
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Print physical copy
                </div>
              </div>
            </button>

            <button
              onClick={() => confirmShare("Download")}
              className="flex w-full items-center gap-3 rounded-xl border-2 border-gray-200 p-4 transition-all hover:border-brand-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-800"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                <MdDownload className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-navy-700 dark:text-white">
                  Download & Share
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Download PDF to share manually
                </div>
              </div>
            </button>
          </div>

          <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <MdWarning className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Privacy Notice:</strong> Lab results contain sensitive
                health information. Only share with trusted healthcare
                providers.
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setModalState({ ...modalState, share: false })}
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        title={selectedResult?.testName || "Lab Results"}
        size="lg"
      >
        {selectedResult && (
          <div className="space-y-6">
            <div className="rounded-xl bg-gradient-to-r from-brand-50 to-blue-50 p-6 dark:from-brand-900/20 dark:to-blue-900/20">
              <h4 className="mb-4 text-xl font-bold text-navy-700 dark:text-white">
                {selectedResult.testName}
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Lab
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {selectedResult.lab}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-600 dark:text-gray-400">
                    Status
                  </div>
                  <div className="mt-1">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${getStatusColor(
                        selectedResult.status
                      )}`}
                    >
                      {selectedResult.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdCalendarToday className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Test Date
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {new Date(selectedResult.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaFileMedical className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-500">
                    Ordered By
                  </div>
                  <div className="mt-1 font-semibold text-navy-700 dark:text-white">
                    {selectedResult.doctor}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Summary
              </h5>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-900">
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
                    <span className="font-medium text-navy-700 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {selectedResult.attachment && (
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
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
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalState({ ...modalState, details: false })}
                className="rounded-lg border-2 border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => handleDownloadResult(selectedResult)}
                className="rounded-lg bg-brand-500 px-6 py-2 font-semibold text-white hover:bg-brand-600"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>

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
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
            <MdScience className="h-full w-full text-green-500" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400 to-green-600">
              <MdScience className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Normal Results
              </div>
              <div className="text-3xl font-bold text-navy-700 dark:text-white">
                {labResults.filter((r) => r.status === "normal").length}
              </div>
            </div>
          </div>
        </Card>

        <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
            <MdTrendingUp className="h-full w-full text-yellow-500" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600">
              <MdTrendingUp className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Abnormal Results
              </div>
              <div className="text-3xl font-bold text-navy-700 dark:text-white">
                {labResults.filter((r) => r.status === "abnormal").length}
              </div>
            </div>
          </div>
        </Card>

        <Card extra="group relative overflow-hidden p-6 hover:shadow-lg transition-all">
          <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-10">
            <MdCalendarToday className="h-full w-full text-blue-500" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
              <MdCalendarToday className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Latest Results
              </div>
              <div className="text-sm font-bold text-navy-700 dark:text-white">
                {labResults.length > 0
                  ? new Date(labResults[0].date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "None"}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="relative">
            <MdSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by test name, lab, or doctor..."
              className="w-full rounded-xl border-2 border-gray-300 bg-white py-3 pl-12 pr-4 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-600 dark:bg-navy-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-6 py-3 font-semibold transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:hover:bg-navy-700"
          >
            <MdFilterList className="h-5 w-5" />
            Filter
          </button>
          <button
            onClick={handleUploadResult}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            <MdAdd className="h-5 w-5" />
            Upload Results
          </button>
        </div>
      </div>

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
            <LabResultCard key={result.id} result={result} />
          ))
        )}
      </div>

      {/* Information Section */}
      <div className="mt-8">
        <Card extra="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
              <MdInfo className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <h5 className="mb-3 font-bold text-blue-700 dark:text-blue-300">
                Understanding Your Lab Results
              </h5>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                    <span>
                      <strong>Reference ranges</strong> vary by lab and testing
                      method
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                    <span>
                      <strong>Abnormal results</strong> don't always mean
                      disease
                    </span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-400">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                    <span>
                      <strong>Discuss results</strong> with your healthcare
                      provider
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                    <span>
                      <strong>Track trends</strong> over time for better
                      understanding
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LabResults;
