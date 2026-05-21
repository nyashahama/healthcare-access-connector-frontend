import { describe, it, expect, vi } from 'vitest';
import { createSessionManager } from "./sessionManager";

describe("session manager", () => {
  it("clears session and emits an event when unauthorized", () => {
    const events: string[] = [];
    const manager = createSessionManager({
      storage: {
        read: () => ({
          token: "abc",
          user: { id: "u1", email: "test@test.com", firstName: "Test", lastName: "User", roles: ["patient"], profileComplete: true },
          expiresAt: "2099-01-01T00:00:00Z",
        }),
        write: vi.fn(),
        clear: vi.fn(),
      },
      onEvent: (event: { type: string }) => events.push(event.type),
    });

    manager.handleUnauthorized();

    expect(events).toContain("session-expired");
  });
});
