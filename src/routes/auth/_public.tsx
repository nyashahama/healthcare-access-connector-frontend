import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/auth/_public')({
  component: AuthPublicLayout,
})

function AuthPublicLayout() {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
