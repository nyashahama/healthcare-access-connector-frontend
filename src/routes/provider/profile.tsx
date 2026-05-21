import { createFileRoute } from '@tanstack/react-router'
import ProviderProfile from '@/views/provider/profile'

export const Route = createFileRoute('/provider/profile')({
  component: ProviderProfile,
})
