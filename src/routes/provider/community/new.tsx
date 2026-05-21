import { createFileRoute } from '@tanstack/react-router'
import CreateProviderCommunityPost from '@/views/provider/community/CreateCommunityPost'

export const Route = createFileRoute('/provider/community/new')({
  component: CreateProviderCommunityPost,
})
