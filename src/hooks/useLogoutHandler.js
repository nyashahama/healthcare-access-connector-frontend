import { useAuth } from "context/AuthContext";

/**
 * LogoutHandler - Ensures clean logout and navigation
 * Use this in your Navbar/Header logout button
 */
export const useLogoutHandler = () => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout
      const result = await logout();

      if (result.success) {
        // Clear all profile/clinic caches
        const cacheKeys = Object.keys(localStorage).filter(
          (key) =>
            key.startsWith("profile_check_") || key.startsWith("clinic_check_")
        );
        cacheKeys.forEach((key) => localStorage.removeItem(key));

        // Force a hard navigation to sign-in
        // This ensures all components unmount and remount fresh
        window.location.href = "/auth/sign-in";
      } else {
        console.error("Logout failed:", result.error);
        // Even if logout fails on backend, clear frontend state
        window.location.href = "/auth/sign-in";
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Force navigation even on error
      window.location.href = "/auth/sign-in";
    }
  };

  return { handleLogout };
};

export default useLogoutHandler;
