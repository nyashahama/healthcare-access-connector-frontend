import { renderHook, waitFor, act } from "@testing-library/react";
import { useConsultationMessages } from "../useConsultationMessages";

jest.mock("api/services/consultationMessagesService", () => ({
  __esModule: true,
  default: {
    getConsultationMessages: () =>
      Promise.resolve({ messages: [{ id: "m1", content: "Hello" }], count: 1 }),
    sendMessage: () => Promise.resolve({ id: "m2", content: "Hi" }),
  },
}));

describe("useConsultationMessages", () => {
  it("fetches messages for a consultation", async () => {
    const { result } = renderHook(() => useConsultationMessages());

    await act(async () => {
      await result.current.fetchMessages("c1", { limit: 10 });
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBe(1);
    });
  });
});
