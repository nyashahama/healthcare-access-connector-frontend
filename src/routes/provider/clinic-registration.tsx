import { createFileRoute } from '@tanstack/react-router'
import ClinicRegistration from '@/views/provider/ClinicRegistration'

export const Route = createFileRoute('/provider/clinic-registration')({
  component: ClinicRegistration,
})
