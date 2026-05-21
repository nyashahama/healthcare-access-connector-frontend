import { createFileRoute } from '@tanstack/react-router'
import StaffManagement from '@/views/provider/staff-management'

export const Route = createFileRoute('/provider/staff')({
  component: StaffManagement,
})
