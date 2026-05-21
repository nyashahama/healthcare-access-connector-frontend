import axios from 'axios'
import { normalizeHttpError } from './httpError'
import type { HttpClientConfig, HttpError } from './types'
import type { AxiosInstance } from 'axios'

export const createHttpClient = ({
  baseURL,
  getToken,
  onUnauthorized,
}: HttpClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  })

  client.interceptors.request.use((config) => {
    const token = getToken?.()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalized = normalizeHttpError(error)
      if (normalized.kind === 'auth') {
        const msg = (normalized.message || '').toLowerCase()
        const isRealAuthFailure =
          msg.includes('invalid') ||
          msg.includes('expired') ||
          msg.includes('unauthorized') ||
          msg.includes('unauthenticated') ||
          msg.includes('token') ||
          msg.includes('sign in') ||
          msg.includes('login')
        if (isRealAuthFailure) {
          onUnauthorized?.(normalized)
        }
      }
      return Promise.reject(normalized)
    },
  )

  return client
}
