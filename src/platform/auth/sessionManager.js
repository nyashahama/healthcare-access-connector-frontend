import { sessionStore } from "./sessionStore";

export const createSessionManager = ({
  storage = sessionStore,
  onEvent = () => {},
} = {}) => ({
  hydrate() {
    return storage.read();
  },
  saveSession(session) {
    storage.write(session);
    onEvent({ type: "session-saved", payload: session });
  },
  clearSession(reason = "manual") {
    storage.clear();
    onEvent({ type: "session-expired", payload: { reason } });
  },
  handleUnauthorized() {
    storage.clear();
    onEvent({ type: "session-expired", payload: { reason: "unauthorized" } });
  },
});

export const sessionManager = createSessionManager();
