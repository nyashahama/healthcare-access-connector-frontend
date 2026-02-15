import React, { useState } from "react";
import Modal from "components/modal/Modal";
import {
  MdRefresh,
  MdShare,
  MdDownload,
  MdPrint,
  MdAdd,
  MdInfo,
  MdWarning,
  MdCheckCircle,
  MdContentCopy,
  MdMedicalServices,
  MdLocalPharmacy,
  MdAccessTime,
  MdEmail,
  MdWhatsapp,
  MdCopyAll,
} from "react-icons/md";
import { FaPrescription, FaRegFilePdf } from "react-icons/fa";

// ===== Details Modal =====
export const PrescriptionDetailsModal = ({
  isOpen,
  onClose,
  prescription,
  onRequestRefill,
  copyRxNumber,
}) => {
  if (!prescription) return null;

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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="space-y-6 py-4">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
            <FaPrescription className="h-8 w-8 text-white" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-navy-700 dark:text-white">
            {prescription.medication}
          </h3>
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <FaPrescription className="h-4 w-4" />
            <span className="text-sm">{prescription.rxNumber}</span>
          </div>
        </div>

        {/* Status & Quick Actions */}
        <div className="flex items-center justify-center gap-4">
          <span
            className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wide ${getStatusColor(
              prescription.status
            )}`}
          >
            {prescription.status}
          </span>
          <button
            onClick={() => copyRxNumber(prescription.rxNumber)}
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
              {prescription.quantity}
            </div>
          </div>
          <div className="rounded-xl border-2 border-gray-200 p-4 text-center dark:border-gray-700">
            <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Refills Left
            </div>
            <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
              {prescription.refills}
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
                {prescription.doctor}
              </div>
              {prescription.doctorSpecialty && (
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {prescription.doctorSpecialty}
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
                {prescription.pharmacy}
              </div>
              {prescription.pharmacyAddress && (
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {prescription.pharmacyAddress}
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
                {new Date(prescription.date).toLocaleDateString()} -{" "}
                {new Date(prescription.expiry).toLocaleDateString()}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {prescription.daysSupply} days supply
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
              {prescription.instructions}
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
              {prescription.warnings}
            </p>
            {prescription.sideEffects && (
              <div className="mt-2 text-sm text-yellow-800 dark:text-yellow-300">
                <strong>Side Effects:</strong> {prescription.sideEffects}
              </div>
            )}
          </div>

          {prescription.medicalAidCovered !== undefined && (
            <div
              className={`rounded-xl border-2 p-4 ${
                prescription.medicalAidCovered
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {prescription.medicalAidCovered ? (
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
                    prescription.medicalAidCovered
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {prescription.medicalAidCovered ? "COVERED" : "SELF-PAY"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Close
          </button>
          {prescription.refills > 0 && (
            <button
              onClick={() => {
                onClose();
                onRequestRefill(prescription);
              }}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
            >
              Request Refill
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ===== Refill Modal =====
export const RefillModal = ({ isOpen, onClose, prescription, onConfirm }) => {
  const [refillMethod, setRefillMethod] = useState("pharmacy");

  if (!prescription) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600">
            <MdRefresh className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Request Refill
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {prescription.medication}
          </p>
        </div>

        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 p-4 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                RX Number
              </span>
              <span className="font-semibold text-navy-700 dark:text-white">
                {prescription.rxNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pharmacy</span>
              <span className="font-semibold text-navy-700 dark:text-white">
                {prescription.pharmacy}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Refills Left
              </span>
              <span className="font-semibold text-navy-700 dark:text-white">
                {prescription.refills}
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
                  {prescription.pharmacy} will notify you when ready
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
              within 2-4 hours. You'll receive an SMS when ready for collection.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(refillMethod)}
            className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
          >
            Request Refill
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== Share Modal =====
export const ShareModal = ({ isOpen, onClose, prescription, onConfirm }) => {
  const [shareMethod, setShareMethod] = useState("whatsapp");

  if (!prescription) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600">
            <MdShare className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Share Prescription
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {prescription.medication}
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
              <strong>Privacy Note:</strong> Only share your prescription with
              authorized healthcare providers or pharmacies.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(shareMethod)}
            className="flex-1 rounded-xl bg-gradient-to-r from-green-500 to-green-600 py-3 font-semibold text-white transition-all hover:from-green-600 hover:to-green-700 hover:shadow-lg"
          >
            Share Now
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== Download Modal =====
export const DownloadModal = ({ isOpen, onClose, prescription, onConfirm }) => {
  const [downloadFormat, setDownloadFormat] = useState("pdf");

  if (!prescription) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-purple-600">
            <MdDownload className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Download Prescription
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {prescription.medication}
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
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(downloadFormat)}
            className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 py-3 font-semibold text-white transition-all hover:from-purple-600 hover:to-purple-700 hover:shadow-lg"
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== Print Modal =====
export const PrintModal = ({ isOpen, onClose, prescription, onConfirm }) => {
  if (!prescription) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="space-y-6 py-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600">
            <MdPrint className="h-8 w-8 text-white" />
          </div>
          <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
            Print Prescription
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            {prescription.medication}
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
              Your printer will open automatically. Please ensure your printer
              is connected and has paper.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 py-3 font-semibold text-white transition-all hover:from-orange-600 hover:to-orange-700 hover:shadow-lg"
          >
            Print Now
          </button>
        </div>
      </div>
    </Modal>
  );
};

// ===== New Prescription Request Modal =====
export const NewRequestModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
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
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 py-3 font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
          >
            Submit Request
          </button>
        </div>
      </div>
    </Modal>
  );
};
