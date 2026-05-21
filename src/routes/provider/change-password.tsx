import { createFileRoute } from '@tanstack/react-router'
import ChangePassword from '@/views/auth/ChangePassword'

export const Route = createFileRoute('/provider/change-password')({
  component: ChangePassword,
})
