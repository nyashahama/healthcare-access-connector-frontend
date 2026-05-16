import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import patientService from "api/services/patientService";
import { usePatient } from "../usePatient";

jest.mock("api/services/patientService", () => ({
  __esModule: true,
  default: {
    getCurrentPatientProfile: jest.fn(),
    getPatientProfileByUserId: jest.fn(),
    upsertPatientProfile: jest.fn(),
    calculateProfileCompletion: () => 80,
  },
}));

describe("usePatient", () => {
  beforeEach(() => {
    patientService.getCurrentPatientProfile.mockResolvedValue({
      id: "p1",
      first_name: "Amina",
      last_name: "Dube",
    });
    patientService.getPatientProfileByUserId.mockResolvedValue({
      id: "p1",
      user_id: "u1",
      first_name: "Amina",
      last_name: "Dube",
    });
    patientService.upsertPatientProfile.mockImplementation((data) =>
      Promise.resolve({ id: "p1", ...data })
    );
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("hydrates patient state from a shared query", async () => {
    const { result } = renderHook(() => usePatient(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await result.current.getCurrentPatientProfile();
    });

    await waitFor(() => {
      expect(result.current.patient?.id).toBe("p1");
    });
  });

  it("returns success wrappers for patient profile calls used by views", async () => {
    const { result } = renderHook(() => usePatient(), {
      wrapper: createWrapper(),
    });
    let response;
    await act(async () => {
      response = await result.current.getPatientProfileByUserId("u1");
    });

    expect(response).toEqual({
      success: true,
      data: {
        id: "p1",
        user_id: "u1",
        first_name: "Amina",
        last_name: "Dube",
      },
    });
  });
});
