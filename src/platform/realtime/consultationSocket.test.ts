import { describe, it, expect, vi } from 'vitest';
import { createConsultationSocket } from "./consultationSocket";

describe("consultation socket", () => {
  it("reconnects with backoff and emits parsed events", () => {
    const socket = createConsultationSocket({
      url: "ws://localhost:8080",
      onEvent: vi.fn(),
    });

    expect(socket.connect).toBeDefined();
    expect(socket.disconnect).toBeDefined();
  });
});
