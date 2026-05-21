import { createFileRoute } from '@tanstack/react-router'
import PatientDashboard from '@/views/patient/dashboard'

export const Route = createFileRoute('/patient/')({
  component: PatientDashboard,
})
