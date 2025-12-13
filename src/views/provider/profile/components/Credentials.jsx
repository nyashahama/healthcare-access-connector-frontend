import React, { useState } from "react";
import {
  FaCertificate,
  FaUserMd,
  FaGraduationCap,
  FaAward,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { MdVerified, MdFileUpload, MdEdit, MdWarning } from "react-icons/md";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";

const Credentials = () => {
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      type: "Professional License",
      number: "HPCSA 1234567",
      issuer: "Health Professions Council of SA",
      expiry: "2025-12-31",
      status: "verified",
      icon: <FaCertificate />,
      fileUrl: "#",
    },
    {
      id: 2,
      type: "Specialization Certificate",
      number: "FAM MED 789",
      issuer: "College of Family Physicians",
      expiry: "2026-06-30",
      status: "verified",
      icon: <FaUserMd />,
      fileUrl: "#",
    },
    {
      id: 3,
      type: "Medical Degree",
      number: "MBChB 2010",
      issuer: "University of Cape Town",
      expiry: null,
      status: "verified",
      icon: <FaGraduationCap />,
      fileUrl: "#",
    },
    {
      id: 4,
      type: "Advanced Life Support",
      number: "ALS 456",
      issuer: "Resuscitation Council SA",
      expiry: "2024-09-15",
      status: "pending",
      icon: <FaAward />,
      fileUrl: "#",
    },
  ]);

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    type: "Professional License",
    number: "",
    issuer: "",
    expiry: "",
    file: null,
  });

  const { showToast } = useToast();

  // Modal handlers
  const handleViewCredential = (cred) => {
    setSelectedCredential(cred);
    setViewModalOpen(true);
  };

  const handleEditCredential = (cred) => {
    setSelectedCredential(cred);
    setUploadForm({
      type: cred.type,
      number: cred.number,
      issuer: cred.issuer,
      expiry: cred.expiry || "",
      file: null,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (cred) => {
    setSelectedCredential(cred);
    setDeleteModalOpen(true);
  };

  const handleUploadClick = () => {
    setUploadForm({
      type: "Professional License",
      number: "",
      issuer: "",
      expiry: "",
      file: null,
    });
    setUploadModalOpen(true);
  };

  // Action confirmations
  const confirmDelete = () => {
    console.log(`Deleting credential ${selectedCredential.id}`);
    setDeleteModalOpen(false);
    showToast("Credential deleted successfully!", "error");
  };

  const confirmUpload = () => {
    console.log("Uploading credential", uploadForm);
    setUploadModalOpen(false);
    showToast("Credential uploaded for verification!", "success");
  };

  const confirmEdit = () => {
    console.log(`Editing credential ${selectedCredential.id}`, uploadForm);
    setEditModalOpen(false);
    showToast("Credential updated successfully!", "success");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return (
          <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            <MdVerified className="mr-1" />
            Verified
          </span>
        );
      case "pending":
        return (
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </span>
        );
      case "expired":
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getExpiryStatus = (expiry) => {
    if (!expiry) return { text: "No expiry", color: "text-gray-600" };

    const today = new Date();
    const expiryDate = new Date(expiry);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: "Expired", color: "text-red-600" };
    if (diffDays < 30)
      return { text: `Expires in ${diffDays} days`, color: "text-orange-600" };
    return {
      text: `Expires ${expiryDate.toLocaleDateString()}`,
      color: "text-green-600",
    };
  };

  return (
    <Card extra={"w-full h-full p-6"}>
      {/* View Credential Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Credential Details"
        size="lg"
      >
        {selectedCredential && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                  {selectedCredential.icon}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
                    {selectedCredential.type}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {selectedCredential.number}
                  </p>
                </div>
              </div>
              {getStatusBadge(selectedCredential.status)}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-500">
                  Issuer
                </h5>
                <p className="text-lg font-medium">
                  {selectedCredential.issuer}
                </p>
              </div>
              <div>
                <h5 className="mb-2 text-sm font-medium text-gray-500">
                  Status
                </h5>
                <div className="flex items-center">
                  {getStatusBadge(selectedCredential.status)}
                  <span className="ml-2 text-sm text-gray-600">
                    {selectedCredential.expiry &&
                      `Valid until ${selectedCredential.expiry}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-700">
              <h5 className="mb-2 font-medium text-gray-700 dark:text-gray-300">
                Document Preview
              </h5>
              <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <FaCertificate className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Professional License Document
                  </p>
                  <p className="text-xs text-gray-500">PDF • 2.4MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600">
                Download
              </button>
              <button
                onClick={() => setViewModalOpen(false)}
                className="rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upload Credential Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload New Credential"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Credential Type *
              </label>
              <select
                value={uploadForm.type}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, type: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              >
                <option value="Professional License">
                  Professional License
                </option>
                <option value="Specialization Certificate">
                  Specialization Certificate
                </option>
                <option value="Medical Degree">Medical Degree</option>
                <option value="Advanced Life Support">
                  Advanced Life Support
                </option>
                <option value="Basic Life Support">Basic Life Support</option>
                <option value="Other Certification">Other Certification</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                License/Certificate Number *
              </label>
              <input
                type="text"
                value={uploadForm.number}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, number: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="Enter license number"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Issuing Authority *
              </label>
              <input
                type="text"
                value={uploadForm.issuer}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, issuer: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                placeholder="E.g., HPCSA, University of..."
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Expiry Date
              </label>
              <input
                type="date"
                value={uploadForm.expiry}
                onChange={(e) =>
                  setUploadForm({ ...uploadForm, expiry: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Upload Document *
            </label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8">
              <div className="text-center">
                <MdFileUpload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Drag & drop your file here
                </p>
                <p className="text-xs text-gray-500">
                  PDF, JPG, PNG up to 10MB
                </p>
                <button className="mt-4 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-navy-700">
                  Browse Files
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdVerified className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Documents will be verified within 2-3 business days. Make sure
                all information is clearly visible.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmUpload}
              className="flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 font-medium text-white hover:bg-brand-600"
            >
              <MdFileUpload className="h-5 w-5" />
              Upload Credential
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Credential"
        size="md"
      >
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="mr-3 rounded-full bg-red-100 p-2 dark:bg-red-900">
              <MdWarning className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <div>
              <h4 className="font-bold text-navy-700 dark:text-white">
                Delete "{selectedCredential?.type}"?
              </h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                This credential will be permanently removed from your profile.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600"
            >
              Delete Credential
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Credential Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Credential"
        size="lg"
      >
        {selectedCredential && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Credential Type *
                </label>
                <select
                  value={uploadForm.type}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, type: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                >
                  <option value="Professional License">
                    Professional License
                  </option>
                  <option value="Specialization Certificate">
                    Specialization Certificate
                  </option>
                  <option value="Medical Degree">Medical Degree</option>
                  <option value="Advanced Life Support">
                    Advanced Life Support
                  </option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  License/Certificate Number *
                </label>
                <input
                  type="text"
                  value={uploadForm.number}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, number: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="Enter license number"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Issuing Authority *
                </label>
                <input
                  type="text"
                  value={uploadForm.issuer}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, issuer: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                  placeholder="E.g., HPCSA, University of..."
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={uploadForm.expiry}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, expiry: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-600 dark:bg-navy-700"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <FaCertificate className="mr-3 text-brand-500" />
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Professional Credentials
          </h4>
        </div>
        <button
          onClick={handleUploadClick}
          className="flex items-center rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:scale-105 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-300"
        >
          <MdFileUpload className="mr-2" />
          Upload New
        </button>
      </div>

      {/* Credentials List */}
      <div className="space-y-4">
        {credentials.map((cred) => {
          const expiryStatus = getExpiryStatus(cred.expiry);

          return (
            <div
              key={cred.id}
              className="rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 dark:border-navy-600 dark:hover:bg-navy-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                    {cred.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-navy-700 dark:text-white">
                      {cred.type}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {cred.number} • Issued by {cred.issuer}
                    </p>
                    {cred.expiry && (
                      <p
                        className={`mt-1 text-sm font-medium ${expiryStatus.color}`}
                      >
                        {expiryStatus.text}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {getStatusBadge(cred.status)}
                  <div className="mt-2 flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleViewCredential(cred)}
                      className="rounded-lg p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-300"
                      title="View"
                    >
                      <FaEye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditCredential(cred)}
                      className="rounded-lg p-1 text-blue-600 hover:bg-blue-50 hover:text-blue-800 dark:text-blue-400"
                      title="Edit"
                    >
                      <MdEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(cred)}
                      className="rounded-lg p-1 text-red-600 hover:bg-red-50 hover:text-red-800 dark:text-red-400"
                      title="Delete"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* License Summary */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            3
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Active Licenses
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            1
          </p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Renewal Needed
          </p>
        </div>
      </div>

      {/* Accreditation */}
      <div className="mt-4">
        <h5 className="mb-2 font-bold text-navy-700 dark:text-white">
          Clinic Accreditations
        </h5>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            Department of Health
          </span>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            ISO 9001:2015
          </span>
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-300">
            OHSC Compliant
          </span>
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            POPIA Compliant
          </span>
        </div>
      </div>

      {/* Verification Note */}
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
        <div className="flex items-start">
          <MdVerified className="mr-3 mt-1 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-800 dark:text-green-300">
              All credentials verified by HealthConnect
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400">
              Last verification: 15 March 2024
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Credentials;
