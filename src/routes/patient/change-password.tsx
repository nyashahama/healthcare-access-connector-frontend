import { createFileRoute } from '@tanstack/react-router'
import ChangePassword from '@/views/auth/ChangePassword'

export const Route = createFileRoute('/patient/change-password')({
  component: ChangePassword,
})
