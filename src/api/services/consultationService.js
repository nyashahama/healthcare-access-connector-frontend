import apiClient from "api/apiClient";

/**
 * Consultation Service
 * Handles all API calls related to consultation lifecycle
 */
const consultationService = {
  // ─── Patient-facing ─────────────────────────────────────────────────────

  /**
   * Request a new consultation from a symptom session
   * @param {Object} data - Request payload
   * @param {string} data.symptom_session_id - UUID of the completed symptom session
   * @param {string} data.channel - 'chat'|'video'|'phone'
   * @param {number} [data.consultation_fee] - Optional fee override
   * @param {string} [data.fee_currency] - Currency code (e.g., 'USD')
   * @param {string} [data.provider_staff_id] - Optional specific provider
   * @param {string} [data.clinic_id] - Optional clinic filter
   * @returns {Promise<Object>} Created consultation
   */
  requestConsultation: async (data) => {
    const response = await apiClient.post(
      "/api/v1/telemedicine/consultations",
      data
    );
    return response.data;
  },

  /**
   * Get authenticated patient's active consultation (if any)
   * @returns {Promise<Object>} Active consultation or 404 handled by hook
   */
  getPatientActiveConsultation: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/consultations/me/active"
    );
    return response.data;
  },

  /**
   * Get authenticated patient's consultation history (paginated)
   * @param {Object} params - Pagination
   * @param {number} [params.limit=20]
   * @param {number} [params.offset=0]
   * @returns {Promise<Object>} Paginated history
   */
  getPatientConsultations: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/me/history?${queryParams}`
    );
    return response.data;
  },

  /**
   * Cancel a pending or accepted consultation
   * @param {string} consultationId - Consultation UUID
   * @returns {Promise<Object>} Updated consultation
   */
  cancelConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/cancel`
    );
    return response.data;
  },

  /**
   * Submit a rating for a completed consultation
   * @param {string} consultationId - Consultation UUID
   * @param {Object} data - Rating payload
   * @param {number} data.rating - 1–5
   * @param {string} [data.feedback] - Optional feedback text
   * @returns {Promise<Object>} Success message
   */
  submitPatientRating: async (consultationId, data) => {
    const response = await apiClient.post(
      `/api/v1/telemedicine/consultations/${consultationId}/rating`,
      data
    );
    return response.data;
  },

  // ─── Shared (patient + provider) ────────────────────────────────────────

  /**
   * Get a consultation by ID
   * @param {string} consultationId
   * @returns {Promise<Object>} Consultation details
   */
  getConsultationByID: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}`
    );
    return response.data;
  },

  /**
   * Get rich consultation details with patient/provider info
   * @param {string} consultationId
   * @returns {Promise<Object>} Hydrated consultation
   */
  getConsultationWithDetails: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/details`
    );
    return response.data;
  },

  /**
   * Update the communication channel of an active consultation
   * @param {string} consultationId
   * @param {Object} data
   * @param {string} data.channel - 'chat'|'video'|'phone'
   * @returns {Promise<Object>} Success message
   */
  updateConsultationChannel: async (consultationId, data) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/channel`,
      data
    );
    return response.data;
  },

  // ─── Provider-facing ────────────────────────────────────────────────────

  /**
   * Accept a consultation from the waiting room
   * @param {string} consultationId
   * @returns {Promise<Object>} Updated consultation
   */
  acceptConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/accept`
    );
    return response.data;
  },

  /**
   * Start an accepted consultation (move to in_progress)
   * @param {string} consultationId
   * @returns {Promise<Object>} Updated consultation
   */
  startConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/start`
    );
    return response.data;
  },

  /**
   * Complete an ongoing consultation
   * @param {string} consultationId
   * @returns {Promise<Object>} Updated consultation
   */
  completeConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/complete`
    );
    return response.data;
  },

  /**
   * Escalate a consultation (e.g., to a supervisor)
   * @param {string} consultationId
   * @returns {Promise<Object>} Updated consultation
   */
  escalateConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/escalate`
    );
    return response.data;
  },

  /**
   * Decline a pending consultation
   * @param {string} consultationId
   * @returns {Promise<Object>} Success message
   */
  declineConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/decline`
    );
    return response.data;
  },

  /**
   * Mark a consultation as no-show
   * @param {string} consultationId
   * @returns {Promise<Object>} Success message
   */
  markNoShow: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/no-show`
    );
    return response.data;
  },

  /**
   * Get active consultations for the authenticated provider
   * @returns {Promise<Object>} List of active consultations
   */
  getProviderActiveConsultations: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/consultations/provider/active"
    );
    return response.data;
  },

  /**
   * Get consultation history for the authenticated provider (paginated)
   * @param {Object} params - Pagination
   * @param {number} [params.limit=20]
   * @param {number} [params.offset=0]
   * @returns {Promise<Object>} Paginated history
   */
  getProviderConsultationHistory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/provider/history?${queryParams}`
    );
    return response.data;
  },

  /**
   * Get the waiting room (pending consultations)
   * @returns {Promise<Object>} List of waiting entries
   */
  getWaitingRoom: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/consultations/waiting-room"
    );
    return response.data;
  },

  // ─── Billing & admin ────────────────────────────────────────────────────

  /**
   * Update payment status of a consultation
   * @param {string} consultationId
   * @param {Object} data
   * @param {string} data.status - 'pending'|'paid'|'waived'|'failed'
   * @param {string} [data.reference] - Optional payment reference
   * @returns {Promise<Object>} Success message
   */
  updatePaymentStatus: async (consultationId, data) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/payment`,
      data
    );
    return response.data;
  },

  /**
   * Link a follow-up appointment to a completed consultation
   * @param {string} consultationId
   * @param {Object} data
   * @param {string} data.appointment_id - UUID of follow-up appointment
   * @returns {Promise<Object>} Success message
   */
  linkFollowUpAppointment: async (consultationId, data) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/follow-up`,
      data
    );
    return response.data;
  },
};

export default consultationService;
