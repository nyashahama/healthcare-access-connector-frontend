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

  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.identifier - Email or phone
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with token and user data
   */
  login: async (credentials) => {
    const response = await apiClient.post("/api/v1/login", credentials);
    const { token, expires_at, user } = response.data;

    // Store token in localStorage
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiry", expires_at);
    }

    return response.data;
  },
};
export default authService;
