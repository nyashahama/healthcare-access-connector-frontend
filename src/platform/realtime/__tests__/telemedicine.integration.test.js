import { createConsultationSocket } from "platform/realtime/consultationSocket";

describe("Telemedicine realtime integration", () => {
  let socketInstances = [];
  const originalWebSocket = global.WebSocket;

  beforeEach(() => {
    jest.useFakeTimers();
    socketInstances = [];
    global.WebSocket = jest.fn().mockImplementation(() => {
      const instance = {
        readyState: 0,
        send: jest.fn(),
        close: jest.fn(),
        onopen: null,
        onmessage: null,
        onclose: null,
      };
      socketInstances.push(instance);
      // Simulate open immediately
      setTimeout(() => {
        instance.readyState = 1;
        instance.onopen?.();
      }, 0);
      return instance;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    global.WebSocket = originalWebSocket;
  });

  it("deduplicates messages when the same message is broadcast twice", () => {
    const receivedMessages = [];

    const socket = createConsultationSocket({
      url: "ws://localhost:8080/ws/consultations/c1",
      onEvent: (envelope) => {
        if (envelope.type === "message") {
          const msg = envelope.payload;
          if (!receivedMessages.find((m) => m.id === msg.message_id)) {
            receivedMessages.push({
              id: msg.message_id,
              text: msg.content,
            });
          }
        }
      },
    });

    socket.connect();
    jest.advanceTimersByTime(10);

    const duplicatePayload = {
      type: "message",
      payload: {
        message_id: "m-duplicate",
        content: "Hello",
        sender_role: "provider_staff",
        sent_at: new Date().toISOString(),
      },
    };

    const mockSocket = socketInstances[0];
    mockSocket.onmessage({ data: JSON.stringify(duplicatePayload) });
    mockSocket.onmessage({ data: JSON.stringify(duplicatePayload) });

    expect(receivedMessages.length).toBe(1);
    expect(receivedMessages[0].text).toBe("Hello");

    socket.disconnect();
  });

  it("reconnects and continues receiving messages after disconnect", () => {
    const receivedMessages = [];

    const socket = createConsultationSocket({
      url: "ws://localhost:8080/ws/consultations/c1",
      onEvent: (envelope) => {
        if (envelope.type === "message") {
          receivedMessages.push(envelope.payload.content);
        }
      },
    });

    socket.connect();
    jest.advanceTimersByTime(10);

    // First message
    const firstSocket = socketInstances[0];
    firstSocket.onmessage({
      data: JSON.stringify({
        type: "message",
        payload: { content: "First", sender_role: "provider_staff" },
      }),
    });

    expect(receivedMessages).toContain("First");

    // Simulate disconnect
    firstSocket.onclose();

    // Advance past the first reconnect delay (1000ms with 0 attempts)
    jest.advanceTimersByTime(1500);

    // The reconnect should have created a second WebSocket instance
    expect(socketInstances.length).toBeGreaterThanOrEqual(2);

    const newSocket = socketInstances[socketInstances.length - 1];
    newSocket.readyState = 1;
    newSocket.onopen?.();

    // Message after reconnect
    newSocket.onmessage({
      data: JSON.stringify({
        type: "message",
        payload: {
          content: "After reconnect",
          sender_role: "provider_staff",
        },
      }),
    });

    expect(receivedMessages).toContain("After reconnect");

    socket.disconnect();
  });
});
