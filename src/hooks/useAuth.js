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
    } catch (error) {
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);
};
