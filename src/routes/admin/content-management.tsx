import { createFileRoute } from '@tanstack/react-router'
import ContentManagement from '@/views/admin/content-management'

export const Route = createFileRoute('/admin/content-management')({
  component: ContentManagement,
})
