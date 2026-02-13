import React, { useState, useEffect } from "react";
import {
  MdPersonAdd,
  MdEmail,
  MdContentCopy,
  MdEdit,
  MdDelete,
  MdVerified,
  MdPendingActions,
  MdSave,
  MdWarning,
  MdCheckCircle,
  MdInfo,
  MdPhone,
} from "react-icons/md";
import { FaUserMd, FaUserNurse } from "react-icons/fa";
import Card from "components/card";
import Modal from "components/modal/Modal";
import { useToast } from "hooks/useToast";
import { useStaff } from "hooks/useStaff";
import { useAuth } from "context/AuthContext";
import { useProvider } from "hooks/useProvider";

const StaffManagement = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("doctor");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [inviteProfessionalTitle, setInviteProfessionalTitle] = useState("");
  const [inviteCanManageStaff, setInviteCanManageStaff] = useState(false);
  const [inviteCanApproveAppointments, setInviteCanApproveAppointments] =
    useState(false);
  const [inviteCanEditClinicInfo, setInviteCanEditClinicInfo] = useState(false);

  const [selectedStaff, setSelectedStaff] = useState(null);

  const { showToast } = useToast();
  const { getCurrentUser } = useAuth();

  const {
    loading,
    error,
    staffList,
    staffTotal,
    invitations,
    listClinicStaff,
    inviteStaff,
    updateStaff,
    deleteStaff,
    getPendingInvitations,
    cancelInvitation,
    clearError,
  } = useStaff();

  const { clinic, getMyClinic } = useProvider();

  // Get current user
  const currentUser = getCurrentUser();

  const [clinicLoading, setClinicLoading] = useState(true);
  const [clinicId, setClinicId] = useState(null);

  // Fetch clinic on mount
  useEffect(() => {
    const fetchClinic = async () => {
      setClinicLoading(true);
      const result = await getMyClinic();

      if (result.success && result.data) {
        setClinicId(result.data.id);
      }
      setClinicLoading(false);
    };

    fetchClinic();
  }, [getMyClinic]);

  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    work_email: "",
    work_phone: "",
    staff_role: "doctor",
    department: "",
    professional_title: "",
    employment_status: "active",
    available_days: [],
    is_accepting_new_patients: true,
    can_manage_staff: false,
    can_approve_appointments: false,
    can_edit_clinic_info: false,
  });

  // Load staff list when clinicId is available
  useEffect(() => {
    if (clinicId) {
      loadStaffData();
    }
  }, [clinicId]);

  const loadStaffData = async () => {
    if (!clinicId) {
      return;
    }

    await listClinicStaff(clinicId);
    await getPendingInvitations(clinicId);
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [error]);

  const handleInviteStaff = async () => {
    if (!inviteEmail || !inviteRole || !inviteFirstName || !inviteLastName) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!clinicId) {
      showToast(
        "Clinic information not loaded. Please refresh the page.",
        "error"
      );
      return;
    }

    const inviteData = {
      work_email: inviteEmail,
      first_name: inviteFirstName,
      last_name: inviteLastName,
      staff_role: inviteRole,
      professional_title: inviteProfessionalTitle || undefined,
      work_phone: invitePhone || undefined,
      department: inviteDepartment || undefined,
      can_manage_staff: inviteCanManageStaff,
      can_approve_appointments: inviteCanApproveAppointments,
      can_edit_clinic_info: inviteCanEditClinicInfo,
    };

    const result = await inviteStaff(clinicId, inviteData);

    if (result.success) {
      showToast(
        `Invitation sent to ${inviteFirstName} ${inviteLastName}`,
        "success"
      );

      // Reset form
      setInviteEmail("");
      setInviteRole("doctor");
      setInviteFirstName("");
      setInviteLastName("");
      setInvitePhone("");
      setInviteDepartment("");
      setInviteProfessionalTitle("");
      setInviteCanManageStaff(false);
      setInviteCanApproveAppointments(false);
      setInviteCanEditClinicInfo(false);
      setShowInviteModal(false);

      // Reload data
      loadStaffData();
    } else {
      showToast(result.error || "Failed to send invitation", "error");
    }
  };

  const handleEditClick = (staff) => {
    setSelectedStaff(staff);
    setEditForm({
      first_name: staff.first_name || "",
      last_name: staff.last_name || "",
      work_email: staff.work_email || "",
      work_phone: staff.work_phone || "",
      staff_role: staff.staff_role || "doctor",
      department: staff.department || "",
      professional_title: staff.professional_title || "",
      employment_status: staff.employment_status || "active",
      available_days: staff.available_days || [],
      is_accepting_new_patients: staff.is_accepting_new_patients ?? true,
      can_manage_staff: staff.can_manage_staff || false,
      can_approve_appointments: staff.can_approve_appointments || false,
      can_edit_clinic_info: staff.can_edit_clinic_info || false,
    });
    setEditModalOpen(true);
  };

  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  const handleSuspendClick = (staff) => {
    setSelectedStaff(staff);
    setSuspendModalOpen(true);
  };

  const confirmEdit = async () => {
    if (!selectedStaff) return;

    const result = await updateStaff(selectedStaff.id, editForm);

    if (result.success) {
      showToast("Staff member updated successfully!", "success");
      setEditModalOpen(false);
      loadStaffData();
    } else {
      showToast(result.error || "Failed to update staff member", "error");
    }
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;

    const result = await deleteStaff(selectedStaff.id);

    if (result.success) {
      showToast("Staff member removed successfully!", "success");
      setDeleteModalOpen(false);
      loadStaffData();
    } else {
      showToast(result.error || "Failed to delete staff member", "error");
    }
  };

  const confirmSuspend = async () => {
    if (!selectedStaff) return;

    const newStatus =
      selectedStaff.employment_status === "active" ? "inactive" : "active";

    const result = await updateStaff(selectedStaff.id, {
      employment_status: newStatus,
    });

    if (result.success) {
      showToast(
        `Staff member ${
          newStatus === "inactive" ? "suspended" : "reactivated"
        }!`,
        newStatus === "inactive" ? "warning" : "success"
      );
      setSuspendModalOpen(false);
      loadStaffData();
    } else {
      showToast(result.error || "Failed to update staff status", "error");
    }
  };

  const handleCancelInvitation = async (invitationToken) => {
    if (!clinicId) {
      showToast("Clinic information not loaded", "error");
      return;
    }

    const result = await cancelInvitation(clinicId, invitationToken);

    if (result.success) {
      showToast("Invitation cancelled successfully!", "success");
      loadStaffData();
    } else {
      showToast(result.error || "Failed to cancel invitation", "error");
    }
  };

  const handleFormChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getStatusBadge = (employmentStatus) => {
    switch (employmentStatus) {
      case "active":
        return (
          <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-300">
            <MdVerified className="mr-1" />
            Active
          </span>
        );
      case "pending":
        return (
          <span className="flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <MdPendingActions className="mr-1" />
            Pending
          </span>
        );
      case "inactive":
      case "suspended":
        return (
          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const getRoleIcon = (role) => {
    return role === "doctor" ? (
      <FaUserMd className="text-blue-500" />
    ) : (
      <FaUserNurse className="text-green-500" />
    );
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      doctor: "Doctor",
      nurse: "Nurse",
      receptionist: "Receptionist",
      admin: "Administrator",
      owner: "Owner",
    };
    return roleMap[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Calculate stats
  const activeStaff = staffList.filter((s) => s.employment_status === "active");
  const activeDoctors = activeStaff.filter((s) => s.staff_role === "doctor");
  const nurses = staffList.filter((s) => s.staff_role === "nurse");
  const pendingInvites = invitations.length;

  return (
    <div className="h-full">
      {/* Modals */}
      {/* Edit Staff Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Staff Member"
        size="lg"
      >
        {selectedStaff && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name *
                </label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) =>
                    handleFormChange("first_name", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) =>
                    handleFormChange("last_name", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email *
                </label>
                <input
                  type="email"
                  value={editForm.work_email}
                  onChange={(e) =>
                    handleFormChange("work_email", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.work_phone}
                  onChange={(e) =>
                    handleFormChange("work_phone", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role *
                </label>
                <select
                  value={editForm.staff_role}
                  onChange={(e) =>
                    handleFormChange("staff_role", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                >
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <input
                  type="text"
                  value={editForm.department}
                  onChange={(e) =>
                    handleFormChange("department", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Professional Title
                </label>
                <input
                  type="text"
                  value={editForm.professional_title}
                  onChange={(e) =>
                    handleFormChange("professional_title", e.target.value)
                  }
                  placeholder="e.g., Registered Nurse, MD"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status *
                </label>
                <select
                  value={editForm.employment_status}
                  onChange={(e) =>
                    handleFormChange("employment_status", e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on_leave">On Leave</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accepting-patients"
                  checked={editForm.is_accepting_new_patients}
                  onChange={(e) =>
                    handleFormChange(
                      "is_accepting_new_patients",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label
                  htmlFor="accepting-patients"
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Accepting new patients
                </label>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-600">
              <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Permissions
              </h5>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-can-manage-staff"
                    checked={editForm.can_manage_staff}
                    onChange={(e) =>
                      handleFormChange("can_manage_staff", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label
                    htmlFor="edit-can-manage-staff"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Can manage staff members
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-can-approve-appointments"
                    checked={editForm.can_approve_appointments}
                    onChange={(e) =>
                      handleFormChange(
                        "can_approve_appointments",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label
                    htmlFor="edit-can-approve-appointments"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Can approve appointments
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="edit-can-edit-clinic-info"
                    checked={editForm.can_edit_clinic_info}
                    onChange={(e) =>
                      handleFormChange("can_edit_clinic_info", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                  />
                  <label
                    htmlFor="edit-can-edit-clinic-info"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Can edit clinic information
                  </label>
                </div>
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
                disabled={loading}
                className="linear flex items-center rounded-lg bg-brand-500 px-6 py-3 font-medium text-white transition duration-200 hover:bg-brand-600 disabled:opacity-50"
              >
                <MdSave className="mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Staff Member"
        size="md"
      >
        <div className="space-y-6">
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
            <div className="flex items-start">
              <MdWarning className="mr-3 mt-0.5 h-6 w-6 text-red-500" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-300">
                  Warning: This action cannot be undone
                </h4>
                <p className="mt-2 text-sm text-red-700 dark:text-red-300">
                  Are you sure you want to remove{" "}
                  <strong>
                    {selectedStaff?.first_name} {selectedStaff?.last_name}
                  </strong>{" "}
                  from your clinic? All their data and access will be
                  permanently deleted.
                </p>
              </div>
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
              disabled={loading}
              className="rounded-lg bg-red-500 px-6 py-3 font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete Staff Member"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Suspend/Reactivate Modal */}
      <Modal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        title={
          selectedStaff?.employment_status === "active"
            ? "Suspend Staff Member"
            : "Reactivate Staff Member"
        }
        size="md"
      >
        <div className="space-y-6">
          <div
            className={`rounded-lg p-4 ${
              selectedStaff?.employment_status === "active"
                ? "bg-yellow-50 dark:bg-yellow-900/20"
                : "bg-green-50 dark:bg-green-900/20"
            }`}
          >
            <div className="flex items-start">
              {selectedStaff?.employment_status === "active" ? (
                <MdWarning className="mr-3 mt-0.5 h-6 w-6 text-yellow-500" />
              ) : (
                <MdCheckCircle className="mr-3 mt-0.5 h-6 w-6 text-green-500" />
              )}
              <div>
                <h4
                  className={`font-medium ${
                    selectedStaff?.employment_status === "active"
                      ? "text-yellow-800 dark:text-yellow-300"
                      : "text-green-800 dark:text-green-300"
                  }`}
                >
                  {selectedStaff?.employment_status === "active"
                    ? "Suspend Staff Access"
                    : "Reactivate Staff Access"}
                </h4>
                <p
                  className={`mt-2 text-sm ${
                    selectedStaff?.employment_status === "active"
                      ? "text-yellow-700 dark:text-yellow-300"
                      : "text-green-700 dark:text-green-300"
                  }`}
                >
                  {selectedStaff?.employment_status === "active"
                    ? `${selectedStaff?.first_name} ${selectedStaff?.last_name} will lose access to the system until reactivated.`
                    : `${selectedStaff?.first_name} ${selectedStaff?.last_name} will regain full access to the system.`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setSuspendModalOpen(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={confirmSuspend}
              disabled={loading}
              className={`rounded-lg px-6 py-3 font-medium text-white disabled:opacity-50 ${
                selectedStaff?.employment_status === "active"
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading
                ? "Processing..."
                : selectedStaff?.employment_status === "active"
                ? "Suspend"
                : "Reactivate"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Invite Staff Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Staff Member"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name *
              </label>
              <input
                type="text"
                value={inviteFirstName}
                onChange={(e) => setInviteFirstName(e.target.value)}
                placeholder="John"
                className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name *
              </label>
              <input
                type="text"
                value={inviteLastName}
                onChange={(e) => setInviteLastName(e.target.value)}
                placeholder="Doe"
                className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="staff@example.com"
                className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <div className="relative">
                <MdPhone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="+27 123 456 789"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 dark:border-navy-600 dark:bg-navy-700"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
              >
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Professional Title
              </label>
              <input
                type="text"
                value={inviteProfessionalTitle}
                onChange={(e) => setInviteProfessionalTitle(e.target.value)}
                placeholder="e.g., Registered Nurse, MD"
                className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Department
              </label>
              <input
                type="text"
                value={inviteDepartment}
                onChange={(e) => setInviteDepartment(e.target.value)}
                placeholder="e.g., Cardiology, Pediatrics"
                className="w-full rounded-lg border border-gray-300 bg-white p-3 dark:border-navy-600 dark:bg-navy-700"
              />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-600">
            <h5 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Permissions
            </h5>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="can-manage-staff"
                  checked={inviteCanManageStaff}
                  onChange={(e) => setInviteCanManageStaff(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label
                  htmlFor="can-manage-staff"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Can manage staff members
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="can-approve-appointments"
                  checked={inviteCanApproveAppointments}
                  onChange={(e) =>
                    setInviteCanApproveAppointments(e.target.checked)
                  }
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label
                  htmlFor="can-approve-appointments"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Can approve appointments
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="can-edit-clinic-info"
                  checked={inviteCanEditClinicInfo}
                  onChange={(e) => setInviteCanEditClinicInfo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                />
                <label
                  htmlFor="can-edit-clinic-info"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Can edit clinic information
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <div className="flex items-start">
              <MdInfo className="mr-2 mt-0.5 h-5 w-5 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                An invitation email with a registration link will be sent to
                this address. The new staff member will be added to your clinic
                after they complete registration.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowInviteModal(false)}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium hover:bg-gray-50 dark:border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleInviteStaff}
              disabled={loading}
              className="linear rounded-lg bg-brand-500 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </div>
      </Modal>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-navy-700 dark:text-white">
            Staff Management
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {clinicLoading
              ? "Loading clinic information..."
              : clinic?.clinic_name
              ? `Manage staff at ${clinic.clinic_name}`
              : "Manage doctors and nurses at your clinic"}
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          disabled={clinicLoading || !clinicId}
          className="linear flex items-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MdPersonAdd className="mr-2" />
          Invite Staff
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Total Staff</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {staffTotal || staffList.length}
          </p>
        </Card>
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Active Doctors</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {activeDoctors.length}
          </p>
        </Card>
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Nurses</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {nurses.length}
          </p>
        </Card>
        <Card extra="p-4">
          <p className="text-sm text-gray-600">Pending Invites</p>
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            {pendingInvites}
          </p>
        </Card>
      </div>

      {/* Staff List */}
      <Card extra="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Team Members
          </h4>
        </div>

        {clinicLoading ? (
          <div className="py-8 text-center text-gray-500">
            <div className="mb-2">Loading clinic information...</div>
          </div>
        ) : !clinicId ? (
          <div className="py-8 text-center">
            <div className="mb-2 text-red-500">
              Unable to load clinic information
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-brand-500 hover:text-brand-600"
            >
              Refresh page
            </button>
          </div>
        ) : loading && staffList.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            Loading staff members...
          </div>
        ) : staffList.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No staff members found. Invite your first team member!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-600">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Staff Member
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Role
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Department
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Status
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Start Date
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((staff) => (
                  <tr
                    key={staff.id}
                    className="border-b border-gray-100 dark:border-navy-700"
                  >
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
                          {getRoleIcon(staff.staff_role)}
                        </div>
                        <div>
                          <p className="font-medium text-navy-700 dark:text-white">
                            {staff.first_name} {staff.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {staff.work_email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          staff.staff_role === "doctor"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : staff.staff_role === "nurse"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                        }`}
                      >
                        {getRoleLabel(staff.staff_role)}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {staff.department || "N/A"}
                    </td>
                    <td className="py-4">
                      {getStatusBadge(staff.employment_status)}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {formatDate(staff.start_date)}
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(staff)}
                          className="rounded-lg p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          title="Edit"
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(staff)}
                          className="rounded-lg p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pending Invitations Section */}
      {invitations.length > 0 && (
        <Card extra="p-6 mt-6">
          <div className="mb-4">
            <h4 className="text-lg font-bold text-navy-700 dark:text-white">
              Pending Invitations
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Staff members who haven't accepted their invitation yet
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-navy-600">
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Name
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Email
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Role
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Invited On
                  </th>
                  <th className="pb-3 text-left text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((invitation) => (
                  <tr
                    key={invitation.id || invitation.invitation_token}
                    className="border-b border-gray-100 dark:border-navy-700"
                  >
                    <td className="py-4 text-sm font-medium text-navy-700 dark:text-white">
                      {invitation.first_name} {invitation.last_name}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {invitation.work_email}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                        {getRoleLabel(invitation.staff_role)}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {formatDate(invitation.invited_at)}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() =>
                          handleCancelInvitation(invitation.invitation_token)
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StaffManagement;
