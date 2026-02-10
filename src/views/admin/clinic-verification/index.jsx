import React, { useState, useEffect } from "react";
import {
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
  MdVisibility,
  MdLocationOn,
  MdVerified,
  MdPendingActions,
  MdWarning,
  MdCalendarToday,
  MdPhone,
  MdEdit,
  MdDelete,
  MdInfo,
  MdPerson,
  MdEmail,
  MdAdd,
  MdSave,
  MdLock,
  MdLockOpen,
  MdRefresh,
} from "react-icons/md";
import {
  FaFileMedical,
  FaClinicMedical,
  FaRegFilePdf,
  FaDownload,
} from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useAuth } from "hooks/useAuth";
import { useProvider } from "hooks/useProvider";
import RegistrationQueue from "../components/RegistrationQueue";

const ClinicVerification = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
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
  const [currentUser, setCurrentUser] = useState(null);

  // Edit form state
  const [clinicForm, setClinicForm] = useState({
    clinic_name: "",
    clinic_type: "private",
    city: "",
    province: "",
    contact_number: "",
    email: "",
    services: [],
    operating_hours: "",
  });

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

  const fetchClinics = async () => {
    const result = await getClinics();
    if (!result.success) {
      showToast(result.error || "Failed to load clinics", "error");
    }
  };

  const formatOperatingHours = (hours) => {
    if (!hours) return "Not specified";

    // If it's already a string, return it
    if (typeof hours === "string") {
      return hours;
    }

    // If it's an object (from API), format it nicely
    if (typeof hours === "object" && hours !== null) {
      const daysOrder = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ];
      const formattedDays = daysOrder
        .filter((day) => {
          const dayValue = hours[day];
          // Check if the value exists, is a string, and is not "Closed"
          return (
            dayValue &&
            typeof dayValue === "string" &&
            dayValue !== "Closed" &&
            dayValue.trim() !== ""
          );
        })
        .map(
          (day) =>
            `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours[day]}`
        );

      return formattedDays.length > 0
        ? formattedDays.join(", ")
        : "Not specified";
    }

    return "Not specified";
  };

  const handleViewDetails = async (clinic) => {
    setSelectedClinic(clinic);
    // Fetch full clinic details
    const result = await getClinic(clinic.id);
    if (result.success) {
      setSelectedClinic(result.data);
    } else {
      showToast(result.error || "Failed to load clinic details", "error");
    }
    setViewModalOpen(true);
  };

  const handleEditClick = (clinic) => {
    setSelectedClinic(clinic);
    setClinicForm({
      clinic_name: clinic.clinic_name || "",
      clinic_type: clinic.clinic_type || "private",
      city: clinic.city || "",
      province: clinic.province || "",
      contact_number: clinic.contact_number || "",
      email: clinic.email || "",
      services: clinic.services || [],
      operating_hours: formatOperatingHours(clinic.operating_hours) || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (clinic) => {
    setSelectedClinic(clinic);
    setDeleteModalOpen(true);
  };

  const handleApproveClick = (clinic) => {
    if (!currentUser || !currentUser.id) {
      showToast("You must be logged in to approve clinics", "error");
      return;
    }
    setSelectedClinic(clinic);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (clinic) => {
    if (!currentUser || !currentUser.id) {
      showToast("You must be logged in to reject clinics", "error");
      return;
    }
    setSelectedClinic(clinic);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleCreateClick = () => {
    setClinicForm({
      clinic_name: "",
      clinic_type: "private",
      city: "",
      province: "",
      contact_number: "",
      email: "",
      services: [],
      operating_hours: "",
    });
    setCreateModalOpen(true);
  };

  // Form handler
  const handleFormChange = (field, value) => {
    setClinicForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceAdd = (service) => {
    if (service && !clinicForm.services.includes(service)) {
      setClinicForm((prev) => ({
        ...prev,
        services: [...prev.services, service],
      }));
    }
  };

  const handleServiceRemove = (serviceToRemove) => {
    setClinicForm((prev) => ({
      ...prev,
      services: prev.services.filter((service) => service !== serviceToRemove),
    }));
  };

  // Action confirmations
  const confirmEdit = async () => {
    setProcessingAction(true);
    const result = await updateClinic(selectedClinic.id, clinicForm);
    setProcessingAction(false);

    if (result.success) {
      setEditModalOpen(false);
      showToast("Clinic updated successfully!", "success");
      fetchClinics(); // Refresh the list
    } else {
      showToast(result.error || "Failed to update clinic", "error");
    }
  };

  const confirmDelete = async () => {
    setProcessingAction(true);
    const result = await deleteClinic(selectedClinic.id);
    setProcessingAction(false);

    if (result.success) {
      setDeleteModalOpen(false);
      showToast("Clinic deleted successfully!", "success");
      fetchClinics(); // Refresh the list
    } else {
      showToast(result.error || "Failed to delete clinic", "error");
    }
  };

  const confirmApprove = async () => {
    if (!selectedClinic || !currentUser?.id) {
      showToast("Invalid request", "error");
      return;
    }

    setProcessingAction(true);

    // First mark as verified
    const verifyResult = await verifyClinic(selectedClinic.id, {
      verified_by: currentUser.id,
      notes: `Clinic approved by ${currentUser.first_name || ""} ${
        currentUser.last_name || ""
      } on ${new Date().toLocaleDateString()}`,
    });

    if (verifyResult.success) {
      // Update verification status to "verified"
      const statusResult = await updateVerifyClinic(selectedClinic.id, {
        verification_status: "verified",
      });

      setProcessingAction(false);

      if (statusResult.success) {
        setApproveModalOpen(false);
        showToast("Clinic approved successfully!", "success");
        fetchClinics(); // Refresh the list
      } else {
        showToast(
          statusResult.error || "Failed to update verification status",
          "error"
        );
      }
    } else {
      setProcessingAction(false);
      showToast(verifyResult.error || "Failed to verify clinic", "error");
    }
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }

    if (!selectedClinic || !currentUser?.id) {
      showToast("Invalid request", "error");
      return;
    }

    setProcessingAction(true);

    // Mark as verified with rejection note
    const verifyResult = await verifyClinic(selectedClinic.id, {
      verified_by: currentUser.id,
      notes: rejectionReason,
    });

    if (verifyResult.success) {
      // Update verification status to "rejected"
      const statusResult = await updateVerifyClinic(selectedClinic.id, {
        verification_status: "rejected",
      });

      setProcessingAction(false);

      if (statusResult.success) {
        setRejectModalOpen(false);
        showToast("Clinic has been rejected.", "warning");
        fetchClinics(); // Refresh the list
      } else {
        showToast(
          statusResult.error || "Failed to update rejection status",
          "error"
        );
      }
    } else {
      setProcessingAction(false);
      showToast(verifyResult.error || "Failed to process rejection", "error");
    }
  };

  const confirmCreate = async () => {
    if (
      !clinicForm.clinic_name ||
      !clinicForm.city ||
      !clinicForm.contact_number
    ) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setProcessingAction(true);
    const result = await registerClinic({
      ...clinicForm,
      verification_status: "pending",
    });
    setProcessingAction(false);

    if (result.success) {
      setCreateModalOpen(false);
      showToast("New clinic added for verification!", "success");
      fetchClinics(); // Refresh the list
    } else {
      showToast(result.error || "Failed to create clinic", "error");
    }
  };

  // Filter clinics based on selected tab and search query
  const getFilteredClinics = () => {
    let filtered = clinics || [];

    // Filter by tab
    if (selectedTab === "pending") {
      filtered = filtered.filter(
        (clinic) =>
          clinic.verification_status === "pending" ||
          clinic.verification_status === "in_review"
      );
    } else if (selectedTab === "approved") {
      filtered = filtered.filter(
        (clinic) => clinic.verification_status === "verified"
      );
    } else if (selectedTab === "rejected") {
      filtered = filtered.filter(
        (clinic) => clinic.verification_status === "rejected"
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (clinic) =>
          clinic.clinic_name?.toLowerCase().includes(query) ||
          clinic.city?.toLowerCase().includes(query) ||
          clinic.province?.toLowerCase().includes(query) ||
          clinic.clinic_type?.toLowerCase().includes(query) ||
          clinic.email?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        icon: <MdPendingActions className="h-3 w-3" />,
        text: "Pending",
      },
      in_review: {
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
        icon: <MdVisibility className="h-3 w-3" />,
        text: "In Review",
      },
      verified: {
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        icon: <MdCheckCircle className="h-3 w-3" />,
        text: "Approved",
      },
      rejected: {
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        icon: <MdCancel className="h-3 w-3" />,
        text: "Rejected",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span
        className={`flex items-center rounded-full px-3 py-1 text-xs font-bold ${config.color}`}
      >
        {config.icon}
        <span className="ml-1">{config.text}</span>
      </span>
    );
  };

  const getClinicTypeDisplay = (type) => {
    const typeMap = {
      private: "Private Clinic",
      public: "Public Clinic",
      ngo: "NGO Clinic",
      mobile: "Mobile Clinic",
      specialist: "Specialist Clinic",
    };
    return typeMap[type] || type;
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Less than 1 hour ago";
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? "s" : ""} ago`;
  };

  // Calculate verification statistics
  const verificationStats = [
    {
      title: "Pending Review",
      count:
        clinics?.filter(
          (c) =>
            c.verification_status === "pending" ||
            c.verification_status === "in_review"
        ).length || 0,
      icon: <MdPendingActions className="h-6 w-6 text-yellow-500" />,
      color: "yellow",
    },
    {
      title: "Approved This Month",
      count:
        clinics?.filter((c) => c.verification_status === "verified").length ||
        0,
      icon: <MdCheckCircle className="h-6 w-6 text-green-500" />,
      color: "green",
    },
    {
      title: "Rejected",
      count:
        clinics?.filter((c) => c.verification_status === "rejected").length ||
        0,
      icon: <MdCancel className="h-6 w-6 text-red-500" />,
      color: "red",
    },
    {
      title: "Total Clinics",
      count: clinics?.length || 0,
      icon: <MdVerified className="h-6 w-6 text-blue-500" />,
      color: "blue",
    },
  ];

  const filteredClinics = getFilteredClinics();

  return (
    <div className="h-full">
      {/* Modals */}
      {/* View Details Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Clinic Details"
        size="lg"
      >
        {selectedClinic && (
          <div className="space-y-6">
            {/* Clinic Header */}
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                  {selectedClinic.clinic_name}
                </h4>
                <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
                  <MdLocationOn className="mr-2 h-5 w-5" />
                  {selectedClinic.city && selectedClinic.province
                    ? `${selectedClinic.city}, ${selectedClinic.province}`
                    : selectedClinic.physical_address || "N/A"}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(selectedClinic.verification_status)}
                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {getClinicTypeDisplay(selectedClinic.clinic_type)}
                </span>
              </div>
            </div>

            {/* Clinic Info Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center">
                  <MdCalendarToday className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Registered</div>
                    <div className="font-medium">
                      {new Date(selectedClinic.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdPhone className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Contact</div>
                    <div className="font-medium">
                      {selectedClinic.contact_number || "N/A"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdEmail className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">
                      {selectedClinic.email || "N/A"}
                    </div>
                  </div>
                </div>
                {selectedClinic.registration_number && (
                  <div className="flex items-center">
                    <MdInfo className="mr-3 h-5 w-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">
                        Registration #
                      </div>
                      <div className="font-medium">
                        {selectedClinic.registration_number}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                {selectedClinic.services &&
                  selectedClinic.services.length > 0 && (
                    <>
                      <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Services Offered
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(selectedClinic.services) ? (
                          selectedClinic.services.map((service, index) => (
                            <span
                              key={index}
                              className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">
                            No services listed
                          </span>
                        )}
                      </div>
                    </>
                  )}
                {selectedClinic.operating_hours && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-500">Operating Hours</div>
                    <div className="font-medium">
                      {formatOperatingHours(selectedClinic.operating_hours)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                <div className="text-sm text-gray-500">Clinic ID</div>
                <div className="font-medium">{selectedClinic.id}</div>
              </div>
              {selectedClinic.accreditation_number && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                  <div className="text-sm text-gray-500">Accreditation #</div>
                  <div className="font-medium">
                    {selectedClinic.accreditation_number}
                  </div>
                </div>
              )}
              {selectedClinic.contact_person_name && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                  <div className="text-sm text-gray-500">Contact Person</div>
                  <div className="font-medium">
                    {selectedClinic.contact_person_name}
                  </div>
                </div>
              )}
            </div>

            {/* Verification Details */}
            {selectedClinic.verification_status !== "pending" && (
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                <h5 className="mb-2 text-lg font-semibold text-navy-700 dark:text-white">
                  Verification Details
                </h5>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium">
                      {selectedClinic.verification_status}
                    </div>
                  </div>
                  {selectedClinic.verified_by && (
                    <div>
                      <div className="text-sm text-gray-500">Verified By</div>
                      <div className="font-medium">
                        User ID: {selectedClinic.verified_by}
                      </div>
                    </div>
                  )}
                  {selectedClinic.verification_notes && (
                    <div className="md:col-span-2">
                      <div className="text-sm text-gray-500">Notes</div>
                      <div className="font-medium">
                        {selectedClinic.verification_notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Edit Clinic Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Clinic Information"
        size="lg"
      >
        {selectedClinic && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clinic Name *
                </label>
                <input
                  type="text"
                  value={clinicForm.clinic_name}
                  onChange={(e) =>
                    handleFormChange("clinic_name", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter clinic name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clinic Type *
                </label>
                <select
                  value={clinicForm.clinic_type}
                  onChange={(e) =>
                    handleFormChange("clinic_type", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                >
                  <option value="private">Private Clinic</option>
                  <option value="public">Public Clinic</option>
                  <option value="ngo">NGO Clinic</option>
                  <option value="mobile">Mobile Clinic</option>
                  <option value="specialist">Specialist Clinic</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City *
                </label>
                <input
                  type="text"
                  value={clinicForm.city}
                  onChange={(e) => handleFormChange("city", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Province *
                </label>
                <input
                  type="text"
                  value={clinicForm.province}
                  onChange={(e) => handleFormChange("province", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter province"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={clinicForm.contact_number}
                  onChange={(e) =>
                    handleFormChange("contact_number", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter contact number"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={clinicForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter email address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={clinicForm.operating_hours}
                  onChange={(e) =>
                    handleFormChange("operating_hours", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="e.g., Mon-Fri: 8am-6pm"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Services Offered (comma-separated)
              </label>
              <input
                type="text"
                value={clinicForm.services.join(", ")}
                onChange={(e) =>
                  handleFormChange(
                    "services",
                    e.target.value.split(", ").filter((s) => s.trim())
                  )
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Pediatrics, Emergency Care, Vaccinations"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                disabled={processingAction}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                disabled={
                  processingAction ||
                  !clinicForm.clinic_name ||
                  !clinicForm.city ||
                  !clinicForm.contact_number
                }
                className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {processingAction ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <MdSave className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Clinic"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Delete "{selectedClinic?.clinic_name}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This action cannot be undone. All clinic data will be
                permanently removed.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-2 mt-0.5 h-5 w-5 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-300">
                This will also delete all associated staff, services, and
                documents.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              disabled={processingAction}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={processingAction}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processingAction ? "Deleting..." : "Delete Clinic"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Approve Confirmation Modal */}
      <Modal
        isOpen={approveModalOpen}
        onClose={() => setApproveModalOpen(false)}
        title="Approve Clinic"
        size="md"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <MdCheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="mb-2 text-xl font-bold text-navy-700 dark:text-white">
              Approve {selectedClinic?.clinic_name}?
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              This clinic will be verified and become active in the system.
            </p>
          </div>

          <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 dark:text-green-300">
                Once approved, the clinic will appear in search results and can
                receive patient appointments.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setApproveModalOpen(false)}
              disabled={processingAction}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmApprove}
              disabled={processingAction}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processingAction ? "Approving..." : "Approve Clinic"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Reject Confirmation Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Clinic"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2">
              <MdWarning className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Reject {selectedClinic?.clinic_name}?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                This clinic will be rejected and removed from the pending list.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Reason for rejection *
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-red-500 focus:ring-red-500 dark:border-gray-600 dark:bg-navy-700"
              rows="3"
              placeholder="Please provide a reason for rejection..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setRejectModalOpen(false)}
              disabled={processingAction}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              disabled={processingAction || !rejectionReason.trim()}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processingAction ? "Rejecting..." : "Reject Clinic"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Clinic Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Add New Clinic for Verification"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Name *
              </label>
              <input
                type="text"
                value={clinicForm.clinic_name}
                onChange={(e) =>
                  handleFormChange("clinic_name", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter clinic name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Type *
              </label>
              <select
                value={clinicForm.clinic_type}
                onChange={(e) =>
                  handleFormChange("clinic_type", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="private">Private Clinic</option>
                <option value="public">Public Clinic</option>
                <option value="ngo">NGO Clinic</option>
                <option value="mobile">Mobile Clinic</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                City *
              </label>
              <input
                type="text"
                value={clinicForm.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Province *
              </label>
              <input
                type="text"
                value={clinicForm.province}
                onChange={(e) => handleFormChange("province", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter province"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number *
              </label>
              <input
                type="tel"
                value={clinicForm.contact_number}
                onChange={(e) =>
                  handleFormChange("contact_number", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter contact number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                value={clinicForm.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter email address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Operating Hours
              </label>
              <input
                type="text"
                value={clinicForm.operating_hours}
                onChange={(e) =>
                  handleFormChange("operating_hours", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Mon-Fri: 8am-6pm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Services (comma-separated)
            </label>
            <input
              type="text"
              value={clinicForm.services.join(", ")}
              onChange={(e) =>
                handleFormChange(
                  "services",
                  e.target.value.split(", ").filter((s) => s.trim())
                )
              }
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              placeholder="Enter services separated by commas (e.g., Pediatrics, Emergency Care, Vaccinations)"
            />
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                After creation, the clinic will need to submit required
                documents for verification.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setCreateModalOpen(false)}
              disabled={processingAction}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmCreate}
              disabled={
                processingAction ||
                !clinicForm.clinic_name ||
                !clinicForm.city ||
                !clinicForm.contact_number
              }
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processingAction ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <MdAdd className="h-5 w-5" />
                  Create Clinic
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Clinic Verification Portal
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Review and verify healthcare facility registrations
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchClinics}
            disabled={loading}
            className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20"
          >
            <MdRefresh
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={handleCreateClick}
            className="linear flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600 active:scale-95 active:bg-brand-700"
          >
            <MdAdd className="mr-2 h-4 w-4" />
            Add New Clinic
          </button>
        </div>
      </div>

      {/* Registration Queue Component */}
      <div className="mb-6">
        <RegistrationQueue
          onApprove={() => fetchClinics()}
          onReject={() => fetchClinics()}
          onViewAll={() => setSelectedTab("pending")}
        />
      </div>

      {/* Stats Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {verificationStats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-gray-700 ${
              stat.color === "yellow"
                ? "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10"
                : stat.color === "green"
                ? "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
                : stat.color === "red"
                ? "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10"
                : "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.title}
                </div>
                <div className="mt-1 text-2xl font-bold text-navy-700 dark:text-white">
                  {stat.count}
                </div>
              </div>
              <div className="rounded-full bg-white p-3 dark:bg-navy-700">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Tabs */}
      <div className="mb-6 rounded-xl bg-white p-4 dark:bg-navy-800">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search clinics by name, location, or type..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 transition-all duration-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-gray-600 dark:bg-navy-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {["pending", "approved", "rejected", "all"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                disabled={loading}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${
                  selectedTab === tab
                    ? "bg-brand-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-300 dark:hover:bg-navy-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Clinic List */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                  {selectedTab === "pending"
                    ? "Pending Verification"
                    : selectedTab === "approved"
                    ? "Approved Clinics"
                    : selectedTab === "rejected"
                    ? "Rejected Clinics"
                    : "All Clinics"}
                </h4>
                <p className="text-sm text-gray-600">
                  {loading
                    ? "Loading..."
                    : `${filteredClinics.length} clinics found`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700">
                  <option>Sort by: Newest First</option>
                  <option>Oldest First</option>
                  <option>Name A-Z</option>
                </select>
              </div>
            </div>

            {loading && filteredClinics.length === 0 ? (
              <div className="py-12 text-center">
                <div className="border-current border-r-transparent inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-500">Loading clinics...</p>
              </div>
            ) : filteredClinics.length === 0 ? (
              <div className="py-12 text-center">
                <MdPendingActions className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No clinics found
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? "No clinics match your search criteria."
                    : selectedTab === "pending"
                    ? "No clinics pending verification."
                    : `No ${selectedTab} clinics found.`}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {filteredClinics.map((clinic) => (
                    <div
                      key={clinic.id}
                      className="rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.005] hover:border-brand-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-navy-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <h5 className="text-lg font-bold text-navy-700 dark:text-white">
                                  {clinic.clinic_name}
                                </h5>
                                <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 transition-all duration-200 hover:scale-105 dark:bg-navy-700 dark:text-gray-300">
                                  {getClinicTypeDisplay(clinic.clinic_type)}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                                <MdLocationOn className="mr-2 h-4 w-4" />
                                {clinic.city && clinic.province
                                  ? `${clinic.city}, ${clinic.province}`
                                  : clinic.physical_address ||
                                    "Location not specified"}
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500">
                                <MdCalendarToday className="mr-2 h-4 w-4" />
                                Registered {getTimeAgo(clinic.created_at)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="mb-2">
                                {getStatusBadge(clinic.verification_status)}
                              </div>
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {clinic.contact_number || "No contact"}
                              </div>
                            </div>
                          </div>

                          {clinic.services && clinic.services.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {Array.isArray(clinic.services)
                                ? clinic.services
                                    .slice(0, 3)
                                    .map((service, index) => (
                                      <span
                                        key={index}
                                        className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 transition-all duration-200 hover:scale-105 dark:bg-blue-900/30 dark:text-blue-300"
                                      >
                                        {service}
                                      </span>
                                    ))
                                : null}
                              {Array.isArray(clinic.services) &&
                                clinic.services.length > 3 && (
                                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                                    +{clinic.services.length - 3} more
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                        <button
                          onClick={() => handleViewDetails(clinic)}
                          className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                        >
                          <MdVisibility className="mr-2 h-4 w-4" />
                          View Details
                        </button>
                        {clinic.verification_status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEditClick(clinic)}
                              className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300"
                            >
                              <MdEdit className="mr-2 h-4 w-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(clinic)}
                              className="flex items-center rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-300"
                            >
                              <MdDelete className="mr-2 h-4 w-4" />
                              Delete
                            </button>
                            <button
                              onClick={() => handleApproveClick(clinic)}
                              className="flex items-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
                            >
                              <MdCheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        {/* Sidebar - Verification History and Quick Actions */}
        <div className="space-y-6">
          {/* Verification History */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              Recent Verifications
            </h4>
            <div className="space-y-4">
              {clinics
                ?.filter((c) => c.verification_status !== "pending")
                .slice(0, 3)
                .map((clinic) => (
                  <div
                    key={clinic.id}
                    className="rounded-lg border border-gray-200 p-3 transition-all duration-300 hover:scale-[1.02] hover:border-brand-200 dark:border-gray-700"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-navy-700 dark:text-white">
                          {clinic.clinic_name}
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {clinic.city}, {clinic.province}
                        </div>
                      </div>
                      {getStatusBadge(clinic.verification_status)}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Updated {getTimeAgo(clinic.updated_at)}
                    </div>
                  </div>
                ))}
            </div>
            <button className="mt-4 w-full rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
              View All History →
            </button>
          </Card>

          {/* Quick Verification Guidelines */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              📋 Verification Guidelines
            </h4>
            <div className="space-y-3">
              {[
                {
                  icon: (
                    <MdCheckCircle className="h-4 w-4 text-green-600 dark:text-green-300" />
                  ),
                  title: "Required Documents",
                  description:
                    "Registration certificate, medical license, facility photos",
                  color: "green",
                },
                {
                  icon: (
                    <MdWarning className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                  ),
                  title: "Common Issues",
                  description:
                    "Blurry photos, expired licenses, incomplete forms",
                  color: "yellow",
                },
                {
                  icon: (
                    <MdVerified className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  ),
                  title: "Priority Clinics",
                  description:
                    "Rural areas, pediatric services, emergency care",
                  color: "blue",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start transition-all duration-300 hover:scale-[1.02]"
                >
                  <div
                    className={`mr-3 rounded-full p-1 ${
                      item.color === "green"
                        ? "bg-green-100 dark:bg-green-900"
                        : item.color === "yellow"
                        ? "bg-yellow-100 dark:bg-yellow-900"
                        : "bg-blue-100 dark:bg-blue-900"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bulk Actions */}
          <Card extra="p-6">
            <h4 className="mb-4 text-lg font-bold text-navy-700 dark:text-white">
              ⚡ Bulk Actions
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Bulk approve logic
                  showToast("Bulk approve feature coming soon!", "info");
                }}
                className="w-full rounded-lg bg-brand-50 py-3 text-sm font-medium text-brand-600 transition-all duration-200 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300"
              >
                Approve All Complete Applications
              </button>
              <button className="w-full rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300">
                Request Missing Documents
              </button>
              <button className="w-full rounded-lg border border-red-300 py-3 text-sm font-medium text-red-700 transition-all duration-200 hover:scale-105 hover:bg-red-50 dark:border-red-700 dark:text-red-400">
                Export Verification Report
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 rounded-lg bg-yellow-50 p-4 text-center text-sm text-yellow-800 transition-all duration-300 hover:scale-[1.01] dark:bg-yellow-900/20 dark:text-yellow-300">
        <p>
          ⚠️ <strong>Important:</strong> Clinic verification typically takes 2-3
          business days. Urgent requests can be expedited via priority queue.
        </p>
      </div>
    </div>
  );
};

export default ClinicVerification;
