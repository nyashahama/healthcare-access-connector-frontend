import { createFileRoute } from '@tanstack/react-router'
import ProviderSignUp from '@/views/auth/ProviderSignUp'

export const Route = createFileRoute('/auth/sign-up/provider')({
  component: ProviderSignUp,
})
