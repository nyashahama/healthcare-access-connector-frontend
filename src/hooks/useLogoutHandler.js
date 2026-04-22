import { useNavigate } from "react-router-dom";
import { useAuth } from "context/AuthContext";

export const useLogoutHandler = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/sign-in", { replace: true });
  };

  return { handleLogout };
};

export default useLogoutHandler;
