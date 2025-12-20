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

  const login = useCallback(async (credentials) => {
    try {
      if (!isMounted.current)
        return { success: false, error: "Component unmounted" };

      setLoading(true);
      const response = await authService.login(credentials);
      const { user: userData } = response;

      if (isMounted.current) {
        setUser(userData);
        setIsAuthenticated(true);
      }

      return { success: true, data: response };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Login failed";
      console.error("Login error:", error);
      return { success: false, error: errorMessage };
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

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

  const updateUser = useCallback((userData) => {
    if (isMounted.current) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  }, []);

  const refreshAuth = useCallback(() => {
    if (isMounted.current) {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();

      setIsAuthenticated(authenticated);
      setUser(currentUser);
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

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      refreshAuth,
      hasRole,
      hasAnyRole,
      getToken: authService.getToken,
    }),
    [
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      updateUser,
      refreshAuth,
      hasRole,
      hasAnyRole,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
