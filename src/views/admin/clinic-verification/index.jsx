import React, { useState, useEffect } from "react";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";
import { useProvider } from "hooks/useProvider";
import RegistrationQueue from "../components/RegistrationQueue";

// Component imports
import StatsCards from "./components/StatsCards";
import TabNavigation from "./components/TabNavigation";
import SearchAndFilter from "./components/SearchAndFilter";
import ClinicGrid from "./components/ClinicGrid";
import RecentVerifications from "./components/RecentVerifications";
import VerificationGuidelines from "./components/VerificationGuidelines";
import BulkActions from "./components/BulkActions";
import ViewDetailsModal from "./components/ViewDetailsModal";
import EditClinicModal from "./components/EditClinicModal";
import {
  ApproveModal,
  RejectModal,
  DeleteModal,
} from "./components/ActionModals";

// Utility imports
import { formatOperatingHours } from "./components/clinicUtils";

const ClinicVerification = () => {
  // State management
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingAction, setProcessingAction] = useState(false);

  // Form state
  const [clinicForm, setClinicForm] = useState({
    clinic_name: "",
    clinic_type: "private",
    city: "",
    province: "",
    primary_phone: "",
    email: "",
    services: [],
    operating_hours: "",
  });

  // Hooks
  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();
  const {
    getClinics,
    getClinic,
    updateClinic,
    deleteClinic,
    verifyClinic,
    updateVerifyClinic,
    registerClinic,
    loading,
    error,
    clinics,
    clearError,
    clearProviderState,
  } = useProvider();

  // Fetch current user and clinics on mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    fetchClinics();
  }, []);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      clearError();
      clearProviderState();
    };
  }, []);

  // Fetch clinics based on selected tab
  useEffect(() => {
    if (selectedTab === "all") {
      fetchClinics();
    }
  }, [selectedTab]);

  // Fetch clinics
  const fetchClinics = async () => {
    const result = await getClinics();
    if (!result.success) {
      showToast(result.error || "Failed to load clinics", "error");
    }
  };

  // View details handler
  const handleViewDetails = async (clinic) => {
    setSelectedClinic(clinic);
    const result = await getClinic(clinic.id);
    if (result.success) {
      setSelectedClinic(result.data);
    } else {
      showToast(result.error || "Failed to load clinic details", "error");
    }
    setViewModalOpen(true);
  };

  // Edit handlers
  const handleEditClick = (clinic) => {
    setSelectedClinic(clinic);
    setClinicForm({
      clinic_name: clinic.clinic_name || "",
      clinic_type: clinic.clinic_type || "private",
      city: clinic.city || "",
      province: clinic.province || "",
      primary_phone: clinic.primary_phone || "",
      email: clinic.email || "",
      services: clinic.services || [],
      operating_hours: formatOperatingHours(clinic.operating_hours) || "",
    });
    setEditModalOpen(true);
  };

  const confirmEdit = async () => {
    if (!selectedClinic) return;

    setProcessingAction(true);
    const result = await updateClinic(selectedClinic.id, clinicForm);

    if (result.success) {
      showToast("Clinic updated successfully!", "success");
      setEditModalOpen(false);
      fetchClinics();
    } else {
      showToast(result.error || "Failed to update clinic", "error");
    }
    setProcessingAction(false);
  };

  // Delete handlers
  const handleDeleteClick = (clinic) => {
    setSelectedClinic(clinic);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedClinic) return;

    setProcessingAction(true);
    const result = await deleteClinic(selectedClinic.id);

    if (result.success) {
      showToast("Clinic deleted successfully!", "success");
      setDeleteModalOpen(false);
      fetchClinics();
    } else {
      showToast(result.error || "Failed to delete clinic", "error");
    }
    setProcessingAction(false);
  };

  // Approve handlers
  const handleApproveClick = (clinic) => {
    if (!currentUser || !currentUser.id) {
      showToast("You must be logged in to approve clinics", "error");
      return;
    }
    setSelectedClinic(clinic);
    setApproveModalOpen(true);
  };

  const confirmApprove = async () => {
    if (!selectedClinic || !currentUser) return;

    setProcessingAction(true);
    const result = await verifyClinic(
      selectedClinic.id,
      currentUser.id,
      "verified"
    );

    if (result.success) {
      showToast(
        `${selectedClinic.clinic_name} approved successfully!`,
        "success"
      );
      setApproveModalOpen(false);
      fetchClinics();
    } else {
      showToast(result.error || "Failed to approve clinic", "error");
    }
    setProcessingAction(false);
  };

  // Reject handlers
  const handleRejectClick = (clinic) => {
    if (!currentUser || !currentUser.id) {
      showToast("You must be logged in to reject clinics", "error");
      return;
    }
    setSelectedClinic(clinic);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedClinic || !currentUser || !rejectionReason.trim()) return;

    setProcessingAction(true);
    const result = await updateVerifyClinic(selectedClinic.id, {
      verification_status: "rejected",
      verified_by: currentUser.id,
      notes: rejectionReason,
    });

    if (result.success) {
      showToast(`${selectedClinic.clinic_name} has been rejected`, "info");
      setRejectModalOpen(false);
      fetchClinics();
    } else {
      showToast(result.error || "Failed to reject clinic", "error");
    }
    setProcessingAction(false);
  };

  // Create clinic handler
  const handleCreateClick = () => {
    setClinicForm({
      clinic_name: "",
      clinic_type: "private",
      city: "",
      province: "",
      primary_phone: "",
      email: "",
      services: [],
      operating_hours: "",
    });
    setCreateModalOpen(true);
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Clinic Verification Portal
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Review and manage clinic registration applications
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards clinics={clinics} />

      {/* Registration Queue */}
      <RegistrationQueue />

      {/* Tab Navigation */}
      <TabNavigation
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        clinics={clinics}
      />

      {/* Search and Filter */}
      <SearchAndFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={fetchClinics}
        onCreateClick={handleCreateClick}
        loading={loading}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - Clinic List */}
        <div className="lg:col-span-2">
          <ClinicGrid
            clinics={clinics}
            selectedTab={selectedTab}
            searchQuery={searchQuery}
            loading={loading}
            onViewDetails={handleViewDetails}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onApprove={handleApproveClick}
          />
        </div>

        {/* Sidebar - Verification History and Quick Actions */}
        <div className="space-y-6">
          <RecentVerifications clinics={clinics} />
          <VerificationGuidelines />
          <BulkActions showToast={showToast} />
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800 transition-all duration-300 hover:scale-[1.01] dark:bg-yellow-900/20 dark:text-yellow-300">
        <p>
          ⚠️ <strong>Important:</strong> Clinic verification typically takes 2-3
          business days. Urgent requests can be expedited via priority queue.
        </p>
      </div>

      {/* Modals */}
      <ViewDetailsModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        clinic={selectedClinic}
      />

      <EditClinicModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        clinicForm={clinicForm}
        setClinicForm={setClinicForm}
        onSave={confirmEdit}
        loading={processingAction}
      />

      <ApproveModal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        clinic={selectedClinic}
        onConfirm={confirmApprove}
        loading={processingAction}
      />

      <RejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        clinic={selectedClinic}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onConfirm={confirmReject}
        loading={processingAction}
      />

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        clinic={selectedClinic}
        onConfirm={confirmDelete}
        loading={processingAction}
      />
    </div>
  );
};

export default ClinicVerification;
