import { useCallback } from 'react'

export const useErrorLogger = (): ((error: unknown, errorInfo?: unknown, context?: string) => void) => {
  return useCallback((error: unknown, errorInfo?: unknown, context = 'unknown') => {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[Error Boundary: ${context}]`,
        error,
        (errorInfo as { componentStack?: string })?.componentStack || ''
      )
    }
  }, [])
}
