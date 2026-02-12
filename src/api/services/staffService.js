import apiClient from "../apiClient";

/**
 * Staff service - handles all staff-related API calls
 */
const staffService = {
  // ========== Staff CRUD Operations ==========
  /**
   * Create a new staff member (direct addition, not invitation)
   * @param {Object} data - Staff data (ClinicStaff fields)
   * @returns {Promise<Object>} Created staff
   */
  createStaff: async (data) => {
    const response = await apiClient.post("/api/v1/providers/staff", data);
    return response.data;
  },

  /**
   * Get a staff member by ID
   * @param {string} staffId
   * @returns {Promise<Object>} Staff data
   */
  getStaff: async (staffId) => {
    const response = await apiClient.get(`/api/v1/providers/staff/${staffId}`);
    return response.data;
  },

  /**
   * Update a staff member
   * @param {string} staffId
   * @param {Object} data - Updated fields
   * @returns {Promise<Object>} Updated staff
   */
  updateStaff: async (staffId, data) => {
    const response = await apiClient.put(
      `/api/v1/providers/staff/${staffId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete a staff member
   * @param {string} staffId
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteStaff: async (staffId) => {
    const response = await apiClient.delete(
      `/api/v1/providers/staff/${staffId}`
    );
    return response.data;
  },

  /**
   * Check if a staff member exists
   * @param {string} staffId
   * @returns {Promise<Object>} { exists: boolean }
   */
  checkStaffExists: async (staffId) => {
    const response = await apiClient.get(
      `/api/v1/providers/staff/${staffId}/exists`
    );
    return response.data;
  },

  // ========== Clinic Staff Lists ==========
  /**
   * List all staff members of a clinic
   * @param {string} clinicId
   * @returns {Promise<Object>} { staff: [], total, limit, offset }
   */
  listClinicStaff: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/staff`
    );
    return response.data;
  },

  /**
   * List only active staff members of a clinic
   * @param {string} clinicId
   * @returns {Promise<Object>} { staff: [], total }
   */
  listActiveClinicStaff: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/staff/active`
    );
    return response.data;
  },

  // ========== Staff Invitations ==========
  /**
   * Send a staff invitation
   * @param {string} clinicId
   * @param {Object} data - InviteStaffRequest
   * @returns {Promise<Object>} Created staff invitation
   */
  inviteStaff: async (clinicId, data) => {
    const response = await apiClient.post(
      `/api/v1/providers/clinics/${clinicId}/staff/invite`,
      data
    );
    return response.data;
  },

  /**
   * Get invitation details by token (public)
   * @param {string} token
   * @returns {Promise<Object>} StaffInvitationResponse
   */
  getInvitationDetails: async (token) => {
    const response = await apiClient.get(`/api/v1/staff/invitations/${token}`);
    return response.data;
  },

  /**
   * Accept a staff invitation (authenticated)
   * @param {string} token
   * @returns {Promise<Object>} { message, staff }
   */
  acceptInvitation: async (token) => {
    const response = await apiClient.post(
      `/api/v1/staff/invitations/${token}/accept`
    );
    return response.data;
  },

  /**
   * Decline a staff invitation (public)
   * @param {string} token
   * @returns {Promise<Object>} { message }
   */
  declineInvitation: async (token) => {
    const response = await apiClient.post(
      `/api/v1/staff/invitations/${token}/decline`
    );
    return response.data;
  },

  /**
   * Get all pending invitations for a clinic
   * @param {string} clinicId
   * @returns {Promise<Object>} { staff: [], total }
   */
  getPendingInvitations: async (clinicId) => {
    const response = await apiClient.get(
      `/api/v1/providers/clinics/${clinicId}/staff/invitations/pending`
    );
    return response.data;
  },

  /**
   * Get all invitations for the currently authenticated user's email
   * @returns {Promise<Object>} { invitations: [], total }
   */
  getMyInvitations: async () => {
    const response = await apiClient.get("/api/v1/staff/invitations/my");
    return response.data;
  },

  /**
   * Cancel a pending staff invitation (requires permission)
   * @param {string} clinicId
   * @param {string} token - Invitation token
   * @returns {Promise<Object>} { message }
   */
  cancelInvitation: async (clinicId, token) => {
    const response = await apiClient.delete(
      `/api/v1/providers/clinics/${clinicId}/staff/invitations/${token}`
    );
    return response.data;
  },

  /**
   * Resend a staff invitation email
   * @param {string} clinicId
   * @param {string} invitationId
   * @returns {Promise<Object>} { message, new_token, invitation_expires }
   */
  resendInvitation: async (clinicId, invitationId) => {
    const response = await apiClient.post(
      `/api/v1/providers/clinics/${clinicId}/staff/invitations/${invitationId}/resend`
    );
    return response.data;
  },
};

export default staffService;
