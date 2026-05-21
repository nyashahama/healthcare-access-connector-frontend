import { createFileRoute } from '@tanstack/react-router'
import CommunityForum from '@/views/patient/community'

export const Route = createFileRoute('/patient/community/')({
  component: CommunityForum,
})
