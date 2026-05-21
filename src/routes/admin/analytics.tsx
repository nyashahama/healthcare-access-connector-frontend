import { createFileRoute } from '@tanstack/react-router'
import Analytics from '@/views/admin/analytics'

export const Route = createFileRoute('/admin/analytics')({
  component: Analytics,
})
