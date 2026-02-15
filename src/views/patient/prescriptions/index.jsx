import React, { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useToast } from "hooks/useToast";
import Card from "components/card";

// Components
import PrescriptionCard from "./components/PrescriptionCard";
import PrescriptionTabs from "./components/PrescriptionTabs";
import SearchBar from "./components/SearchBar";
import InfoCards from "./components/InfoCards";
import {
  PrescriptionDetailsModal,
  RefillModal,
  ShareModal,
  DownloadModal,
  PrintModal,
  NewRequestModal,
} from "./components/PrescriptionModals";

// Data
import { prescriptions as initialPrescriptions } from "./components/prescriptionsData";

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
  const { showToast } = useToast();

  // Data (could be fetched from API, using static for now)
  const [prescriptions] = useState(initialPrescriptions);

  // Filtered prescriptions based on view and search
  const filteredPrescriptions = prescriptions[view].filter(
    (prescription) =>
      prescription.medication
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      prescription.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prescription.rxNumber &&
        prescription.rxNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handlers
  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, details: true }));
  };

  const handleRequestRefill = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, refill: true }));
  };

  const handleShare = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, share: true }));
  };

  const handleDownload = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, download: true }));
  };

  const handlePrint = (prescription) => {
    setSelectedPrescription(prescription);
    setModalState((prev) => ({ ...prev, print: true }));
  };

  const handleNewRequest = () => {
    setModalState((prev) => ({ ...prev, newRequest: true }));
  };

  const copyRxNumber = (rxNumber) => {
    navigator.clipboard.writeText(rxNumber);
    showToast("RX Number copied to clipboard", "info");
  };

  // Modal confirmation handlers
  const confirmRefill = (method) => {
    setModalState((prev) => ({ ...prev, refill: false }));
    showToast(
      `Refill request sent to ${selectedPrescription.pharmacy} via ${method}`,
      "success"
    );
  };

  const confirmShare = (method) => {
    setModalState((prev) => ({ ...prev, share: false }));
    showToast(`Prescription shared via ${method}`, "success");
  };

  const confirmDownload = (format) => {
    setModalState((prev) => ({ ...prev, download: false }));
    showToast(`Prescription downloaded as ${format.toUpperCase()}`, "success");
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

  // Counts for tabs
  const counts = {
    active: prescriptions.active.length,
    requested: prescriptions.requested.length,
    expired: prescriptions.expired.length,
  };

  return (
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
          onClick={handleNewRequest}
          className="rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:from-brand-600 hover:to-brand-700 hover:shadow-lg"
        >
          <MdAdd className="mr-2 inline h-4 w-4" />
          New Request
        </button>
      </div>

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Tabs */}
      <PrescriptionTabs view={view} setView={setView} counts={counts} />

      {/* Prescriptions List */}
      <div className="space-y-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-12 text-center dark:bg-navy-700">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-navy-600">
              <MdAdd className="h-8 w-8 text-gray-400" />
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
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              onViewDetails={handleViewDetails}
              onRequestRefill={handleRequestRefill}
              onShare={handleShare}
              onDownload={handleDownload}
            />
          ))
        )}
      </div>

      {/* Info Cards */}
      <InfoCards />

      {/* Modals */}
      <PrescriptionDetailsModal
        isOpen={modalState.details}
        onClose={() => setModalState((prev) => ({ ...prev, details: false }))}
        prescription={selectedPrescription}
        onRequestRefill={handleRequestRefill}
        copyRxNumber={copyRxNumber}
      />

      <RefillModal
        isOpen={modalState.refill}
        onClose={() => setModalState((prev) => ({ ...prev, refill: false }))}
        prescription={selectedPrescription}
        onConfirm={confirmRefill}
      />

      <ShareModal
        isOpen={modalState.share}
        onClose={() => setModalState((prev) => ({ ...prev, share: false }))}
        prescription={selectedPrescription}
        onConfirm={confirmShare}
      />

      <DownloadModal
        isOpen={modalState.download}
        onClose={() => setModalState((prev) => ({ ...prev, download: false }))}
        prescription={selectedPrescription}
        onConfirm={confirmDownload}
      />

      <PrintModal
        isOpen={modalState.print}
        onClose={() => setModalState((prev) => ({ ...prev, print: false }))}
        prescription={selectedPrescription}
        onConfirm={confirmPrint}
      />

      <NewRequestModal
        isOpen={modalState.newRequest}
        onClose={() =>
          setModalState((prev) => ({ ...prev, newRequest: false }))
        }
        onConfirm={confirmNewRequest}
      />
    </div>
  );
};

export default Prescriptions;
