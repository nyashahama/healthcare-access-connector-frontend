import React, { useState, useEffect } from "react";
import {
  MdLocalPharmacy,
  MdAccessTime,
  MdCalendarToday,
  MdDownload,
  MdShare,
  MdWarning,
  MdInfo,
  MdCheckCircle,
  MdPrint,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdClose,
  MdRefresh,
  MdEmail,
  MdWhatsapp,
  MdCopyAll,
  MdArrowForward,
  MdArrowBack,
  MdContentCopy,
  MdVisibility,
  MdMedicalServices,
} from "react-icons/md";
import { FaPrescription, FaPills, FaRegFilePdf } from "react-icons/fa";
import { SiGoogledocs } from "react-icons/si";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const Prescriptions = () => {
  const [view, setView] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [modalState, setModalState] = useState({
    details: false,
    refill: false,
    share: false,
    download: false,
    print: false,
    newRequest: false,
  });
  const [refillMethod, setRefillMethod] = useState("pharmacy");
  const [shareMethod, setShareMethod] = useState("whatsapp");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const { showToast } = useToast();

  const prescriptions = {
    active: [
      {
        id: 1,
        medication: "Amoxicillin 250mg",
        dosage: "5ml every 8 hours",
        doctor: "Dr. Sarah Johnson",
        doctorSpecialty: "Pediatrician",
        date: "2024-01-10",
        expiry: "2024-02-10",
        quantity: "100ml",
        refills: 0,
        pharmacy: "Community Pharmacy",
        pharmacyAddress: "123 Health St, Johannesburg",
        instructions: "Take after meals. Complete full 7-day course.",
        sideEffects: "Nausea, diarrhea, rash",
        warnings: "Do not take if allergic to penicillin",
        status: "active",
        rxNumber: "RX-2024-00123",
        medicalAidCovered: true,
        daysSupply: 7,
      },
      {
        id: 2,
        medication: "Paracetamol 500mg",
        dosage: "1 tablet every 6 hours",
        doctor: "Dr. Michael Smith",
        doctorSpecialty: "General Practitioner",
        date: "2024-01-05",
        expiry: "2024-04-05",
        quantity: "20 tablets",
        refills: 2,
        pharmacy: "City Pharmacy",
        pharmacyAddress: "456 Main Rd, Sandton",
        instructions:
          "For fever and pain. Do not exceed 4 tablets in 24 hours.",
        sideEffects: "Rare - may cause liver damage if overdosed",
        warnings: "Consult doctor if symptoms persist beyond 3 days",
        status: "active",
        rxNumber: "RX-2024-00124",
        medicalAidCovered: true,
        daysSupply: 10,
      },
      {
        id: 3,
        medication: "Vitamin D3 1000IU",
        dosage: "1 capsule daily with food",
        doctor: "Dr. Lerato Molefe",
        doctorSpecialty: "Nutritionist",
        date: "2024-01-12",
        expiry: "2024-07-12",
        quantity: "90 capsules",
        refills: 5,
        pharmacy: "Wellness Pharmacy",
        pharmacyAddress: "789 Wellness Ave, Randburg",
        instructions: "Take with breakfast for better absorption",
        sideEffects: "None expected at recommended dosage",
        warnings: "Keep out of reach of children",
        status: "active",
        rxNumber: "RX-2024-00125",
        medicalAidCovered: false,
        daysSupply: 90,
      },
    ],
    expired: [
      {
        id: 4,
        medication: "Cough Syrup (Dextromethorphan)",
        dosage: "10ml every 12 hours",
        doctor: "Dr. Online Consultant",
        doctorSpecialty: "Telemedicine",
        date: "2024-11-01",
        expiry: "2024-12-01",
        quantity: "120ml",
        refills: 0,
        pharmacy: "Virtual Pharmacy",
        pharmacyAddress: "Online",
        instructions: "Shake well before use. Do not drive after taking.",
        sideEffects: "Drowsiness, dizziness",
        warnings: "Do not take with alcohol",
        status: "expired",
        rxNumber: "RX-2024-00126",
        medicalAidCovered: true,
        daysSupply: 12,
      },
    ],
    requested: [
      {
        id: 5,
        medication: "Vitamin D Drops 400IU",
        dosage: "0.5ml daily",
        doctor: "Dr. Sarah Johnson",
        doctorSpecialty: "Pediatrician",
        date: "2024-01-14",
        status: "pending",
        estimatedReady: "Tomorrow, 2 PM",
        pharmacy: "Community Pharmacy",
        requestId: "REQ-2024-001",
        refillFor: "RX-2024-00123",
      },
    ],
  };

  const filteredPrescriptions = prescriptions[view].filter(
    (prescription) =>
      prescription.medication
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.rxNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestRefill = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, refill: true }));
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, details: true }));
  };

  const handleSharePrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, share: true }));
  };

  const handleDownloadPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, download: true }));
  };

  const handlePrintPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, print: true }));
  };

  const handleNewPrescriptionRequest = () => {
    setModalState((prev) => ({ ...prev, newRequest: true }));
  };

  const confirmRefill = () => {
    setModalState((prev) => ({ ...prev, refill: false }));
    showToast(
      `Refill request sent to ${selectedPrescription.pharmacy}`,
      "success"
    );
  };

  const confirmShare = () => {
    setModalState((prev) => ({ ...prev, share: false }));
    showToast(`Prescription shared via ${shareMethod}`, "success");
  };

  const confirmDownload = () => {
    setModalState((prev) => ({ ...prev, download: false }));
    showToast(
      `Prescription downloaded as ${downloadFormat.toUpperCase()}`,
      "success"
    );
  };

  const confirmPrint = () => {
    setModalState((prev) => ({ ...prev, print: false }));
    showToast("Printing prescription...", "info");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const confirmNewRequest = () => {
    setModalState((prev) => ({ ...prev, newRequest: false }));
    showToast("Prescription request submitted to your doctor", "success");
  };

  const copyRxNumber = () => {
    if (selectedPrescription?.rxNumber) {
      navigator.clipboard.writeText(selectedPrescription.rxNumber);
      showToast("RX Number copied to clipboard", "info");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <>
      {/* Prescription Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState((prev) => ({ ...prev, details: false }))}
        title=""
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6 py-4">
            {/* Header */}
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <FaPrescription className="h-8 w-8 text-white" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
                {selectedPrescription.medication}
              </h3>
              <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
                <FaPrescription className="h-4 w-4" />
                <span className="text-sm">{selectedPrescription.rxNumber}</span>
              </div>
            </div>

            {/* Status & Quick Actions */}
            <div className="flex items-center justify-center gap-4">
              <span
                className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide ${getStatusColor(
                  selectedPrescription.status
                )}`}
              >
                {selectedPrescription.status}
              </span>
              <button
                onClick={copyRxNumber}
                className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
              >
                <MdContentCopy className="h-4 w-4" />
                Copy RX
              </button>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Quantity
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {selectedPrescription.quantity}
                </div>
              </div>
              <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Refills Left
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {selectedPrescription.refills}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MdMedicalServices className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Prescribing Doctor
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedPrescription.doctor}
                  </div>
                  {selectedPrescription.doctorSpecialty && (
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedPrescription.doctorSpecialty}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <MdLocalPharmacy className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Pharmacy
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {selectedPrescription.pharmacy}
                  </div>
                  {selectedPrescription.pharmacyAddress && (
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedPrescription.pharmacyAddress}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <MdAccessTime className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Validity Period
                  </div>
                  <div className="mt-1 font-bold text-navy-700 dark:text-white">
                    {new Date(selectedPrescription.date).toLocaleDateString()} -{" "}
                    {new Date(selectedPrescription.expiry).toLocaleDateString()}
                  </div>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {selectedPrescription.daysSupply} days supply
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions & Warnings */}
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <MdInfo className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h5 className="font-bold text-blue-900 dark:text-blue-300">
                    Dosage Instructions
                  </h5>
                </div>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  {selectedPrescription.instructions}
                </p>
              </div>

              <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <div className="mb-2 flex items-center gap-2">
                  <MdWarning className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                  <h5 className="font-bold text-yellow-900 dark:text-yellow-300">
                    Important Warnings
                  </h5>
                </div>
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  {selectedPrescription.warnings}
                </p>
                {selectedPrescription.sideEffects && (
                  <div className="mt-2 text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Side Effects:</strong>{" "}
                    {selectedPrescription.sideEffects}
                  </div>
                )}
              </div>

              {selectedPrescription.medicalAidCovered !== undefined && (
                <div
                  className={`rounded-xl border-2 p-4 ${
                    selectedPrescription.medicalAidCovered
                      ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                      : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {selectedPrescription.medicalAidCovered ? (
                        <MdCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <MdInfo className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                      <span className="font-semibold text-navy-700 dark:text-white">
                        Medical Aid Coverage
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        selectedPrescription.medicalAidCovered
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {selectedPrescription.medicalAidCovered
                        ? "COVERED"
                        : "SELF-PAY"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, details: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Close
              </button>
              {selectedPrescription.refills > 0 && (
                <button
                  onClick={() => {
                    setModalState((prev) => ({
                      ...prev,
                      details: false,
                      refill: true,
                    }));
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                >
                  Request Refill
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Refill Request Modal */}
      <Modal
        isOpen={modalState.refill}
        onClose={() => setModalState((prev) => ({ ...prev, refill: false }))}
        title=""
        size="md"
      >
        {selectedPrescription && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
                <MdRefresh className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Request Refill
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedPrescription.medication}
              </p>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    RX Number
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedPrescription.rxNumber}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Pharmacy
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedPrescription.pharmacy}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Refills Left
                  </span>
                  <span className="font-semibold text-navy-700 dark:text-white">
                    {selectedPrescription.refills}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Refill Method
              </label>
              <div className="space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                  <input
                    type="radio"
                    name="refillMethod"
                    value="pharmacy"
                    checked={refillMethod === "pharmacy"}
                    onChange={(e) => setRefillMethod(e.target.value)}
                    className="mt-1 h-5 w-5 text-brand-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy-700 dark:text-white">
                      Request at Pharmacy
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {selectedPrescription.pharmacy} will notify you when ready
                    </div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-gray-200 p-4 transition-colors hover:border-brand-300 dark:border-gray-700">
                  <input
                    type="radio"
                    name="refillMethod"
                    value="delivery"
                    checked={refillMethod === "delivery"}
                    onChange={(e) => setRefillMethod(e.target.value)}
                    className="mt-1 h-5 w-5 text-brand-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-navy-700 dark:text-white">
                      Home Delivery
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      R50 delivery fee. Same-day delivery available
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {refillMethod === "delivery" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Delivery Address
                </label>
                <textarea
                  placeholder="Enter your delivery address..."
                  className="h-24 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
                  defaultValue="123 Main Street, Johannesburg, 2000"
                />
              </div>
            )}

            <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <MdInfo className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Processing Time:</strong> Refills are typically ready
                  within 2-4 hours. You'll receive an SMS when ready for
                  collection.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, refill: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefill}
                className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
              >
                Request Refill
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Share Prescription Modal */}
      <Modal
        isOpen={modalState.share}
        onClose={() => setModalState((prev) => ({ ...prev, share: false }))}
        title=""
        size="md"
      >
        {selectedPrescription && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
                <MdShare className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Share Prescription
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedPrescription.medication}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShareMethod("whatsapp")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  shareMethod === "whatsapp"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-gray-200 hover:border-green-300 dark:border-gray-700"
                }`}
              >
                <MdWhatsapp className="h-8 w-8 text-green-500" />
                <span className="text-sm font-semibold">WhatsApp</span>
              </button>

              <button
                onClick={() => setShareMethod("email")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  shareMethod === "email"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-blue-300 dark:border-gray-700"
                }`}
              >
                <MdEmail className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-semibold">Email</span>
              </button>

              <button
                onClick={() => setShareMethod("copy")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  shareMethod === "copy"
                    ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                    : "border-gray-200 hover:border-purple-300 dark:border-gray-700"
                }`}
              >
                <MdCopyAll className="h-8 w-8 text-purple-500" />
                <span className="text-sm font-semibold">Copy Link</span>
              </button>

              <button
                onClick={() => setShareMethod("qr")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  shareMethod === "qr"
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                    : "border-gray-200 hover:border-brand-300 dark:border-gray-700"
                }`}
              >
                <MdShare className="h-8 w-8 text-brand-500" />
                <span className="text-sm font-semibold">QR Code</span>
              </button>
            </div>

            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <MdWarning className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Privacy Note:</strong> Only share your prescription
                  with authorized healthcare providers or pharmacies.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, share: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmShare}
                className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
              >
                Share Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Download Prescription Modal */}
      <Modal
        isOpen={modalState.download}
        onClose={() => setModalState((prev) => ({ ...prev, download: false }))}
        title=""
        size="md"
      >
        {selectedPrescription && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
                <MdDownload className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Download Prescription
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedPrescription.medication}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setDownloadFormat("pdf")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  downloadFormat === "pdf"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 hover:border-red-300 dark:border-gray-700"
                }`}
              >
                <FaRegFilePdf className="h-8 w-8 text-red-500" />
                <span className="text-sm font-semibold">PDF</span>
                <span className="text-xs text-gray-500">Best for print</span>
              </button>

              <button
                onClick={() => setDownloadFormat("image")}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  downloadFormat === "image"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-blue-300 dark:border-gray-700"
                }`}
              >
                <MdCopyAll className="h-8 w-8 text-blue-500" />
                <span className="text-sm font-semibold">Image</span>
                <span className="text-xs text-gray-500">PNG / JPEG</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Doctor Details
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded text-brand-500"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Pharmacy Info
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded text-brand-500"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Include Warnings
                </span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-5 w-5 rounded text-brand-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, download: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDownload}
                className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
              >
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Print Prescription Modal */}
      <Modal
        isOpen={modalState.print}
        onClose={() => setModalState((prev) => ({ ...prev, print: false }))}
        title=""
        size="sm"
      >
        {selectedPrescription && (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
                <MdPrint className="h-8 w-8 text-white" />
              </div>
              <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
                Print Prescription
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedPrescription.medication}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Print Format
                </span>
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1 dark:border-gray-600 dark:bg-navy-800">
                  <option>Standard (A4)</option>
                  <option>Receipt Size</option>
                  <option>Wallet Size</option>
                </select>
              </div>
              <div className="flex items-center justify-between rounded-xl border-2 border-gray-200 p-4 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Copies
                </span>
                <div className="flex items-center gap-2">
                  <button className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50 dark:border-gray-600">
                    -
                  </button>
                  <span className="w-8 text-center">1</span>
                  <button className="rounded-lg border border-gray-300 px-3 py-1 hover:bg-gray-50 dark:border-gray-600">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-start gap-3">
                <MdCheckCircle className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
                <p className="text-sm text-green-800 dark:text-green-300">
                  Your printer will open automatically. Please ensure your
                  printer is connected and has paper.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setModalState((prev) => ({ ...prev, print: false }))
                }
                className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmPrint}
                className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
              >
                Print Now
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Prescription Request Modal */}
      <Modal
        isOpen={modalState.newRequest}
        onClose={() =>
          setModalState((prev) => ({ ...prev, newRequest: false }))
        }
        title=""
        size="lg"
      >
        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600">
              <MdAdd className="h-8 w-8 text-white" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              New Prescription Request
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Request a new prescription from your doctor
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Medication Name *
              </label>
              <input
                type="text"
                placeholder="Enter medication name..."
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Reason for Request *
              </label>
              <textarea
                placeholder="Why do you need this medication?..."
                className="h-32 w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Select Doctor
                </label>
                <select className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900">
                  <option>Dr. Sarah Johnson (Pediatrician)</option>
                  <option>Dr. Michael Smith (General Practitioner)</option>
                  <option>Dr. Online Consultant (Telemedicine)</option>
                  <option>Any Available Doctor</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Urgency
                </label>
                <select className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900">
                  <option>Normal (24-48 hours)</option>
                  <option>Urgent (Same Day)</option>
                  <option>Emergency (Immediate)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Preferred Pharmacy
              </label>
              <select className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900">
                <option>Community Pharmacy</option>
                <option>City Pharmacy</option>
                <option>Wellness Pharmacy</option>
                <option>Any Pharmacy Near Me</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border-2 border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
            <div className="flex items-start gap-3">
              <MdInfo className="mt-0.5 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Note:</strong> Your doctor will review this request and
                may contact you for additional information before approving the
                prescription.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setModalState((prev) => ({ ...prev, newRequest: false }))
              }
              className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={confirmNewRequest}
              className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
            >
              Submit Request
            </button>
          </div>
        </div>
      </Modal>

      {/* Main Component */}
      <div className="rounded-[20px] bg-white p-6 shadow-sm dark:bg-navy-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h5 className="text-xl font-bold text-navy-700 dark:text-white">
              My Prescriptions
            </h5>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {filteredPrescriptions.length} prescription
              {filteredPrescriptions.length !== 1 ? "s" : ""} {view}
            </p>
          </div>
          <button
            onClick={handleNewPrescriptionRequest}
            className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            <MdAdd className="mr-2 inline h-4 w-4" />
            New Request
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="relative">
              <MdSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions by medication, doctor, or RX number..."
                className="w-full rounded-xl border-2 border-gray-200 bg-white py-3 pl-12 pr-4 transition-colors focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-navy-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-navy-800 dark:text-gray-200">
              <MdFilterList className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 rounded-xl bg-gray-100 p-1 dark:bg-navy-700">
            {["active", "requested", "expired"].map((tab) => (
              <button
                key={tab}
                onClick={() => setView(tab)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all ${
                  view === tab
                    ? "bg-white text-brand-500 shadow-sm dark:bg-navy-800"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400"
                }`}
              >
                {tab} ({prescriptions[tab].length})
              </button>
            ))}
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-navy-700">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-navy-600">
                <FaPrescription className="h-8 w-8 text-gray-400" />
              </div>
              <h4 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                No Prescriptions Found
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery
                  ? "Try a different search term"
                  : `No ${view} prescriptions found`}
              </p>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="group relative overflow-hidden rounded-xl border-2 border-gray-200 p-5 transition-all duration-300 hover:border-brand-500 hover:shadow-lg dark:border-navy-700 dark:hover:border-brand-500"
              >
                {/* Gradient accent on hover */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand-500 to-purple-500 opacity-0 transition-opacity group-hover:opacity-100"></div>

                {/* Background pattern */}
                <div className="absolute right-0 top-0 h-24 w-24 -translate-y-6 translate-x-6 opacity-5">
                  <FaPrescription className="h-full w-full text-brand-500" />
                </div>

                <div className="relative">
                  {/* Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-purple-600">
                          <FaPrescription className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h6 className="text-lg font-bold text-navy-700 dark:text-white">
                            {prescription.medication}
                          </h6>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {prescription.dosage}
                            </span>
                            {prescription.rxNumber && (
                              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-navy-700 dark:text-gray-300">
                                {prescription.rxNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                        <MdMedicalServices className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Doctor
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                          {prescription.doctor}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                        <MdLocalPharmacy className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          Pharmacy
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                          {prescription.pharmacy}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-navy-700">
                        <MdAccessTime className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {prescription.expiry ? "Expires" : "Estimated Ready"}
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-navy-700 dark:text-white">
                          {prescription.expiry
                            ? new Date(prescription.expiry).toLocaleDateString()
                            : prescription.estimatedReady}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleViewDetails(prescription)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-800 dark:text-gray-200 dark:hover:bg-navy-700"
                    >
                      <MdVisibility className="h-4 w-4" />
                      Details
                    </button>

                    {view === "active" && prescription.refills > 0 && (
                      <button
                        onClick={() => handleRequestRefill(prescription)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-blue-300 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                      >
                        <MdRefresh className="h-4 w-4" />
                        Refill ({prescription.refills} left)
                      </button>
                    )}

                    <button
                      onClick={() => handleSharePrescription(prescription)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-green-300 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition-all hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
                    >
                      <MdShare className="h-4 w-4" />
                      Share
                    </button>

                    <button
                      onClick={() => handleDownloadPrescription(prescription)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-purple-300 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition-all hover:bg-purple-100 dark:border-purple-700 dark:bg-purple-900/20 dark:text-purple-300"
                    >
                      <MdDownload className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Information Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
            <div className="flex items-start gap-3">
              <MdWarning className="mt-0.5 h-6 w-6 text-red-600 dark:text-red-400" />
              <div>
                <h5 className="font-bold text-red-900 dark:text-red-300">
                  Medication Safety
                </h5>
                <ul className="mt-2 space-y-1 text-sm text-red-800 dark:text-red-400">
                  <li>• Always take medications as prescribed</li>
                  <li>• Never share your prescriptions with others</li>
                  <li>• Store medications in a cool, dry place</li>
                  <li>• Check expiry dates before taking any medication</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
            <div className="flex items-start gap-3">
              <MdInfo className="mt-0.5 h-6 w-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h5 className="font-bold text-blue-900 dark:text-blue-300">
                  Prescription Tips
                </h5>
                <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-400">
                  <li>• Request refills 3 days before running out</li>
                  <li>• Bring empty container for controlled substances</li>
                  <li>• Check medical aid coverage before purchasing</li>
                  <li>• Keep a digital copy as backup</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescriptions;
