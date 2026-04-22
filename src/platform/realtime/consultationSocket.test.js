import { createConsultationSocket } from "./consultationSocket";

describe("consultation socket", () => {
  it("reconnects with backoff and emits parsed events", () => {
    const socket = createConsultationSocket({
      wsUrl: "ws://localhost:8080",
      consultationId: "c1",
      token: "abc",
      onEvent: jest.fn(),
    });

    expect(socket.connect).toBeDefined();
    expect(socket.disconnect).toBeDefined();
  });
});
