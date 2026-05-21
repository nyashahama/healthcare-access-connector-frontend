import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/admin/_protected')({
  component: AdminProtectedLayout,
})

function AdminProtectedLayout() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }
  if (!user || !(user as any).roles?.includes('system_admin')) {
    return <div className="p-8 text-center text-red-500 text-lg">Access Denied – Admin access required</div>
  }

  return <Outlet />
}
