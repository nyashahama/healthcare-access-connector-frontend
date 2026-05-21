import { createFileRoute } from '@tanstack/react-router'
import TelemedicineChat from '@/views/patient/telemedicine-chat'

export const Route = createFileRoute('/patient/telemedicine')({
  component: TelemedicineChat,
})
