import { createFileRoute } from '@tanstack/react-router'
import ProviderCommunityForum from '@/views/provider/community'

export const Route = createFileRoute('/provider/community/')({
  component: ProviderCommunityForum,
})
