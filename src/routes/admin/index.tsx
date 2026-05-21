import { createFileRoute } from '@tanstack/react-router'
import SystemDashboard from '@/views/admin/dashboard'

export const Route = createFileRoute('/admin/')({
  component: SystemDashboard,
})
