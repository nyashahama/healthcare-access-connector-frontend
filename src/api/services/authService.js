import apiClient from "api/apiClient";

/**
 * Authentication Service
 * Handles all API calls related to authentication
 */
const authService = {
  register: async (data) => {
    const response = await apiClient.post("/api/v1/auth/register", data);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post("/api/v1/auth/login", credentials);
    return response.data;
  },

  logout: async () => {
    await apiClient.post("/api/v1/auth/logout");
  },

  refreshToken: async () => {
    const response = await apiClient.post("/api/v1/auth/refresh");
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await apiClient.get(
      `/api/v1/auth/verify-email?token=${token}`
    );
    return response.data;
  },

  requestPasswordReset: async (identifier) => {
    const response = await apiClient.post(
      "/api/v1/auth/password/reset-request",
      { identifier }
    );
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post("/api/v1/auth/password/reset", data);
    return response.data;
  },

  generateOTP: async (data) => {
    const response = await apiClient.post("/api/v1/auth/otp/generate", data);
    return response.data;
  },

  verifyOTP: async (data) => {
    const response = await apiClient.post("/api/v1/auth/otp/verify", data);
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await apiClient.post("/api/v1/auth/resend-verification", {
      email,
    });
    return response.data;
  },

  getProfile: async (userId) => {
    const response = await apiClient.get(`/api/v1/users/${userId}`);
    return response.data;
  },

  updatePassword: async (userId, data) => {
    const response = await apiClient.put(
      `/api/v1/users/${userId}/password`,
      data
    );
    return response.data;
  },

  getConsent: async (userId) => {
    const response = await apiClient.get(`/api/v1/users/${userId}/consent`);
    return response.data;
  },
};

export default authService;
