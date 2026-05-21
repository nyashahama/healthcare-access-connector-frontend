import { createFileRoute } from '@tanstack/react-router'
import CreateCommunityPost from '@/views/patient/community/CreateCommunityPost'

export const Route = createFileRoute('/patient/community/new')({
  component: CreateCommunityPost,
})
