import { createFileRoute } from '@tanstack/react-router'
import ClinicVerification from '@/views/admin/clinic-verification'

export const Route = createFileRoute('/admin/clinic-verification')({
  component: ClinicVerification,
})
