import type { AxiosError } from 'axios'

export type HttpErrorKind = 'network' | 'auth' | 'forbidden' | 'not_found' | 'conflict' | 'validation' | 'server'

export interface HttpError extends Error {
  kind: HttpErrorKind
  status: number
  message: string
  cause: AxiosError
}

export interface HttpClientConfig {
  baseURL: string
  getToken: (() => string | null | undefined) | undefined
  onUnauthorized: ((error: HttpError) => void) | undefined
}
