import React, { useState } from "react";
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

const ClinicVerification = () => {
  const [selectedTab, setSelectedTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const { showToast } = useToast();

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Edit form state
  const [clinicForm, setClinicForm] = useState({
    name: "",
    type: "Private Clinic",
    location: "",
    contact: "",
    services: [],
    documents: [],
  });

  const verificationStats = [
    {
      title: "Pending Review",
      count: "8",
      icon: <MdPendingActions className="h-6 w-6 text-yellow-500" />,
      color: "yellow",
      trend: "+2 this week",
    },
    {
      title: "Approved This Month",
      count: "24",
      icon: <MdCheckCircle className="h-6 w-6 text-green-500" />,
      color: "green",
      trend: "+15%",
    },
    {
      title: "Rejected",
      count: "3",
      icon: <MdCancel className="h-6 w-6 text-red-500" />,
      color: "red",
      trend: "-1 this month",
    },
    {
      title: "Total Verified",
      count: "247",
      icon: <MdVerified className="h-6 w-6 text-blue-500" />,
      color: "blue",
      trend: "+12%",
    },
  ];

  const pendingClinics = [
    {
      id: 1,
      name: "Sunrise Medical Center",
      location: "Johannesburg, Gauteng",
      type: "Private Clinic",
      submitted: "2024-01-15",
      documents: [
        { id: 1, name: "Registration Certificate", verified: true, url: "#" },
        { id: 2, name: "Medical License", verified: true, url: "#" },
        { id: 3, name: "Facility Photos", verified: false, url: "#" },
      ],
      services: ["Pediatrics", "Vaccinations", "Emergency Care"],
      contact: "+27 11 234 5678",
      email: "info@sunrisemedical.co.za",
      status: "pending",
      facilitySize: "Medium",
      operatingHours: "Mon-Fri: 8am-6pm",
      staffCount: 12,
      accreditation: "HPCSA Registered",
      facilities: ["X-Ray", "Lab", "Pharmacy"],
    },
    {
      id: 2,
      name: "Rural Health Outreach Clinic",
      location: "Limpopo Province",
      type: "NGO Clinic",
      submitted: "2024-01-14",
      documents: [
        { id: 1, name: "NGO Certificate", verified: true, url: "#" },
        { id: 2, name: "Facility Photos", verified: true, url: "#" },
        { id: 3, name: "Staff Credentials", verified: false, url: "#" },
      ],
      services: ["Primary Care", "Maternal Health", "Nutrition"],
      contact: "+27 15 345 6789",
      email: "ruralhealth@ngo.org",
      status: "pending",
      facilitySize: "Small",
      operatingHours: "Mon-Sat: 9am-5pm",
      staffCount: 6,
      accreditation: "Department of Health",
      facilities: ["Consultation Rooms", "Dispensary"],
    },
  ];

  // Modal handlers
  const handleViewDetails = (clinic) => {
    setSelectedClinic(clinic);
    setViewModalOpen(true);
  };

  const handleEditClick = (clinic) => {
    setSelectedClinic(clinic);
    setClinicForm({
      name: clinic.name,
      type: clinic.type,
      location: clinic.location,
      contact: clinic.contact,
      email: clinic.email || "",
      services: [...clinic.services],
      operatingHours: clinic.operatingHours || "",
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (clinic) => {
    setSelectedClinic(clinic);
    setDeleteModalOpen(true);
  };

  const handleApproveClick = (clinic) => {
    setSelectedClinic(clinic);
    setApproveModalOpen(true);
  };

  const handleRejectClick = (clinic) => {
    setSelectedClinic(clinic);
    setRejectionReason("");
    setRejectModalOpen(true);
  };

  const handleCreateClick = () => {
    setClinicForm({
      name: "",
      type: "Private Clinic",
      location: "",
      contact: "",
      email: "",
      services: [],
      operatingHours: "",
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
  const confirmEdit = () => {
    console.log(`Editing clinic ${selectedClinic.id}`, clinicForm);
    setEditModalOpen(false);
    showToast("Clinic updated successfully!", "success");
  };

  const confirmDelete = () => {
    console.log(`Deleting clinic ${selectedClinic.id}`);
    setDeleteModalOpen(false);
    showToast("Clinic deleted successfully!", "error");
  };

  const confirmApprove = () => {
    console.log(`Approving clinic ${selectedClinic.id}`);
    setApproveModalOpen(false);
    showToast("Clinic approved successfully!", "success");
  };

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }
    console.log(
      `Rejecting clinic ${selectedClinic.id} with reason: ${rejectionReason}`
    );
    setRejectModalOpen(false);
    showToast("Clinic has been rejected.", "warning");
  };

  const confirmCreate = () => {
    console.log("Creating new clinic", clinicForm);
    setCreateModalOpen(false);
    showToast("New clinic added for verification!", "success");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        icon: <MdPendingActions className="h-3 w-3" />,
        text: "Pending",
      },
      approved: {
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
      verified: {
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        icon: <MdVerified className="h-3 w-3" />,
        text: "Verified",
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

  const DocumentStatus = ({ documents }) => {
    const verifiedCount = documents.filter((doc) => doc.verified).length;
    const totalCount = documents.length;

    return (
      <div className="flex items-center">
        <span
          className={`mr-2 font-bold ${
            verifiedCount === totalCount
              ? "text-green-500"
              : verifiedCount > totalCount / 2
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {verifiedCount}/{totalCount}
        </span>
        <div className="flex">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`ml-1 h-2 w-2 rounded-full ${
                doc.verified ? "bg-green-500" : "bg-red-500"
              }`}
              title={doc.name}
            />
          ))}
        </div>
      </div>
    );
  };

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
                  {selectedClinic.name}
                </h4>
                <div className="mt-2 flex items-center text-gray-600 dark:text-gray-300">
                  <MdLocationOn className="mr-2 h-5 w-5" />
                  {selectedClinic.location}
                </div>
              </div>
              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                {selectedClinic.type}
              </span>
            </div>

            {/* Clinic Info Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center">
                  <MdCalendarToday className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Submitted</div>
                    <div className="font-medium">
                      {selectedClinic.submitted}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdPhone className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Contact</div>
                    <div className="font-medium">{selectedClinic.contact}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <MdEmail className="mr-3 h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{selectedClinic.email}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Services Offered
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedClinic.services.map((service, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                {selectedClinic.operatingHours && (
                  <div className="mt-3">
                    <div className="text-sm text-gray-500">Operating Hours</div>
                    <div className="font-medium">
                      {selectedClinic.operatingHours}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {selectedClinic.facilitySize && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                  <div className="text-sm text-gray-500">Facility Size</div>
                  <div className="font-medium">
                    {selectedClinic.facilitySize}
                  </div>
                </div>
              )}
              {selectedClinic.staffCount && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                  <div className="text-sm text-gray-500">Staff Count</div>
                  <div className="font-medium">{selectedClinic.staffCount}</div>
                </div>
              )}
              {selectedClinic.accreditation && (
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
                  <div className="text-sm text-gray-500">Accreditation</div>
                  <div className="font-medium">
                    {selectedClinic.accreditation}
                  </div>
                </div>
              )}
            </div>

            {/* Documents Section */}
            <div>
              <h5 className="mb-3 text-lg font-semibold text-navy-700 dark:text-white">
                Documents
              </h5>
              <div className="space-y-3">
                {selectedClinic.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center">
                      <FaRegFilePdf className="mr-3 h-6 w-6 text-red-500" />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div
                          className={`text-sm ${
                            doc.verified ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {doc.verified ? "✓ Verified" : "✗ Pending"}
                        </div>
                      </div>
                    </div>
                    <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
                  value={clinicForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter clinic name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Clinic Type *
                </label>
                <select
                  value={clinicForm.type}
                  onChange={(e) => handleFormChange("type", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                >
                  <option value="Private Clinic">Private Clinic</option>
                  <option value="Public Clinic">Public Clinic</option>
                  <option value="NGO Clinic">NGO Clinic</option>
                  <option value="Mobile Clinic">Mobile Clinic</option>
                  <option value="Specialist Clinic">Specialist Clinic</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location *
                </label>
                <input
                  type="text"
                  value={clinicForm.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  value={clinicForm.contact}
                  onChange={(e) => handleFormChange("contact", e.target.value)}
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
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={clinicForm.operatingHours}
                  onChange={(e) =>
                    handleFormChange("operatingHours", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="e.g., Mon-Fri: 8am-6pm"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Services Offered
              </label>
              <div className="mb-3 flex flex-wrap gap-2">
                {clinicForm.services.map((service, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  >
                    {service}
                    <button
                      onClick={() => handleServiceRemove(service)}
                      className="ml-1 hover:text-green-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a service (e.g., Pediatrics)"
                  className="flex-1 rounded-lg border border-gray-300 p-2 dark:border-gray-600 dark:bg-navy-700"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleServiceAdd(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector(
                      'input[placeholder="Add a service (e.g., Pediatrics)"]'
                    );
                    if (input.value) {
                      handleServiceAdd(input.value);
                      input.value = "";
                    }
                  }}
                  className="rounded-lg bg-green-500 px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="flex items-center gap-2 rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
              >
                <MdSave className="h-5 w-5" />
                Save Changes
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
                Delete "{selectedClinic?.name}"?
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
                This will also delete all associated documents and verification
                history.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-600"
            >
              Delete Clinic
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
              Approve {selectedClinic?.name}?
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
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmApprove}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-600"
            >
              Approve Clinic
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
                Reject {selectedClinic?.name}?
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
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmReject}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!rejectionReason.trim()}
            >
              Reject Clinic
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
                value={clinicForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter clinic name"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Clinic Type *
              </label>
              <select
                value={clinicForm.type}
                onChange={(e) => handleFormChange("type", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Private Clinic">Private Clinic</option>
                <option value="Public Clinic">Public Clinic</option>
                <option value="NGO Clinic">NGO Clinic</option>
                <option value="Mobile Clinic">Mobile Clinic</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Location *
              </label>
              <input
                type="text"
                value={clinicForm.location}
                onChange={(e) => handleFormChange("location", e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number *
              </label>
              <input
                type="tel"
                value={clinicForm.contact}
                onChange={(e) => handleFormChange("contact", e.target.value)}
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
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Operating Hours
              </label>
              <input
                type="text"
                value={clinicForm.operatingHours}
                onChange={(e) =>
                  handleFormChange("operatingHours", e.target.value)
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="e.g., Mon-Fri: 8am-6pm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Services
            </label>
            <input
              type="text"
              placeholder="Enter services separated by commas (e.g., Pediatrics, Emergency Care, Vaccinations)"
              className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
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
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmCreate}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600"
            >
              <MdAdd className="h-5 w-5" />
              Create Clinic
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
          <button className="linear flex items-center justify-center rounded-lg bg-lightPrimary px-4 py-2 text-sm font-medium text-brand-500 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20">
            <MdFilterList className="mr-2 h-4 w-4" />
            Filter
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
            <div className="mt-3 text-xs font-medium text-gray-600 dark:text-gray-300">
              {stat.trend}
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
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition-all duration-200 hover:scale-105 ${
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
        {/* Pending Verification List */}
        <div className="lg:col-span-2">
          <Card extra="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-navy-700 dark:text-white">
                  Pending Verification
                </h4>
                <p className="text-sm text-gray-600">
                  {pendingClinics.length} clinics awaiting review
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm transition-all duration-200 hover:bg-gray-50 dark:border-gray-600 dark:bg-navy-700">
                  <option>Sort by: Newest First</option>
                  <option>Oldest First</option>
                  <option>Location</option>
                </select>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
                  <FaDownload className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {pendingClinics.map((clinic) => (
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
                              {clinic.name}
                            </h5>
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 transition-all duration-200 hover:scale-105 dark:bg-navy-700 dark:text-gray-300">
                              {clinic.type}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <MdLocationOn className="mr-2 h-4 w-4" />
                            {clinic.location}
                          </div>
                          <div className="mt-2 flex items-center text-sm">
                            <FaFileMedical className="mr-2 h-4 w-4 text-gray-400" />
                            <DocumentStatus documents={clinic.documents} />
                            <span className="ml-2 text-gray-500">
                              Documents
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">
                            Submitted: {clinic.submitted}
                          </div>
                          <div className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {clinic.contact}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {clinic.services.map((service, index) => (
                          <span
                            key={index}
                            className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 transition-all duration-200 hover:scale-105 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
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
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Showing 1-{pendingClinics.length} of {pendingClinics.length}{" "}
                clinics
              </div>
              <div className="flex items-center space-x-2">
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
                  Previous
                </button>
                <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white transition-all duration-200 hover:scale-105 hover:bg-brand-600">
                  1
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
                  2
                </button>
                <button className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105 hover:bg-gray-50 dark:border-gray-600">
                  Next
                </button>
              </div>
            </div>
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
              {[
                {
                  id: 101,
                  name: "Hillbrow Community Clinic",
                  location: "Johannesburg, Gauteng",
                  type: "Public Clinic",
                  verifiedDate: "2024-01-10",
                  verifiedBy: "Dr. Sarah Johnson",
                  status: "approved",
                },
                {
                  id: 102,
                  name: "Khayelitsha Health Center",
                  location: "Cape Town, WC",
                  type: "Public Clinic",
                  verifiedDate: "2024-01-09",
                  verifiedBy: "Dr. Michael Chen",
                  status: "approved",
                },
              ].map((clinic) => (
                <div
                  key={clinic.id}
                  className="rounded-lg border border-gray-200 p-3 transition-all duration-300 hover:scale-[1.02] hover:border-brand-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium text-navy-700 dark:text-white">
                        {clinic.name}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                        {clinic.location}
                      </div>
                    </div>
                    {getStatusBadge(clinic.status)}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Verified {clinic.verifiedDate} by {clinic.verifiedBy}
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
                    className={`mr-3 rounded-full bg-${item.color}-100 p-1 dark:bg-${item.color}-900`}
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
              <button className="w-full rounded-lg bg-brand-50 py-3 text-sm font-medium text-brand-600 transition-all duration-200 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-300">
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
