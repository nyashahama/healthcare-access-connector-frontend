export const getErrorMessage = (err: unknown, fallback = 'An error occurred'): string => {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response: { data?: { error?: string } } }).response
    if (response?.data?.error) return response.data.error
  }
  if (err && typeof err === 'object' && 'message' in err) {
    return (err as { message: string }).message
  }
  return fallback
}
