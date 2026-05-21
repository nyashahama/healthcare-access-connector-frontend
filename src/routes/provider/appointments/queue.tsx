import { createFileRoute } from '@tanstack/react-router'
import PatientQueue from '@/views/provider/queue'

export const Route = createFileRoute('/provider/appointments/queue')({
  component: PatientQueue,
})
