import { QueryClient } from '@tanstack/react-query'
import type { HttpError } from '@/platform/http/types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => {
        const httpErr = error as HttpError
        return httpErr?.kind === 'network' && count < 2
      },
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
})
