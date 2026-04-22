import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
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
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useConsultationMessages(), { wrapper });

    await act(async () => {
      await result.current.fetchMessages("c1", { limit: 10 });
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBe(1);
    });
  });
});
