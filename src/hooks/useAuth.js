import authService from "api/services/authService";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const errorMessage = err.response?.data?.error || "Registration failed";
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
      const errorMessage = err.response?.data?.error || "Login unsuccessful";
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
      navigate("/signin");
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Couldn't log out";
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
      const errorMessage = err.response?.data?.error || "Verification failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);
};
