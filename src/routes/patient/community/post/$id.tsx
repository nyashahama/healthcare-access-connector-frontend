import { createFileRoute } from '@tanstack/react-router'
import CommunityPost from '@/views/patient/community/CommunityPost'

export const Route = createFileRoute('/patient/community/post/$id')({
  component: CommunityPost,
})
