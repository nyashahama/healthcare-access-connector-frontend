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

  // Use ref to track if component is mounted
  const isMounted = useRef(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const authenticated = authService.isAuthenticated();
        const currentUser = authService.getCurrentUser();

        if (authenticated && currentUser) {
          if (isMounted.current) {
            setUser(currentUser);
            setIsAuthenticated(true);
          }
        } else {
          authService.clearAuthData();
          if (isMounted.current) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        authService.clearAuthData();
        if (isMounted.current) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Register a new user
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

  // Login
  const login = useCallback(async (credentials) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.login(credentials);

      // Get the user from the response or from storage
      const userData = response.user || authService.getCurrentUser();

      if (isMounted.current && userData) {
        setUser(userData);
        setIsAuthenticated(true);

        // Force a small delay to ensure state updates propagate
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      console.error("Login error:", error);

      // Even on error, check if token was saved (CORS case)
      if (isMounted.current) {
        const authenticated = authService.isAuthenticated();
        const currentUser = authService.getCurrentUser();

        if (authenticated && currentUser) {
          console.log(
            "✅ Login succeeded despite CORS error - token found in storage"
          );
          setUser(currentUser);
          setIsAuthenticated(true);
          return { success: true, data: { user: currentUser } };
        }
      }

      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      await authService.logout();

      if (isMounted.current) {
        setUser(null);
        setIsAuthenticated(false);
      }

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Logout failed";
      console.error("Logout error:", error);

      authService.clearAuthData();
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

  // Verify email
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

  // Request password reset
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

  // Reset password
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

  // Generate OTP
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

  // Verify OTP
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

  // Resend verification email
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

  // Update password
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

  // Get user profile
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

  // Get consent settings
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

  // Update user
  const updateUser = useCallback((userData) => {
    if (isMounted.current) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, []);

  // Refresh auth state
  const refreshAuth = useCallback(() => {
    if (isMounted.current) {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      console.log("🔄 Refreshing auth state:", { authenticated, currentUser });

      setIsAuthenticated(authenticated);
      setUser(currentUser);
    }
  }, []);

  // Check if user has a specific role
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles) => {
      return roles.includes(user?.role);
    },
    [user]
  );

  // Listen for storage events (handles login in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
        console.log("🔄 Storage changed, refreshing auth");
        refreshAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [refreshAuth]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      // State
      user,
      loading,
      isAuthenticated,

      // Auth methods
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

      // Role checking
      hasRole,
      hasAnyRole,

      // Utility methods
      getToken: authService.getToken,
      getCurrentUser: authService.getCurrentUser,
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
