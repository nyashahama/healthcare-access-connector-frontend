import { createSessionManager } from "./sessionManager";

describe("session manager", () => {
  it("clears session and emits an event when unauthorized", () => {
    const events = [];
    const manager = createSessionManager({
      storage: {
        read: () => ({
          token: "abc",
          user: { id: "u1", role: "patient" },
          expiresAt: "2099-01-01T00:00:00Z",
        }),
        write: jest.fn(),
        clear: jest.fn(),
      },
      onEvent: (event) => events.push(event.type),
    });

    manager.handleUnauthorized();

    expect(events).toContain("session-expired");
  });
});
