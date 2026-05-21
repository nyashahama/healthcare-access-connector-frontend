import { createFileRoute } from '@tanstack/react-router'
import UserManagement from '@/views/admin/user-management'

export const Route = createFileRoute('/admin/user-management')({
  component: UserManagement,
})
