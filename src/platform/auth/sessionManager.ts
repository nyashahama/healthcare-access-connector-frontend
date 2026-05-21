import { sessionStore } from './sessionStore'
import type { SessionManagerDeps, SessionManager, SessionEvent } from './types'
import type { SessionData } from '@/types/auth'

export const createSessionManager = ({
  storage = sessionStore,
  onEvent = (_event: SessionEvent) => {},
}: SessionManagerDeps = {}): SessionManager => ({
  hydrate() {
    return storage.read()
  },
  saveSession(session: Partial<SessionData>) {
    storage.write(session)
    onEvent({ type: 'session-saved', payload: session })
  },
  clearSession(reason = 'manual') {
    storage.clear()
    onEvent({ type: 'session-expired', payload: { reason } })
  },
  handleUnauthorized() {
    storage.clear()
    onEvent({ type: 'session-expired', payload: { reason: 'unauthorized' } })
  },
})

export const sessionManager = createSessionManager()
