import { createFileRoute } from '@tanstack/react-router'
import BookAppointment from '@/views/patient/components/BookAppointment'

export const Route = createFileRoute('/patient/book-appointment')({
  component: BookAppointment,
})
