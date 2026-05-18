import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export const useLogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Session cleared even if server call fails
    } finally {
      navigate("/auth/sign-in", { replace: true });
    }
  };

  return { handleLogout };
};

export default useLogoutHandler;
