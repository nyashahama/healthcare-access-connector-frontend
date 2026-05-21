import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createConsultationSocket } from "platform/realtime/consultationSocket";

interface MockSocketInstance {
  readyState: number;
  send: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  onopen: (() => void) | null;
  onmessage: ((event: { data: string }) => void) | null;
  onclose: (() => void) | null;
}

describe("Telemedicine realtime integration", () => {
  let socketInstances: MockSocketInstance[] = [];
  const originalWebSocket = global.WebSocket;

  beforeEach(() => {
    vi.useFakeTimers();
    socketInstances = [];
    global.WebSocket = vi.fn().mockImplementation(() => {
      const instance: MockSocketInstance = {
        readyState: 0,
        send: vi.fn(),
        close: vi.fn(),
        onopen: null,
        onmessage: null,
        onclose: null,
      };
      socketInstances.push(instance);
      setTimeout(() => {
        instance.readyState = 1;
        instance.onopen?.();
      }, 0);
      return instance;
    }) as unknown as typeof WebSocket;
  });

  afterEach(() => {
    vi.useRealTimers();
    global.WebSocket = originalWebSocket;
  });

  it("deduplicates messages when the same message is broadcast twice", () => {
    const receivedMessages: { id: string; text: string }[] = [];

    const socket = createConsultationSocket({
      url: "ws://localhost:8080/ws/consultations/c1",
      onEvent: (data: unknown) => {
        const envelope = data as { type: string; payload: { message_id: string; content: string } };
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
    vi.advanceTimersByTime(10);

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
    mockSocket.onmessage!({ data: JSON.stringify(duplicatePayload) });
    mockSocket.onmessage!({ data: JSON.stringify(duplicatePayload) });

    expect(receivedMessages.length).toBe(1);
    expect(receivedMessages[0].text).toBe("Hello");

    socket.disconnect();
  });

  it("reconnects and continues receiving messages after disconnect", () => {
    const receivedMessages: string[] = [];

    const socket = createConsultationSocket({
      url: "ws://localhost:8080/ws/consultations/c1",
      onEvent: (data: unknown) => {
        const envelope = data as { type: string; payload: { content: string } };
        if (envelope.type === "message") {
          receivedMessages.push(envelope.payload.content);
        }
      },
    });

    socket.connect();
    vi.advanceTimersByTime(10);

    const firstSocket = socketInstances[0];
    firstSocket.onmessage!({
      data: JSON.stringify({
        type: "message",
        payload: { content: "First", sender_role: "provider_staff" },
      }),
    });

    expect(receivedMessages).toContain("First");

    firstSocket.onclose!();

    vi.advanceTimersByTime(1500);

    expect(socketInstances.length).toBeGreaterThanOrEqual(2);

    const newSocket = socketInstances[socketInstances.length - 1];
    newSocket.readyState = 1;
    newSocket.onopen?.();

    newSocket.onmessage!({
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
