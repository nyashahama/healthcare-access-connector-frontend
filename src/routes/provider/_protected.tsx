import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

const providerRoles = ['provider_staff', 'caregiver', 'clinic_admin']

export const Route = createFileRoute('/provider/_protected')({
  component: ProviderProtectedLayout,
})

function ProviderProtectedLayout() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }
  if (!user || !providerRoles.some((r) => (user as any).roles?.includes(r))) {
    return <div className="p-8 text-center text-red-500 text-lg">Access Denied – Provider access required</div>
  }

  return <Outlet />
}
