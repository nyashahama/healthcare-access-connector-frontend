import { createFileRoute } from '@tanstack/react-router'
import FindClinic from '@/views/patient/find-clinic'

export const Route = createFileRoute('/patient/find-clinic')({
  component: FindClinic,
})
