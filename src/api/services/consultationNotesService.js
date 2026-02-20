import apiClient from "api/apiClient";

/**
 * Consultation Notes Service
 * Handles all API calls related to SOAP clinical notes
 */
const consultationNotesService = {
  // ─── CRUD on notes ──────────────────────────────────────────────────────

  /**
   * Create a new draft note for a consultation
   * @param {string} consultationId
   * @returns {Promise<Object>} Created note
   */
  createNote: async (consultationId) => {
    const response = await apiClient.post(
      `/api/v1/telemedicine/consultations/${consultationId}/notes`
    );
    return response.data;
  },

  /**
   * Get the active note for a consultation
   * @param {string} consultationId
   * @returns {Promise<Object>} Note
   */
  getNoteByConsultationID: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/notes`
    );
    return response.data;
  },

  /**
   * Update a draft note (partial update)
   * @param {string} consultationId
   * @param {string} noteId
   * @param {Object} data - Partial note fields
   * @returns {Promise<Object>} Updated note
   */
  updateNote: async (consultationId, noteId, data) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/notes/${noteId}`,
      data
    );
    return response.data;
  },

  /**
   * Finalise a note by note ID
   * @param {string} consultationId
   * @param {string} noteId
   * @returns {Promise<Object>} Finalised note
   */
  finaliseNote: async (consultationId, noteId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/notes/${noteId}/finalise`
    );
    return response.data;
  },

  /**
   * Finalise a note by consultation ID (alternative endpoint)
   * @param {string} consultationId
   * @returns {Promise<Object>} Finalised note
   */
  finaliseNoteByConsultation: async (consultationId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/consultations/${consultationId}/notes/finalise`
    );
    return response.data;
  },

  /**
   * Get a note by its ID
   * @param {string} noteId
   * @returns {Promise<Object>} Note
   */
  getNoteByID: async (noteId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/notes/${noteId}`
    );
    return response.data;
  },

  /**
   * Get note with provider info (hydrated)
   * @param {string} consultationId
   * @returns {Promise<Object>} Note with provider details
   */
  getNoteWithProviderInfo: async (consultationId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/consultations/${consultationId}/notes/with-provider`
    );
    return response.data;
  },

  // ─── History ─────────────────────────────────────────────────────────────

  /**
   * Get note history for the authenticated provider (paginated)
   * @param {Object} params - Pagination
   * @param {number} [params.limit=20]
   * @param {number} [params.offset=0]
   * @returns {Promise<Object>} Paginated provider notes
   */
  getProviderNoteHistory: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);
    const response = await apiClient.get(
      `/api/v1/telemedicine/notes/history/provider/me?${queryParams}`
    );
    return response.data;
  },

  /**
   * Get note history for the authenticated patient (all finalised notes)
   * @returns {Promise<Object>} Patient notes list
   */
  getPatientNoteHistory: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/notes/history/patient/me"
    );
    return response.data;
  },
};

export default consultationNotesService;
