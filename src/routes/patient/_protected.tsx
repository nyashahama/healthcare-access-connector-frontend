import { createFileRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'

export const Route = createFileRoute('/patient/_protected')({
  component: PatientProtectedLayout,
})

function PatientProtectedLayout() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/sign-in" />
  }
  if (!user || !(user as any).roles?.includes('patient')) {
    return <div className="p-8 text-center text-red-500 text-lg">Access Denied – Patient access required</div>
  }

  return <Outlet />
}
