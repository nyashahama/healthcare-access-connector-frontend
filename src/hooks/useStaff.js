import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import staffService from "api/services/staffService";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for staff operations (CRUD, invitations, lists)
 * @returns {Object} Staff methods and state
 */
export const useStaff = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active query keys for cache observation
  const [activeStaffKey, setActiveStaffKey] = useState(null);
  const [activeStaffListKey, setActiveStaffListKey] = useState(null);
  const [activeInvitationKey, setActiveInvitationKey] = useState(null);
  const [activeInvitationsKey, setActiveInvitationsKey] = useState(null);

  // Query observers
  const staffQuery = useQuery({
    queryKey: activeStaffKey || ["staff", "detail"],
    enabled: false,
  });

  const staffListQuery = useQuery({
    queryKey: activeStaffListKey || queryKeys.staff.list,
    enabled: false,
  });

  const invitationQuery = useQuery({
    queryKey: activeInvitationKey || ["staff", "invitation"],
    enabled: false,
  });

  const invitationsQuery = useQuery({
    queryKey: activeInvitationsKey || ["staff", "invitations"],
    enabled: false,
  });

  // Derived state from queries
  const staff = staffQuery.data || null;
  const staffList = staffListQuery.data?.staff || [];
  const staffTotal = staffListQuery.data?.total || 0;
  const invitation = invitationQuery.data || null;
  const invitations =
    invitationsQuery.data?.staff ||
    invitationsQuery.data?.invitations ||
    [];
  const invitationsTotal = invitationsQuery.data?.total || 0;

  // ========== Mutations ==========
  const createStaffMutation = useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: (data) => {
      queryClient.setQueryData(["staff", "detail", data.id], data);
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list });
    },
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ staffId, data }) => staffService.updateStaff(staffId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["staff", "detail", variables.staffId],
        data
      );
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: staffService.deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list });
    },
  });

  const inviteStaffMutation = useMutation({
    mutationFn: ({ clinicId, data }) => staffService.inviteStaff(clinicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "invitations"] });
    },
  });

  const acceptInvitationMutation = useMutation({
    mutationFn: staffService.acceptInvitation,
    onSuccess: (data) => {
      if (data.staff) {
        queryClient.setQueryData(
          ["staff", "detail", data.staff.id],
          data.staff
        );
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list });
      queryClient.invalidateQueries({ queryKey: ["staff", "invitations"] });
    },
  });

  const declineInvitationMutation = useMutation({
    mutationFn: staffService.declineInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "invitations"] });
    },
  });

  const cancelInvitationMutation = useMutation({
    mutationFn: ({ clinicId, token }) =>
      staffService.cancelInvitation(clinicId, token),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["staff", "invitations"],
        type: "all",
      });
    },
  });

  const resendInvitationMutation = useMutation({
    mutationFn: ({ clinicId, invitationId }) =>
      staffService.resendInvitation(clinicId, invitationId),
  });

  // ========== Staff CRUD ==========
  const createStaff = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await createStaffMutation.mutateAsync(data);
        setActiveStaffKey(["staff", "detail", response.id]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to create staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [createStaffMutation]
  );

  const getStaff = useCallback(
    async (staffId) => {
      const key = ["staff", "detail", staffId];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getStaff(staffId),
        });
        setActiveStaffKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const getStaffByUserId = useCallback(
    async (userId) => {
      const key = ["staff", "by-user", userId];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getStaffByUserId(userId),
        });
        setActiveStaffKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to load staff by user ID";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const updateStaff = useCallback(
    async (staffId, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await updateStaffMutation.mutateAsync({
          staffId,
          data,
        });
        setActiveStaffKey(["staff", "detail", staffId]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to update staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [updateStaffMutation]
  );

  const deleteStaff = useCallback(
    async (staffId) => {
      setLoading(true);
      setError(null);
      try {
        await deleteStaffMutation.mutateAsync(staffId);
        setActiveStaffKey(null);
        setLoading(false);
        return { success: true };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to delete staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [deleteStaffMutation]
  );

  const checkStaffExists = useCallback(
    async (staffId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["staff", "exists", staffId],
          queryFn: () => staffService.checkStaffExists(staffId),
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to check staff existence";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ========== Clinic Staff Lists ==========
  const listClinicStaff = useCallback(
    async (clinicId) => {
      const key = [...queryKeys.staff.list, clinicId, "clinic"];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.listClinicStaff(clinicId),
        });
        setActiveStaffListKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to list clinic staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const listAllClinicStaff = useCallback(
    async (clinicId) => {
      const key = [...queryKeys.staff.list, clinicId, "all"];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.listAllClinicStaff(clinicId),
        });
        setActiveStaffListKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to list all clinic staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const listActiveClinicStaff = useCallback(
    async (clinicId) => {
      const key = [...queryKeys.staff.list, clinicId, "active"];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.listActiveClinicStaff(clinicId),
        });
        setActiveStaffListKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to list active clinic staff";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  // ========== Staff Invitations ==========
  const inviteStaff = useCallback(
    async (clinicId, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await inviteStaffMutation.mutateAsync({
          clinicId,
          data,
        });
        setActiveInvitationKey(["staff", "invitation", response.invitation_token]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || err.message || "Failed to send invitation";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [inviteStaffMutation]
  );

  const getInvitationDetails = useCallback(
    async (token) => {
      const key = ["staff", "invitation", token];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getInvitationDetails(token),
        });
        setActiveInvitationKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to get invitation details";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const acceptInvitation = useCallback(
    async (token) => {
      setLoading(true);
      setError(null);
      try {
        const response = await acceptInvitationMutation.mutateAsync(token);
        setActiveInvitationKey(null);
        if (response.staff) {
          setActiveStaffKey(["staff", "detail", response.staff.id]);
        }
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to accept invitation";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [acceptInvitationMutation]
  );

  const declineInvitation = useCallback(
    async (token) => {
      setLoading(true);
      setError(null);
      try {
        const response = await declineInvitationMutation.mutateAsync(token);
        setActiveInvitationKey(null);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to decline invitation";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [declineInvitationMutation]
  );

  const getPendingInvitations = useCallback(
    async (clinicId) => {
      const key = ["staff", "invitations", clinicId, "pending"];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getPendingInvitations(clinicId),
        });
        setActiveInvitationsKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to get pending invitations";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const getMyInvitations = useCallback(
    async () => {
      const key = ["staff", "invitations", "me"];
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getMyInvitations(),
        });
        setActiveInvitationsKey(key);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to get your invitations";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [queryClient]
  );

  const cancelInvitation = useCallback(
    async (clinicId, token) => {
      setLoading(true);
      setError(null);
      try {
        const response = await cancelInvitationMutation.mutateAsync({
          clinicId,
          token,
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to cancel invitation";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [cancelInvitationMutation]
  );

  const resendInvitation = useCallback(
    async (clinicId, invitationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await resendInvitationMutation.mutateAsync({
          clinicId,
          invitationId,
        });
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const errorMessage =
          err.response?.data?.error || "Failed to resend invitation";
        setError(errorMessage);
        setLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    [resendInvitationMutation]
  );

  // ========== Utility Methods ==========
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearStaffState = useCallback(() => {
    setActiveStaffKey(null);
    setActiveStaffListKey(null);
    setActiveInvitationKey(null);
    setActiveInvitationsKey(null);
    setError(null);
  }, []);

  return {
    // Staff CRUD
    createStaff,
    getStaff,
    getStaffByUserId,
    updateStaff,
    deleteStaff,
    checkStaffExists,

    // Clinic Staff Lists
    listClinicStaff,
    listAllClinicStaff,
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
