import { createFileRoute } from '@tanstack/react-router'
import PatientSignUp from '@/views/auth/PatientSignUp'

export const Route = createFileRoute('/auth/sign-up/patient')({
  component: PatientSignUp,
})
