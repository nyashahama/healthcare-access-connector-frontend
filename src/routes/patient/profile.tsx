import { createFileRoute } from '@tanstack/react-router'
import PatientProfile from '@/views/patient/profile'

export const Route = createFileRoute('/patient/profile')({
  component: PatientProfile,
})
