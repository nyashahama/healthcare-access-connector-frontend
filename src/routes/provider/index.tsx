import { createFileRoute } from '@tanstack/react-router'
import ProviderDashboard from '@/views/provider/dashboard'

export const Route = createFileRoute('/provider/')({
  component: ProviderDashboard,
})
