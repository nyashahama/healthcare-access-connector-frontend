import { createFileRoute } from '@tanstack/react-router'
import ProviderTelemedicine from '@/views/provider/telemedicine'

export const Route = createFileRoute('/provider/telemedicine')({
  component: ProviderTelemedicine,
})
