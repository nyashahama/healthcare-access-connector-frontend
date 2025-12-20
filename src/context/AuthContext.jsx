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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
