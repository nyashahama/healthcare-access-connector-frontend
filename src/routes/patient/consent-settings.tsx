import { createFileRoute } from '@tanstack/react-router'
import ConsentSettings from '@/views/auth/ConsentSettings'

export const Route = createFileRoute('/patient/consent-settings')({
  component: ConsentSettings,
})
