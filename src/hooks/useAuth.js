import authService from "api/services/authService";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionManager } from "platform/auth/sessionManager";

/**
 * Custom hook for authentication operations
 * @returns {Object} Auth methods and state
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //register a new user
  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Registration failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // register staff via invitation token
  const registerInvitedStaff = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.registerInvitedStaff(data);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Staff registration failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //a user logs in
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Login unsuccessful";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //log out a user
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      navigate("/auth/sign-in");
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Couldn't log out";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, [navigate]);

  // Verify email
  const verifyEmail = useCallback(async (token) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyEmail(token);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Verification failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (identifier) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.requestPasswordReset(identifier);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Request failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(data);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Password reset failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //generate OTP
  const generateOTP = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.generateOTP(data);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Failed to generate OTP";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //generate OTP
  const verifyOTP = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOTP(data);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage = err.message || "Failed to generate OTP";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //Resend verification email
  const resendVerification = useCallback(async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.resendVerification(email);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Failed to resend verification";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //Update password
  const updatePassword = useCallback(async (userId, data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.updatePassword(userId, data);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Password update failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //Get user profile
  const getProfile = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.getProfile(userId);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Failed to load profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  //Get consent settings
  const getConsent = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.getConsent(userId);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.message || "Failed to load consent";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const getCurrentUser = useCallback(() => {
    return sessionManager.hydrate().user;
  }, []);

  const getToken = useCallback(() => {
    return sessionManager.hydrate().token;
  }, []);

  const isAuthenticated = () => {
    const { token, expiresAt } = sessionManager.hydrate();
    return Boolean(token && expiresAt && new Date(expiresAt) > new Date());
  };

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Methods
    register,
    registerInvitedStaff,
    login,
    logout,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    generateOTP,
    verifyOTP,
    resendVerification,
    updatePassword,
    getProfile,
    getConsent,
    clearError,

    // State
    loading,
    error,

    // Utility methods
    isAuthenticated: isAuthenticated(),
    getCurrentUser,
    getToken,
  };
};
