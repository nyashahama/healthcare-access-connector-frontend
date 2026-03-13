import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

/**
 * LogoutHandler - Ensures clean logout and navigation
 * Use this in your Navbar/Header logout button
 */
export const useLogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Clear all profile/clinic caches before navigating
    const cacheKeys = Object.keys(localStorage).filter(
      (key) =>
        key.startsWith("profile_check_") || key.startsWith("clinic_check_")
    );
    cacheKeys.forEach((key) => localStorage.removeItem(key));

    try {
      await logout();
    } catch {
      // Logout failed on the backend — auth context already cleared local state
    }

    // Use React Router so component unmount lifecycle runs (closes WebSockets,
    // clears intervals) before the sign-in page mounts.
    navigate("/auth/sign-in", { replace: true });
  };

  return { handleLogout };
};

export default useLogoutHandler;
