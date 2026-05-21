const requiredKeys = ['VITE_API_URL'] as const

export interface RuntimeConfig {
  apiUrl: string
  wsUrl: string
  environment: string
}

export const getRuntimeConfig = (): RuntimeConfig => {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined
  const wsUrl =
    (import.meta.env.VITE_WS_URL as string | undefined) ??
    (apiUrl ? apiUrl.replace(/^http/, 'ws') : 'ws://localhost:8080')

  if (import.meta.env.MODE !== 'test') {
    for (const key of requiredKeys) {
      if (!import.meta.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`)
      }
    }
  }

  return {
    apiUrl: apiUrl || 'http://localhost:8080',
    wsUrl,
    environment:
      (import.meta.env.VITE_ENVIRONMENT as string | undefined) ?? import.meta.env.MODE ?? 'development',
  }
}
