import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { useProvider } from "../useProvider";

jest.mock("api/services/providerService", () => ({
  __esModule: true,
  default: {
    getMyClinic: () => Promise.resolve({
      clinic: { id: "c1", name: "City Clinic" },
    }),
  },
}));

describe("useProvider", () => {
  it("hydrates clinic state from a shared query", async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useProvider(), { wrapper });
    await result.current.getMyClinic();

    await waitFor(() => {
      expect(result.current.clinic?.id).toBe("c1");
    });
  });
});
