import apiClient from "api/apiClient";

/**
 * Consultation Messages Service
 * Handles all API calls related to consultation message threads
 */
const consultationMessagesService = {
  // ─── Write operations ───────────────────────────────────────────────────

  /**
   * Send a new message in a consultation thread
   * @param {string} consultationId
   * @param {Object} data - Message payload
   * @param {string} data.sender_role - 'patient'|'provider'|'system'
   * @param {string} data.message_type - 'text'|'attachment'|'system_event'|'prescription'
   * @param {string} [data.content] - Required for text/system_event/prescription
   * @param {string} [data.attachment_url] - Required for attachment
   * @param {string} [data.attachment_type] - Required for attachment ('image'|'pdf'|'lab_result'|etc)
   * @param {string} [data.attachment_filename]
   * @param {Object} [data.metadata]
   * @returns {Promise<Object>} Created message
   */
  sendMessage: async (consultationId, data) => {
    const response = await apiClient.post(
      `/api/v1/telemedicine/consultations/${consultationId}/messages`,
      data
    );
    return response.data;
  },

  /**
   * Delete a message (only by original sender)
   * @param {string} consultationId
   * @param {string} messageId
   * @returns {Promise<Object>} Success message
   */
  deleteMessage: async (consultationId, messageId) => {
    const response = await apiClient.delete(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/${messageId}`
    );
    return response.data;
  },

  /**
   * Insert a system event (internal use, but exposed for admin/debug)
   * @param {string} consultationId
   * @param {Object} data
   * @param {string} data.system_user_id - UUID of system user
   * @param {string} data.label - Event label
   * @param {Object} [data.metadata] - Additional event data
   * @returns {Promise<Object>} Created system event message
   */
  insertSystemEvent: async (consultationId, data) => {
    const response = await apiClient.post(
      `/api/v1/telemedicine/consultations/${consultationId}/events`,
      data
    );
    return response.data;
  },

  // ─── Read operations ────────────────────────────────────────────────────

  /**
   * Get paginated messages for a consultation (initial load)
   * @param {string} consultationId
   * @param {Object} params - Pagination
   * @param {number} [params.limit=20]
   * @param {number} [params.offset=0]
   * @returns {Promise<Object>} Paginated messages
   */
  getConsultationMessages: async (consultationId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/messages?${queryParams}`
    );
    return response.data;
  },

  /**
   * Get messages after a cursor timestamp (polling / catch-up)
   * @param {string} consultationId
   * @param {string} cursor - RFC3339 timestamp (e.g., "2024-01-15T10:30:00Z")
   * @returns {Promise<Object>} New messages
   */
  getMessagesAfterCursor: async (consultationId, cursor) => {
    const queryParams = new URLSearchParams({ cursor });
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/since?${queryParams}`
    );
    return response.data;
  },

  /**
   * Get the last message preview for a consultation (used in list cards)
   * @param {string} consultationId
   * @returns {Promise<Object>} Last message preview
   */
  getLastMessage: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/last`
    );
    return response.data;
  },

  /**
   * Get all attachments shared in a consultation
   * @param {string} consultationId
   * @returns {Promise<Object>} List of attachments
   */
  getConsultationAttachments: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/attachments`
    );
    return response.data;
  },

  /**
   * Get system events for a consultation (call log)
   * @param {string} consultationId
   * @returns {Promise<Object>} List of system events
   */
  getSystemEvents: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/events`
    );
    return response.data;
  },

  // ─── Read receipts ──────────────────────────────────────────────────────

  /**
   * Mark a single message as read
   * @param {string} consultationId
   * @param {string} messageId
   * @returns {Promise<Object>} Success message
   */
  markMessageRead: async (consultationId, messageId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/${messageId}/read`
    );
    return response.data;
  },

  /**
   * Mark all provider messages as read (called by patient)
   * @param {string} consultationId
   * @returns {Promise<Object>} Success message
   */
  markAllProviderMessagesRead: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/read/provider`
    );
    return response.data;
  },

  /**
   * Mark all patient messages as read (called by provider)
   * @param {string} consultationId
   * @returns {Promise<Object>} Success message
   */
  markAllPatientMessagesRead: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/read/patient`
    );
    return response.data;
  },

  /**
   * Count unread messages for a given sender role
   * @param {string} consultationId
   * @param {string} senderRole - 'patient' or 'provider'
   * @returns {Promise<Object>} Unread count
   */
  countUnreadMessages: async (consultationId, senderRole) => {
    const queryParams = new URLSearchParams({ sender_role: senderRole });
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/messages/unread-count?${queryParams}`
    );
    return response.data;
  },
};

export default consultationMessagesService;
