import { createFileRoute } from '@tanstack/react-router'
import StaffRegistration from '@/views/auth/StaffRegistration'

export const Route = createFileRoute('/auth/register/staff')({
  component: StaffRegistration,
})
