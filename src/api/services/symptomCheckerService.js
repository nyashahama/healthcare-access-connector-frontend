import apiClient from "api/apiClient";

/**
 * Symptom Checker Service
 * Handles all API calls related to symptom checker sessions
 */
const symptomCheckerService = {
  /**
   * Submit a new symptom checker session
   * @param {Object} data - Session data
   * @param {string} data.chief_complaint - Main symptom/reason for visit
   * @param {string[]} data.symptoms_reported - List of reported symptoms
   * @param {string} [data.symptom_duration] - Duration of symptoms
   * @param {string[]} [data.body_systems_affected] - Body systems affected
   * @param {number} [data.severity_score] - Severity score (1-10)
   * @param {boolean} data.is_for_dependent - Whether session is for a dependent
   * @param {string} [data.dependent_id] - Required if is_for_dependent true
   * @param {Object} [data.raw_answers] - Raw questionnaire answers
   * @returns {Promise<Object>} Created session
   */
  submitSession: async (data) => {
    const response = await apiClient.post(
      "/api/v1/telemedicine/symptom-checker/sessions",
      data
    );
    return response.data;
  },

  /**
   * Get a symptom checker session by ID
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object>} Session details
   */
  getSessionById: async (sessionId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/symptom-checker/sessions/${sessionId}`
    );
    return response.data;
  },

  /**
   * Abandon a symptom checker session (patient cancels)
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object>} Success message
   */
  abandonSession: async (sessionId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/symptom-checker/sessions/${sessionId}/abandon`
    );
    return response.data;
  },

  /**
   * Mark a session as converted to consultation (internal use)
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object>} Success message
   */
  markSessionConverted: async (sessionId) => {
    const response = await apiClient.put(
      `/api/v1/telemedicine/symptom-checker/sessions/${sessionId}/convert`
    );
    return response.data;
  },

  /**
   * Get paginated list of sessions for the authenticated patient
   * @param {Object} params - Query parameters
   * @param {number} [params.limit=20] - Number of sessions per page
   * @param {number} [params.offset=0] - Pagination offset
   * @returns {Promise<Object>} Paginated sessions list
   */
  getPatientSessions: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);

    const response = await apiClient.get(
      `/api/v1/telemedicine/symptom-checker/patients/me/sessions?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get the latest eligible session for the patient (pre‑provider selection)
   * @returns {Promise<Object>} Eligible session details
   */
  getLatestEligibleSession: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/symptom-checker/patients/me/eligible-session"
    );
    return response.data;
  },

  /**
   * Get sessions for a specific dependent of the authenticated patient
   * @param {string} dependentId - Dependent UUID
   * @returns {Promise<Object>} Dependent sessions list
   */
  getDependentSessions: async (dependentId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/symptom-checker/patients/me/dependents/${dependentId}/sessions`
    );
    return response.data;
  },

  /**
   * Get session with full patient context (provider view)
   * @param {string} sessionId - Session UUID
   * @returns {Promise<Object>} Session with patient demographics & medical info
   */
  getSessionWithPatientContext: async (sessionId) => {
    const response = await apiClient.get(
      `/api/v1/telemedicine/symptom-checker/sessions/${sessionId}/patient-context`
    );
    return response.data;
  },

  /**
   * Get sessions filtered by triage level (admin)
   * @param {Object} params - Query parameters
   * @param {string} params.triage_level - 'low'|'medium'|'high'|'emergency'
   * @param {string} params.from - Start date YYYY-MM-DD
   * @param {string} params.to - End date YYYY-MM-DD
   * @param {number} [params.limit=20] - Pagination limit
   * @param {number} [params.offset=0] - Pagination offset
   * @returns {Promise<Object>} Paginated sessions
   */
  getSessionsByTriageLevel: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("triage_level", params.triage_level);
    queryParams.append("from", params.from);
    queryParams.append("to", params.to);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.offset) queryParams.append("offset", params.offset);

    const response = await apiClient.get(
      `/api/v1/telemedicine/symptom-checker/admin/sessions/triage?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Count sessions by outcome (admin)
   * @param {Object} params - Query parameters
   * @param {string} params.from - Start date YYYY-MM-DD
   * @param {string} params.to - End date YYYY-MM-DD
   * @returns {Promise<Object>} Outcome counts
   */
  countSessionsByOutcome: async (params) => {
    const queryParams = new URLSearchParams();
    queryParams.append("from", params.from);
    queryParams.append("to", params.to);

    const response = await apiClient.get(
      `/api/v1/telemedicine/symptom-checker/admin/sessions/outcome-counts?${queryParams.toString()}`
    );
    return response.data;
  },
};

export default symptomCheckerService;
