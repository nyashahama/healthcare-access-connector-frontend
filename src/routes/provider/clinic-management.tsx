import { createFileRoute } from '@tanstack/react-router'
import ClinicManagement from '@/views/provider/clinic-management'

export const Route = createFileRoute('/provider/clinic-management')({
  component: ClinicManagement,
})
