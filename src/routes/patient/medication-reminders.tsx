import { createFileRoute } from '@tanstack/react-router'
import MedicationReminders from '@/views/patient/medication-reminders'

export const Route = createFileRoute('/patient/medication-reminders')({
  component: MedicationReminders,
})
