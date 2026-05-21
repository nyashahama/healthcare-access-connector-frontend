import { createFileRoute } from '@tanstack/react-router'
import Prescriptions from '@/views/patient/prescriptions'

export const Route = createFileRoute('/patient/prescriptions')({
  component: Prescriptions,
})
