import apiClient from "./apiClient";

/**
 * Authentication Service
 * Handles all API calls related to authentication
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} data - Registration data
   * @param {string} data.email - User email
   * @param {string} data.phone - User phone
   * @param {string} data.password - User password
   * @param {string} data.role - User role (patient, caregiver, etc.)
   * @returns {Promise<Object>} User data
   */
  register: async (data) => {
    const response = await apiClient.post("/api/v1/register", data);
    return response.data;
  },
};
export default authService;
