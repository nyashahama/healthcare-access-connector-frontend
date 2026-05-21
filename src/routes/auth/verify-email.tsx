import { createFileRoute } from '@tanstack/react-router'
import VerifyEmail from '@/views/auth/VerifyEmail'

export const Route = createFileRoute('/auth/verify-email')({
  component: VerifyEmail,
})
