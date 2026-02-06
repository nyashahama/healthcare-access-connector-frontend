import React, { useState, useEffect } from "react";
import {
  MdPendingActions,
  MdCheckCircle,
  MdCancel,
  MdInfoOutline,
} from "react-icons/md";
import { useAuth } from "hooks/useAuth";
import { useProvider } from "hooks/useProvider";
import { toast } from "react-toastify";

const RegistrationQueue = ({ onApprove, onReject, onViewAll }) => {
  const { getCurrentUser } = useAuth();
  const { getClinics, verifyClinic, updateVerifyClinic, loading } =
    useProvider();

  const [pendingClinics, setPendingClinics] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [processingClinicId, setProcessingClinicId] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'approve' or 'reject'
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Fetch current logged-in user
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
  }, [getCurrentUser]);

  // Fetch pending clinics on component mount
  useEffect(() => {
    fetchPendingClinics();
  }, []);

  const fetchPendingClinics = async () => {
    const result = await getClinics();

    if (result.success) {
      // Filter clinics with pending verification status
      const pending = result.data.clinics.filter(
        (clinic) =>
          clinic.verification_status === "pending" ||
          clinic.verification_status === "in_review"
      );
      setPendingClinics(pending);
    } else {
      toast.error("Failed to load pending clinics");
    }
  };

  const handleApproveClick = (clinic) => {
    if (!currentUser || !currentUser.id) {
      toast.error("You must be logged in to approve clinics");
      return;
    }

    setSelectedClinic(clinic);
    setModalAction("approve");
    setShowConfirmationModal(true);
  };

  const handleRejectClick = (clinic) => {
    if (!currentUser || !currentUser.id) {
      toast.error("You must be logged in to reject clinics");
      return;
    }

    setSelectedClinic(clinic);
    setModalAction("reject");
    setShowConfirmationModal(true);
  };

  const confirmAction = async () => {
    if (!selectedClinic || !modalAction) return;

    setProcessingClinicId(selectedClinic.id);

    try {
      if (modalAction === "approve") {
        await processApproval();
      } else {
        await processRejection();
      }
    } catch (error) {
      toast.error("An error occurred while processing the request");
      console.error("Action error:", error);
    } finally {
      setProcessingClinicId(null);
      closeModal();
    }
  };

  const processApproval = async () => {
    // Call verifyClinic to mark as verified
    const result = await verifyClinic(selectedClinic.id, {
      verified_by: currentUser.id,
      notes: `Clinic approved by ${currentUser.first_name || ""} ${
        currentUser.last_name || ""
      } on ${new Date().toLocaleDateString()}`,
    });

    if (result.success) {
      // Update verification status to "verified"
      const statusResult = await updateVerifyClinic(selectedClinic.id, {
        status: "verified",
      });

      if (statusResult.success) {
        toast.success(
          `${selectedClinic.clinic_name} has been approved successfully`
        );

        // Remove clinic from pending list
        setPendingClinics((prev) =>
          prev.filter((c) => c.id !== selectedClinic.id)
        );

        // Call parent callback if provided
        if (onApprove) {
          onApprove(selectedClinic);
        }
      } else {
        toast.error(
          statusResult.error || "Failed to update verification status"
        );
      }
    } else {
      toast.error(result.error || "Failed to verify clinic");
    }
  };

  const processRejection = async () => {
    // First verify the clinic with rejection notes
    const result = await verifyClinic(selectedClinic.id, {
      verified_by: currentUser.id,
      notes:
        rejectionReason ||
        `Clinic rejected by ${currentUser.first_name || ""} ${
          currentUser.last_name || ""
        } on ${new Date().toLocaleDateString()}`,
    });

    if (result.success) {
      // Update verification status to "rejected"
      const statusResult = await updateVerifyClinic(selectedClinic.id, {
        status: "rejected",
      });

      if (statusResult.success) {
        toast.warning(`${selectedClinic.clinic_name} has been rejected`);

        // Remove clinic from pending list
        setPendingClinics((prev) =>
          prev.filter((c) => c.id !== selectedClinic.id)
        );

        // Call parent callback if provided
        if (onReject) {
          onReject(selectedClinic);
        }
      } else {
        toast.error(statusResult.error || "Failed to update rejection status");
      }
    } else {
      toast.error(result.error || "Failed to process rejection");
    }
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
    setModalAction(null);
    setSelectedClinic(null);
    setRejectionReason("");
  };

  // Helper function to calculate document completion
  const getDocumentCompletion = (clinic) => {
    const requiredFields = [
      clinic.registration_number,
      clinic.accreditation_number,
      clinic.contact_person_name,
    ];

    const completedFields = requiredFields.filter((field) => field).length;
    return `${completedFields}/3`;
  };

  // Helper function to get time ago
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

  return (
    <div className="rounded-[20px] bg-white p-6 dark:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-lg font-bold text-navy-700 dark:text-white">
          Clinic Registration Queue
        </h5>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MdPendingActions className="mr-2 h-4 w-4" />
          <span className="font-bold text-brand-500">
            {pendingClinics.length}
          </span>{" "}
          pending verification
        </div>
      </div>

      {loading && pendingClinics.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          Loading pending clinics...
        </div>
      ) : pendingClinics.length === 0 ? (
        <div className="py-8 text-center text-gray-500 dark:text-gray-400">
          No pending clinics for verification
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-700">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Clinic Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Location
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Type
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Documents
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {pendingClinics.slice(0, 4).map((clinic) => {
                  const documents = getDocumentCompletion(clinic);
                  const isProcessing = processingClinicId === clinic.id;

                  return (
                    <tr
                      key={clinic.id}
                      className="border-b border-gray-200 hover:bg-gray-50 dark:border-navy-700 dark:hover:bg-navy-700/50"
                    >
                      <td className="py-4">
                        <div className="font-medium text-navy-700 dark:text-white">
                          {clinic.clinic_name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Submitted {getTimeAgo(clinic.created_at)}
                        </div>
                      </td>
                      <td className="py-4 text-gray-600 dark:text-gray-300">
                        {clinic.city && clinic.province
                          ? `${clinic.city}, ${clinic.province}`
                          : clinic.city ||
                            clinic.province ||
                            clinic.physical_address}
                      </td>
                      <td className="py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-navy-700 dark:text-gray-300">
                          {clinic.clinic_type
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-navy-600">
                              <div
                                className={`h-2 rounded-full ${
                                  documents === "3/3"
                                    ? "w-full bg-green-500"
                                    : documents === "2/3"
                                    ? "w-2/3 bg-yellow-500"
                                    : "w-1/3 bg-red-500"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`absolute -right-6 top-1/2 -translate-y-1/2 text-xs font-medium ${
                                documents === "3/3"
                                  ? "text-green-600 dark:text-green-400"
                                  : documents === "2/3"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {documents}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                            documents === "3/3"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          }`}
                        >
                          {documents === "3/3"
                            ? "Ready for Review"
                            : "Documents Pending"}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproveClick(clinic)}
                            disabled={
                              processingClinicId === clinic.id || loading
                            }
                            className="flex items-center rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <MdCheckCircle className="mr-2 h-4 w-4" />
                            {processingClinicId === clinic.id
                              ? "Processing..."
                              : "Approve"}
                          </button>
                          <button
                            onClick={() => handleRejectClick(clinic)}
                            disabled={
                              processingClinicId === clinic.id || loading
                            }
                            className="flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:text-gray-300"
                          >
                            <MdCancel className="mr-2 h-4 w-4" />
                            {processingClinicId === clinic.id
                              ? "Processing..."
                              : "Reject"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <button
              onClick={onViewAll}
              className="flex items-center text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            >
              View All Pending Registrations →
            </button>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Complete (3/3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                <span>Partial (2/3)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span>Incomplete (1/3)</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {Math.min(4, pendingClinics.length)} of{" "}
              {pendingClinics.length} pending clinics
            </div>
          </div>
        </>
      )}

      {/* Confirmation Modal - ENLARGED */}
      {showConfirmationModal && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-70 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-navy-800">
            {/* Modal Header */}
            <div
              className={`rounded-t-2xl px-8 py-6 ${
                modalAction === "approve"
                  ? "bg-green-50 dark:bg-green-900/20"
                  : "bg-red-50 dark:bg-red-900/20"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-3 ${
                    modalAction === "approve"
                      ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300"
                      : "bg-red-100 text-red-600 dark:bg-red-800 dark:text-red-300"
                  }`}
                >
                  {modalAction === "approve" ? (
                    <MdCheckCircle className="h-8 w-8" />
                  ) : (
                    <MdCancel className="h-8 w-8" />
                  )}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
                    {modalAction === "approve"
                      ? "Approve Clinic Registration"
                      : "Reject Clinic Registration"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    Please confirm your action
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-8 py-6">
              {/* Clinic Info Summary */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-navy-600 dark:bg-navy-700/50">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-navy-700 dark:text-white">
                      {selectedClinic?.clinic_name}
                    </h4>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Location
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedClinic?.city && selectedClinic?.province
                            ? `${selectedClinic.city}, ${selectedClinic.province}`
                            : selectedClinic?.city ||
                              selectedClinic?.province ||
                              "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Type
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {selectedClinic?.clinic_type
                            ?.replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {getTimeAgo(selectedClinic?.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Documents
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {getDocumentCompletion(selectedClinic)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Confirmation Message */}
              <div className="mb-6">
                <div
                  className={`mb-4 flex items-start gap-3 rounded-lg ${
                    modalAction === "approve"
                      ? "bg-green-50 p-4 dark:bg-green-900/10"
                      : "bg-red-50 p-4 dark:bg-red-900/10"
                  }`}
                >
                  <MdInfoOutline
                    className={`mt-0.5 h-5 w-5 ${
                      modalAction === "approve"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-medium ${
                        modalAction === "approve"
                          ? "text-green-800 dark:text-green-300"
                          : "text-red-800 dark:text-red-300"
                      }`}
                    >
                      {modalAction === "approve"
                        ? `You are about to approve "${selectedClinic?.clinic_name}". This action will verify the clinic and grant them full access to the system.`
                        : `You are about to reject "${selectedClinic?.clinic_name}". This action will prevent the clinic from accessing the system.`}
                    </p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                {/* Rejection Reason Input (only for reject action) */}
                {modalAction === "reject" && (
                  <div className="mb-6">
                    <label className="mb-3 block text-base font-medium text-gray-700 dark:text-gray-300">
                      Reason for Rejection{" "}
                      <span className="text-sm text-gray-500">
                        (Optional but recommended)
                      </span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={5}
                      className="focus:ring-3 w-full rounded-xl border border-gray-300 p-4 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500/20 dark:border-navy-600 dark:bg-navy-700 dark:text-white dark:focus:ring-brand-500/30"
                      placeholder="Provide a clear reason for rejection. This will help the clinic understand what needs to be improved..."
                    />
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      This message will be sent to the clinic along with the
                      rejection notification.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="rounded-b-2xl border-t border-gray-200 bg-gray-50 px-8 py-6 dark:border-navy-700 dark:bg-navy-700/50">
              <div className="flex justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <MdInfoOutline className="mr-2 h-4 w-4" />
                  <span>Action will be logged under your account</span>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={closeModal}
                    disabled={processingClinicId === selectedClinic?.id}
                    className="rounded-xl border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-navy-600 dark:text-gray-300 dark:hover:bg-navy-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAction}
                    disabled={processingClinicId === selectedClinic?.id}
                    className={`rounded-xl px-6 py-3 text-base font-medium text-white transition-all duration-200 ${
                      modalAction === "approve"
                        ? "focus:ring-3 bg-green-600 hover:bg-green-700 focus:ring-green-300"
                        : "focus:ring-3 bg-red-600 hover:bg-red-700 focus:ring-red-300"
                    } disabled:cursor-not-allowed disabled:opacity-50`}
                  >
                    {processingClinicId === selectedClinic?.id ? (
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          viewBox="0 0 24 24"
                        >
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
                        {modalAction === "approve"
                          ? "Approving..."
                          : "Rejecting..."}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        {modalAction === "approve" ? (
                          <MdCheckCircle className="mr-2 h-5 w-5" />
                        ) : (
                          <MdCancel className="mr-2 h-5 w-5" />
                        )}
                        {modalAction === "approve"
                          ? "Approve Clinic"
                          : "Reject Clinic"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationQueue;
