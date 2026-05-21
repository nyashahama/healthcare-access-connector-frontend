import { createFileRoute } from '@tanstack/react-router'
import AppointmentCalendar from '@/views/provider/appointments'

export const Route = createFileRoute('/provider/appointments/')({
  component: AppointmentCalendar,
})
