import React, { useState } from "react";
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
} from "react-icons/md";
import { FaPrescription, FaPills } from "react-icons/fa";
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
  });
  const { showToast } = useToast();

  const prescriptions = {
    active: [
      {
        id: 1,
        medication: "Amoxicillin 250mg",
        dosage: "5ml every 8 hours",
        doctor: "Dr. Sarah Johnson",
        date: "2024-01-10",
        expiry: "2024-02-10",
        quantity: "100ml",
        refills: 0,
        pharmacy: "Community Pharmacy",
        instructions: "Take after meals. Complete full course.",
        sideEffects: "Nausea, diarrhea",
        status: "active",
      },
      {
        id: 2,
        medication: "Paracetamol 500mg",
        dosage: "1 tablet every 6 hours",
        doctor: "Dr. Michael Smith",
        date: "2024-01-05",
        expiry: "2024-04-05",
        quantity: "20 tablets",
        refills: 2,
        pharmacy: "City Pharmacy",
        instructions:
          "For fever and pain. Do not exceed 4 tablets in 24 hours.",
        sideEffects: "Rare",
        status: "active",
      },
    ],
    expired: [
      {
        id: 3,
        medication: "Cough Syrup",
        dosage: "10ml every 12 hours",
        doctor: "Dr. Online Consultant",
        date: "2024-11-01",
        expiry: "2024-12-01",
        quantity: "120ml",
        refills: 0,
        pharmacy: "Virtual Pharmacy",
        instructions: "Shake well before use",
        status: "expired",
      },
    ],
    requested: [
      {
        id: 4,
        medication: "Vitamin D Drops",
        dosage: "0.5ml daily",
        doctor: "Dr. Sarah Johnson",
        date: "2024-01-14",
        status: "pending",
        estimatedReady: "Tomorrow, 2 PM",
      },
    ],
  };

  const handleRequestRefill = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState({ ...modalState, refill: true });
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState({ ...modalState, details: true });
  };

  const handleSharePrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState({ ...modalState, share: true });
  };

  const handleDownloadPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState({ ...modalState, download: true });
  };

  const confirmRefill = () => {
    setModalState({ ...modalState, refill: false });
    showToast("Refill request sent to pharmacy", "success");
  };

  const confirmShare = (method) => {
    setModalState({ ...modalState, share: false });
    showToast(`Prescription shared via ${method}`, "success");
  };

  const confirmDownload = () => {
    setModalState({ ...modalState, download: false });
    showToast("Prescription downloaded as PDF", "success");
  };

  const PrescriptionCard = ({ prescription }) => (
    <Card extra="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-bold text-navy-700 dark:text-white">
                {prescription.medication}
              </h5>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {prescription.dosage}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                prescription.status === "active"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : prescription.status === "pending"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {prescription.status.charAt(0).toUpperCase() +
                prescription.status.slice(1)}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <MdCalendarToday className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">
                Prescribed: {new Date(prescription.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <FaPrescription className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">Dr. {prescription.doctor}</span>
            </div>
            <div className="flex items-center">
              <MdLocalPharmacy className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">{prescription.pharmacy}</span>
            </div>
            <div className="flex items-center">
              <FaPills className="mr-2 h-4 w-4 text-gray-400" />
              <span className="text-sm">{prescription.quantity}</span>
            </div>
          </div>

          {view === "active" && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleViewDetails(prescription)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 dark:border-gray-600"
              >
                View Details
              </button>
              {prescription.refills > 0 && (
                <button
                  onClick={() => handleRequestRefill(prescription)}
                  className="flex-1 rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  Request Refill
                </button>
              )}
              <button
                onClick={() => handleSharePrescription(prescription)}
                className="flex-1 rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-700 hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300"
              >
                <MdShare className="mr-1 inline h-4 w-4" />
                Share
              </button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full">
      {/* Modals */}
      {/* Prescription Details Modal */}
      <Modal
        isOpen={modalState.details}
        onClose={() => setModalState({ ...modalState, details: false })}
        title="Prescription Details"
        size="lg"
      >
        {selectedPrescription && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                  {selectedPrescription.medication}
                </h4>
                <div className="mt-2 text-lg font-medium text-gray-600 dark:text-gray-300">
                  {selectedPrescription.dosage}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Expires</div>
                <div className="font-medium">
                  {new Date(selectedPrescription.expiry).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="text-sm text-gray-500">Prescribed By</div>
                <div className="font-medium">{selectedPrescription.doctor}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="text-sm text-gray-500">Pharmacy</div>
                <div className="font-medium">
                  {selectedPrescription.pharmacy}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="text-sm text-gray-500">Quantity</div>
                <div className="font-medium">
                  {selectedPrescription.quantity}
                </div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <div className="text-sm text-gray-500">Refills Left</div>
                <div className="font-medium">
                  {selectedPrescription.refills}
                </div>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Instructions
              </h5>
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <p className="text-blue-700 dark:text-blue-300">
                  {selectedPrescription.instructions}
                </p>
              </div>
            </div>

            <div>
              <h5 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Possible Side Effects
              </h5>
              <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-yellow-700 dark:text-yellow-300">
                  {selectedPrescription.sideEffects}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalState({ ...modalState, details: false })}
                className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50 dark:border-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setModalState({
                    ...modalState,
                    details: false,
                    download: true,
                  });
                }}
                className="rounded-lg bg-brand-500 px-6 py-2 text-white hover:bg-brand-600"
              >
                <MdDownload className="mr-2 inline h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
          My Prescriptions
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your medications and refills
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search medications..."
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
            <MdAdd className="mr-2 h-4 w-4" />
            New Prescription
          </button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 dark:bg-navy-700">
          {["active", "requested", "expired"].map((tab) => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              className={`flex-1 rounded-md py-2 text-sm font-medium capitalize transition-colors ${
                view === tab
                  ? "bg-white text-brand-500 shadow dark:bg-navy-800"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300"
              }`}
            >
              {tab} ({prescriptions[tab].length})
            </button>
          ))}
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions[view].length === 0 ? (
          <Card extra="p-6 text-center">
            <FaPrescription className="mx-auto h-12 w-12 text-gray-400" />
            <h4 className="mt-4 text-lg font-bold text-navy-700 dark:text-white">
              No prescriptions found
            </h4>
            <p className="mt-2 text-gray-600">
              {view === "active"
                ? "You don't have any active prescriptions"
                : `No ${view} prescriptions`}
            </p>
          </Card>
        ) : (
          prescriptions[view].map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
            />
          ))
        )}
      </div>

      {/* Important Information */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card extra="p-4">
          <div className="flex items-start">
            <MdWarning className="mr-3 h-5 w-5 text-red-500" />
            <div>
              <h5 className="font-bold text-red-700 dark:text-red-300">
                Medication Safety
              </h5>
              <ul className="mt-2 space-y-1 text-sm text-red-600 dark:text-red-400">
                <li>• Take medications as prescribed</li>
                <li>• Do not share prescriptions</li>
                <li>• Store in a cool, dry place</li>
                <li>• Check expiry dates regularly</li>
              </ul>
            </div>
          </div>
        </Card>
        <Card extra="p-4">
          <div className="flex items-start">
            <MdInfo className="mr-3 h-5 w-5 text-blue-500" />
            <div>
              <h5 className="font-bold text-blue-700 dark:text-blue-300">
                Refill Information
              </h5>
              <ul className="mt-2 space-y-1 text-sm text-blue-600 dark:text-blue-400">
                <li>• Request refills 3 days before running out</li>
                <li>• Bring empty container for controlled substances</li>
                <li>• Check if your medical aid covers refills</li>
                <li>• Some medications require doctor approval</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Prescriptions;
