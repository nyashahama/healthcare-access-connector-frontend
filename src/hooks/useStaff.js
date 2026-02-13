import { useCallback, useState, useEffect } from "react";
import staffService from "api/services/staffService";

/**
 * Custom hook for staff operations (CRUD, invitations, lists)
 * @returns {Object} Staff methods and state
 */
export const useStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Staff member state
  const [staff, setStaff] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [staffTotal, setStaffTotal] = useState(0);

  // Invitation state
  const [invitation, setInvitation] = useState(null);
  const [invitations, setInvitations] = useState([]);
  const [invitationsTotal, setInvitationsTotal] = useState(0);

  // ========== Staff CRUD ==========
  const createStaff = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.createStaff(data);
      setStaff(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to create staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getStaff = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.getStaff(staffId);

      setStaff(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to load staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateStaff = useCallback(async (staffId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.updateStaff(staffId, data);
      setStaff(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteStaff = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);
    try {
      await staffService.deleteStaff(staffId);
      setStaff(null);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const checkStaffExists = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.checkStaffExists(staffId);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to check staff existence";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ========== Clinic Staff Lists ==========
  const listClinicStaff = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.listClinicStaff(clinicId);
      setStaffList(response.staff || []);
      setStaffTotal(response.total || 0);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to list clinic staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const listActiveClinicStaff = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.listActiveClinicStaff(clinicId);
      setStaffList(response.staff || []);
      setStaffTotal(response.total || 0);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to list active clinic staff";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ========== Staff Invitations ==========
  const inviteStaff = useCallback(async (clinicId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.inviteStaff(clinicId, data);
      // response contains staff data with invitation token
      setInvitation(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Failed to send invitation";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getInvitationDetails = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.getInvitationDetails(token);
      setInvitation(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to get invitation details";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const acceptInvitation = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.acceptInvitation(token);
      setStaff(response.staff); // set the newly created staff
      setInvitation(null); // invitation is consumed
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to accept invitation";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const declineInvitation = useCallback(async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.declineInvitation(token);
      setInvitation(null);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to decline invitation";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getPendingInvitations = useCallback(async (clinicId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.getPendingInvitations(clinicId);
      setInvitations(response.staff || []);
      setInvitationsTotal(response.total || 0);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to get pending invitations";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getMyInvitations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.getMyInvitations();
      setInvitations(response.invitations || []);
      setInvitationsTotal(response.total || 0);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to get your invitations";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const cancelInvitation = useCallback(async (clinicId, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.cancelInvitation(clinicId, token);
      // Remove from local invitations list if present
      setInvitations((prev) =>
        prev.filter((inv) => inv.invitation_token !== token)
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to cancel invitation";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const resendInvitation = useCallback(async (clinicId, invitationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffService.resendInvitation(
        clinicId,
        invitationId
      );
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to resend invitation";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // ========== Utility Methods ==========
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearStaffState = useCallback(() => {
    setStaff(null);
    setStaffList([]);
    setStaffTotal(0);
    setInvitation(null);
    setInvitations([]);
    setInvitationsTotal(0);
    setError(null);
  }, []);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      setError(null);
    };
  }, []);

  return {
    // Staff CRUD
    createStaff,
    getStaff,
    updateStaff,
    deleteStaff,
    checkStaffExists,

    // Clinic Staff Lists
    listClinicStaff,
    listActiveClinicStaff,

    // Staff Invitations
    inviteStaff,
    getInvitationDetails,
    acceptInvitation,
    declineInvitation,
    getPendingInvitations,
    getMyInvitations,
    cancelInvitation,
    resendInvitation,

    // Utility
    clearError,
    clearStaffState,

    // State
    loading,
    error,
    staff,
    staffList,
    staffTotal,
    invitation,
    invitations,
    invitationsTotal,

    // Derived State
    hasStaff: !!staff,
    hasStaffList: staffList.length > 0,
    hasInvitation: !!invitation,
    hasInvitations: invitations.length > 0,
  };
};
