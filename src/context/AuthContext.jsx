import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import authService from "../api/services/authService";
import { sessionManager } from "platform/auth/sessionManager";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    const { token, user, expiresAt } = sessionManager.hydrate();
    const isValid = Boolean(token && expiresAt && new Date(expiresAt) > new Date());

    if (isValid && user) {
      setUser(user);
      setIsAuthenticated(true);
    } else {
      sessionManager.clearSession("hydrate-invalid");
      setUser(null);
      setIsAuthenticated(false);
    }

    setLoading(false);

    return () => {
      isMounted.current = false;
    };
  }, []);

  const register = useCallback(async (data) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.register(data);
      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Registration failed";
      console.error("Registration error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      sessionManager.saveSession({
        token: response.token,
        user: response.user,
        expiresAt: response.expires_at,
      });
      setUser(response.user);
      setIsAuthenticated(true);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      await authService.logout();

      sessionManager.clearSession("logout");
      if (isMounted.current) {
        setUser(null);
        setIsAuthenticated(false);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error.message || "Logout failed";
      console.error("Logout error:", error);

      sessionManager.clearSession("logout-error");
      if (isMounted.current) {
        setUser(null);
        setIsAuthenticated(false);
      }

      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const verifyEmail = useCallback(async (token) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.verifyEmail(token);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Verification failed";
      console.error("Verification error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const requestPasswordReset = useCallback(async (identifier) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.requestPasswordReset(identifier);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Request failed";
      console.error("Password reset request error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const resetPassword = useCallback(async (data) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.resetPassword(data);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Password reset failed";
      console.error("Password reset error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const generateOTP = useCallback(async (data) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.generateOTP(data);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to generate OTP";
      console.error("OTP generation error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const verifyOTP = useCallback(async (data) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.verifyOTP(data);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to verify OTP";
      console.error("OTP verification error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.resendVerification(email);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to resend verification";
      console.error("Resend verification error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updatePassword = useCallback(async (userId, data) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.updatePassword(userId, data);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Password update failed";
      console.error("Password update error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getProfile = useCallback(async (userId) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.getProfile(userId);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to load profile";
      console.error("Get profile error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const getConsent = useCallback(async (userId) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.getConsent(userId);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to load consent";
      console.error("Get consent error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  const updateUser = useCallback((userData) => {
    if (isMounted.current) {
      setUser(userData);
      const current = sessionManager.hydrate();
      sessionManager.saveSession({ ...current, user: userData });
    }
  }, []);

  const refreshAuth = useCallback(() => {
    if (isMounted.current) {
      const { token, user, expiresAt } = sessionManager.hydrate();
      const isValid = Boolean(token && expiresAt && new Date(expiresAt) > new Date());

      setIsAuthenticated(isValid);
      setUser(user);
    }
  }, []);

  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles) => {
      return roles.includes(user?.role);
    },
    [user]
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,

      register,
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
      updateUser,
      refreshAuth,

      hasRole,
      hasAnyRole,

      getToken: () => sessionManager.hydrate().token,
      getCurrentUser: () => sessionManager.hydrate().user,
    }),
    [
      user,
      loading,
      isAuthenticated,
      register,
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
      updateUser,
      refreshAuth,
      hasRole,
      hasAnyRole,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
