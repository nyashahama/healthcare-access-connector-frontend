import { createFileRoute } from '@tanstack/react-router'
import CompletePatientProfile from '@/views/auth/CompletePatientProfile'

export const Route = createFileRoute('/auth/complete-patient-profile')({
  component: CompletePatientProfile,
})
