import apiClient from "api/apiClient";

/**
 * Provider Availability Service
 * Handles all API calls related to provider online/offline status and availability
 */
const providerAvailabilityService = {
  // ─── Patient-facing ─────────────────────────────────────────────────────

  /**
   * Get currently available providers
   * @param {Object} params
   * @param {string} [params.clinic_id] - Optional clinic UUID filter
   * @returns {Promise<Object>} List of available providers
   */
  getAvailableProviders: async (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.clinic_id) queryParams.append("clinic_id", params.clinic_id);
    const response = await apiClient.get(
      `/api/v1/telemedicine/providers/available?${queryParams}`
    );
    return response.data;
  },

  /**
   * Get available providers by specialization
   * @param {string} specialization - Required specialization
   * @returns {Promise<Object>} Filtered list
   */
  getAvailableProvidersBySpecialization: async (specialization) => {
    const queryParams = new URLSearchParams({ specialization });
    const response = await apiClient.get(
      `/api/v1/telemedicine/providers/available/specialization?${queryParams}`
    );
    return response.data;
  },

  // ─── Provider self-management ───────────────────────────────────────────

  /**
   * Go online (start shift)
   * @returns {Promise<Object>} Updated availability record
   */
  goOnline: async () => {
    const response = await apiClient.put(
      "/api/v1/telemedicine/providers/me/online"
    );
    return response.data;
  },

  /**
   * Go offline (end shift)
   * @returns {Promise<Object>} Success message
   */
  goOffline: async () => {
    const response = await apiClient.put(
      "/api/v1/telemedicine/providers/me/offline"
    );
    return response.data;
  },

  /**
   * Set accepting state and optional overrides
   * @param {Object} data
   * @param {boolean} data.is_accepting
   * @param {number} [data.consultation_fee_override] - Optional fee override
   * @param {number} [data.estimated_wait_minutes] - Optional wait time
   * @returns {Promise<Object>} Updated availability
   */
  setAccepting: async (data) => {
    const response = await apiClient.put(
      "/api/v1/telemedicine/providers/me/accepting",
      data
    );
    return response.data;
  },

  /**
   * Update provider status (available/busy/away)
   * @param {Object} data
   * @param {string} data.status - 'available'|'busy'|'away'
   * @param {boolean} data.is_accepting
   * @param {number} [data.estimated_wait_minutes]
   * @param {string} [data.status_message]
   * @returns {Promise<Object>} Success message
   */
  updateStatus: async (data) => {
    const response = await apiClient.put(
      "/api/v1/telemedicine/providers/me/status",
      data
    );
    return response.data;
  },

  /**
   * Update estimated wait time
   * @param {number} minutes - Wait time in minutes (0–480)
   * @returns {Promise<Object>} Success message
   */
  updateWaitTime: async (minutes) => {
    const queryParams = new URLSearchParams({ minutes });
    const response = await apiClient.put(
      `/api/v1/telemedicine/providers/me/wait-time?${queryParams}`
    );
    return response.data;
  },

  /**
   * Send heartbeat to keep provider online
   * @returns {Promise<void>} 204 No Content
   */
  sendHeartbeat: async () => {
    await apiClient.post("/api/v1/telemedicine/providers/me/heartbeat");
  },

  /**
   * Get authenticated provider's own availability record
   * @returns {Promise<Object>} Full availability
   */
  getMyAvailability: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/providers/me/availability"
    );
    return response.data;
  },

  // ─── Admin / background jobs ────────────────────────────────────────────

  /**
   * Get stale providers (heartbeat older than 2 min)
   * @returns {Promise<Object>} List of stale provider IDs
   */
  getStaleProviders: async () => {
    const response = await apiClient.get(
      "/api/v1/telemedicine/providers/stale"
    );
    return response.data;
  },

  /**
   * Mark all stale providers offline (admin only)
   * @returns {Promise<Object>} Success message
   */
  setStaleProvidersOffline: async () => {
    const response = await apiClient.put(
      "/api/v1/telemedicine/providers/stale/offline"
    );
    return response.data;
  },
};

export default providerAvailabilityService;
