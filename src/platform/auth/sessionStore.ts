import type { SessionStore } from './types'
import type { SessionData, User } from '@/types/auth'

const KEYS = {
  token: 'token',
  user: 'user',
  expiresAt: 'tokenExpiry',
} as const

export const sessionStore: SessionStore = {
  read() {
    const token = localStorage.getItem(KEYS.token)
    const user = localStorage.getItem(KEYS.user)
    const expiresAt = localStorage.getItem(KEYS.expiresAt)

    return {
      token,
      user: user ? (JSON.parse(user) as User) : null,
      expiresAt,
    }
  },
  write({ token, user, expiresAt }: Partial<SessionData>) {
    if (token) localStorage.setItem(KEYS.token, token)
    if (user) localStorage.setItem(KEYS.user, JSON.stringify(user))
    if (expiresAt) localStorage.setItem(KEYS.expiresAt, expiresAt)
  },
  clear() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key))
  },
}
