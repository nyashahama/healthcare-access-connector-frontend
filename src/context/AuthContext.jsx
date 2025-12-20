import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Check if user is authenticated
        const authenticated = authService.isAuthenticated();
        const currentUser = authService.getCurrentUser();

        if (authenticated && currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Clear any stale data
          authService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login user and update global state
   * @param {Object} credentials - { identifier, password }
   * @returns {Promise<Object>} { success, data, error }
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);

      // Call auth service
      const response = await authService.login(credentials);
      const { user: userData } = response;

      // Update global state
      setUser(userData);
      setIsAuthenticated(true);

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      console.error("Login error:", error);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user and clear global state
   * @returns {Promise<Object>} { success, error }
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Call auth service (handles API call + localStorage cleanup)
      await authService.logout();

      // Clear global state
      setUser(null);
      setIsAuthenticated(false);

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Logout failed";
      console.error("Logout error:", error);

      // Still clear state even if API call fails
      setUser(null);
      setIsAuthenticated(false);

      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update user data in state
   * Useful when user profile is updated
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  /**
   * Refresh authentication state from localStorage
   * Useful after token refresh or external updates
   */
  const refreshAuth = useCallback(() => {
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
  }, []);

  /**
   * Check if user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  const hasAnyRole = useCallback(
    (roles) => {
      return roles.includes(user?.role);
    },
    [user]
  );

  const value = {
    // State
    user,
    loading,
    isAuthenticated,

    // Methods
    login,
    logout,
    updateUser,
    refreshAuth,
    hasRole,
    hasAnyRole,

    // Utility methods from service
    getToken: authService.getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
