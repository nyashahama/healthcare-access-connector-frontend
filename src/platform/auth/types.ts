import type { SessionData } from '@/types/auth'

export interface SessionStore {
  read(): { token: string | null; user: SessionData['user'] | null; expiresAt: string | null }
  write(session: Partial<SessionData>): void
  clear(): void
}

export type SessionEvent = { type: 'session-saved'; payload: Partial<SessionData> } | { type: 'session-expired'; payload: { reason: string } }

export interface SessionManagerDeps {
  storage?: SessionStore
  onEvent?: (event: SessionEvent) => void
}

export interface SessionManager {
  hydrate(): ReturnType<SessionStore['read']>
  saveSession(session: Partial<SessionData>): void
  clearSession(reason?: string): void
  handleUnauthorized(): void
}
