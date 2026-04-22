import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { usePatient } from "../usePatient";

jest.mock("api/services/patientService", () => ({
  __esModule: true,
  default: {
    getCurrentPatientProfile: () => Promise.resolve({
      id: "p1",
      first_name: "Amina",
      last_name: "Dube",
    }),
    calculateProfileCompletion: () => 80,
  },
}));

describe("usePatient", () => {
  it("hydrates patient state from a shared query", async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatient(), { wrapper });
    await result.current.getCurrentPatientProfile();

    await waitFor(() => {
      expect(result.current.patient?.id).toBe("p1");
    });
  });
});
