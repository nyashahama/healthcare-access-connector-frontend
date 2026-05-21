import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi } from 'vitest';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/platform/query/queryClient";
import { useConsultationMessages } from "../useConsultationMessages";
import React from 'react';

vi.mock("@/api/services/consultationMessagesService", () => ({
  consultationMessagesService: {
    getConsultationMessages: vi.fn().mockResolvedValue({ messages: [{ id: "m1", content: "Hello" }], count: 1 }),
    sendMessage: vi.fn().mockResolvedValue({ id: "m2", content: "Hi" }),
  },
}));

describe("useConsultationMessages", () => {
  it("fetches messages for a consultation", async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
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
