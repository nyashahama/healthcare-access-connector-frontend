import type { AxiosError } from 'axios'
import type { HttpError, HttpErrorKind } from './types'

export const normalizeHttpError = (error: AxiosError): HttpError => {
  if (!error.response) {
    return {
      kind: 'network',
      status: 0,
      message: 'Unable to reach the server',
      cause: error,
    } as HttpError
  }

  const status = error.response.status
  const data = error.response.data as { error?: string } | undefined
  const message = data?.error || error.message

  let kind: HttpErrorKind
  if (status === 401) kind = 'auth'
  else if (status === 403) kind = 'forbidden'
  else if (status === 404) kind = 'not_found'
  else if (status === 409) kind = 'conflict'
  else if (status === 422) kind = 'validation'
  else kind = 'server'

  return { kind, status, message, cause: error } as HttpError
}
