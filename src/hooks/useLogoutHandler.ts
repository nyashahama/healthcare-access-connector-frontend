import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

export const useLogoutHandler = (): { handleLogout: () => Promise<void> } => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
    } catch {
      // Session cleared even if server call fails
    } finally {
      navigate({ to: '/auth/sign-in' as any, replace: true })
    }
  }

  return { handleLogout }
}

export default useLogoutHandler
