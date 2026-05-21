import { createFileRoute } from '@tanstack/react-router'
import PatientAppointments from '@/views/patient/appointments'

export const Route = createFileRoute('/patient/appointments')({
  component: PatientAppointments,
})
