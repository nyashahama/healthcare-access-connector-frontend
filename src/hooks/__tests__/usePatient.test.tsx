import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { patientService } from "@/api/services/patientService";
import { usePatient } from "../usePatient";
import React from 'react';

vi.mock("@/api/services/patientService", () => ({
  patientService: {
    getCurrentPatientProfile: vi.fn(),
    getPatientProfileByUserId: vi.fn(),
    upsertPatientProfile: vi.fn(),
    calculateProfileCompletion: vi.fn(() => 80),
  },
}));

describe("usePatient", () => {
  beforeEach(() => {
    vi.mocked(patientService.getCurrentPatientProfile).mockResolvedValue({
      id: "p1", first_name: "Amina", last_name: "Dube", user_id: "u1", country: "Zimbabwe", preferred_communication_method: "email", timezone: "Africa/Harare",
    } as never);
    vi.mocked(patientService.getPatientProfileByUserId).mockResolvedValue({
      id: "p1", user_id: "u1", first_name: "Amina", last_name: "Dube", country: "Zimbabwe", preferred_communication_method: "email", timezone: "Africa/Harare",
    } as never);
    vi.mocked(patientService.upsertPatientProfile).mockImplementation((data) =>
      Promise.resolve({ id: "p1", ...data } as never)
    );
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
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

    expect(response).toMatchObject({
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
