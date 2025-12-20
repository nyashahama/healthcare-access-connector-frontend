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

  /**
   * Logout user
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await apiClient.post("/api/v1/auth/logout");
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("tokenExpiry");
    }
  },

  /**
   * Refresh access token
   * @returns {Promise<Object>} New token data
   */
  refreshToken: async () => {
    const response = await apiClient.post("/api/v1/auth/refresh");
    const { token, expires_at, user } = response.data;

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("tokenExpiry", expires_at);
    }

    return response.data;
  },

  /**
   * Verify email with token
   * @param {string} token - Verification token from email
   * @returns {Promise<Object>} Success message
   */
  verifyEmail: async (token) => {
    const response = await apiClient.get(`/api/v1/verify-email?token=${token}`);
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} identifier - Email or phone
   * @returns {Promise<Object>} Success message
   */
  requestPasswordReset: async (identifier) => {
    const response = await apiClient.post("/api/v1/password/reset-request", {
      identifier,
    });
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data
   * @param {string} data.token - Reset token
   * @param {string} data.new_password - New password
   * @returns {Promise<Object>} Success message
   */
  resetPassword: async (data) => {
    const response = await apiClient.post("/api/v1/password/reset", data);
    return response.data;
  },

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<Object>} Success message
   */
  resendVerification: async (email) => {
    const response = await apiClient.post("/api/v1/auth/resend-verification", {
      email,
    });
    return response.data;
  },

  /**
   * Get user profile
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async (userId) => {
    const response = await apiClient.get(`/api/v1/users/${userId}`);
    return response.data;
  },
};
export default authService;
