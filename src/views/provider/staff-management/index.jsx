import React, { useState, useEffect, useMemo } from "react";
import { MdPersonAdd } from "react-icons/md";
import { useToast } from "hooks/useToast";
import { useStaff } from "hooks/useStaff";
import { useAuth } from "context/AuthContext";
import { useProvider } from "hooks/useProvider";

// Component imports
import StatsCards from "./components/StatsCards";
import StaffTable from "./components/StaffTable";
import PendingInvitations from "./components/PendingInvitations";
import InviteStaffModal from "./components/InviteStaffModal";
import EditStaffModal from "./components/EditStaffModal";
import DeleteStaffModal from "./components/DeleteStaffModal";
import SuspendStaffModal from "./components/SuspendStaffModal";

// Utility imports
import {
  getRoleIcon,
  getRoleLabel,
  getStatusBadge,
  formatDate,
} from "./components/staffUtils";

const StaffManagement = () => {
  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);

  // Invite form states
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

  // Hooks
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

  const currentUser = getCurrentUser();
  const [clinicLoading, setClinicLoading] = useState(true);
  const [clinicId, setClinicId] = useState(null);

  // Edit form state
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

  // Computed values using useMemo
  const activeDoctors = useMemo(
    () =>
      staffList.filter(
        (s) => s.staff_role === "doctor" && s.employment_status === "active"
      ),
    [staffList]
  );

  const nurses = useMemo(
    () => staffList.filter((s) => s.staff_role === "nurse"),
    [staffList]
  );

  const pendingInvites = useMemo(() => invitations.length, [invitations]);

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

  // Load staff data when clinicId is available
  useEffect(() => {
    if (clinicId) {
      loadStaffData();
    }
  }, [clinicId]);

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [error]);

  // Load staff data
  const loadStaffData = async () => {
    if (!clinicId) return;
    await listClinicStaff(clinicId);
    await getPendingInvitations(clinicId);
  };

  // Handle invite staff
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

      loadStaffData();
    } else {
      showToast(result.error || "Failed to send invitation", "error");
    }
  };

  // Handle edit click
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

  // Handle delete click
  const handleDeleteClick = (staff) => {
    setSelectedStaff(staff);
    setDeleteModalOpen(true);
  };

  // Handle suspend click
  const handleSuspendClick = (staff) => {
    setSelectedStaff(staff);
    setSuspendModalOpen(true);
  };

  // Confirm edit
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

  // Confirm delete
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

  // Confirm suspend
  const confirmSuspend = async () => {
    if (!selectedStaff) return;

    const result = await updateStaff(selectedStaff.id, {
      employment_status: "suspended",
    });

    if (result.success) {
      showToast("Staff member suspended successfully!", "success");
      setSuspendModalOpen(false);
      loadStaffData();
    } else {
      showToast(result.error || "Failed to suspend staff member", "error");
    }
  };

  // Handle cancel invitation
  const handleCancelInvitation = async (token) => {
    if (!clinicId) return;

    const result = await cancelInvitation(clinicId, token);

    if (result.success) {
      showToast("Invitation cancelled successfully!", "success");
      loadStaffData();
    } else {
      showToast(result.error || "Failed to cancel invitation", "error");
    }
  };

  return (
    <div className="mt-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-navy-700 dark:text-white">
            Staff Management
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your clinic's team members and permissions
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center rounded-lg bg-brand-500 px-4 py-2 font-medium text-white hover:bg-brand-600"
        >
          <MdPersonAdd className="mr-2" />
          Invite Staff
        </button>
      </div>

      {/* Stats Cards */}
      <StatsCards
        staffTotal={staffTotal}
        staffList={staffList}
        activeDoctors={activeDoctors}
        nurses={nurses}
        pendingInvites={pendingInvites}
      />

      {/* Staff Table */}
      <StaffTable
        clinicLoading={clinicLoading}
        clinicId={clinicId}
        loading={loading}
        staffList={staffList}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        getRoleIcon={getRoleIcon}
        getRoleLabel={getRoleLabel}
        getStatusBadge={getStatusBadge}
        formatDate={formatDate}
      />

      {/* Pending Invitations */}
      <PendingInvitations
        invitations={invitations}
        getRoleLabel={getRoleLabel}
        formatDate={formatDate}
        handleCancelInvitation={handleCancelInvitation}
        loading={loading}
      />

      {/* Modals */}
      <InviteStaffModal
        showInviteModal={showInviteModal}
        setShowInviteModal={setShowInviteModal}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteFirstName={inviteFirstName}
        setInviteFirstName={setInviteFirstName}
        inviteLastName={inviteLastName}
        setInviteLastName={setInviteLastName}
        invitePhone={invitePhone}
        setInvitePhone={setInvitePhone}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        inviteDepartment={inviteDepartment}
        setInviteDepartment={setInviteDepartment}
        inviteProfessionalTitle={inviteProfessionalTitle}
        setInviteProfessionalTitle={setInviteProfessionalTitle}
        inviteCanManageStaff={inviteCanManageStaff}
        setInviteCanManageStaff={setInviteCanManageStaff}
        inviteCanApproveAppointments={inviteCanApproveAppointments}
        setInviteCanApproveAppointments={setInviteCanApproveAppointments}
        inviteCanEditClinicInfo={inviteCanEditClinicInfo}
        setInviteCanEditClinicInfo={setInviteCanEditClinicInfo}
        handleInviteStaff={handleInviteStaff}
        loading={loading}
      />

      <EditStaffModal
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        selectedStaff={selectedStaff}
        editForm={editForm}
        setEditForm={setEditForm}
        confirmEdit={confirmEdit}
        loading={loading}
      />

      <DeleteStaffModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        selectedStaff={selectedStaff}
        confirmDelete={confirmDelete}
        loading={loading}
      />

      <SuspendStaffModal
        suspendModalOpen={suspendModalOpen}
        setSuspendModalOpen={setSuspendModalOpen}
        selectedStaff={selectedStaff}
        confirmSuspend={confirmSuspend}
        loading={loading}
      />
    </div>
  );
};

export default StaffManagement;
