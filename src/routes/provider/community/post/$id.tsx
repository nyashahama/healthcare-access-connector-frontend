import { createFileRoute } from '@tanstack/react-router'
import ProviderCommunityPost from '@/views/provider/community/CommunityPost'

export const Route = createFileRoute('/provider/community/post/$id')({
  component: ProviderCommunityPost,
})
