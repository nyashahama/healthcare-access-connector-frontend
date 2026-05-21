import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { providerService } from "@/api/services/providerService";
import { useProvider } from "../useProvider";
import React from 'react';

vi.mock("@/api/services/providerService", () => ({
  providerService: {
    getMyClinic: vi.fn(),
    getClinics: vi.fn(),
    listClinicStaff: vi.fn(),
    getClinicService: vi.fn(),
  },
}));

describe("useProvider", () => {
  beforeEach(() => {
    vi.mocked(providerService.getMyClinic).mockResolvedValue({
      clinic: { id: "c1", name: "City Clinic" },
    } as never);
    vi.mocked(providerService.getClinics).mockResolvedValue({
      clinics: [{ id: "c1", clinic_name: "City Clinic" }],
      total: 1,
    } as never);
    vi.mocked(providerService.listClinicStaff).mockResolvedValue({
      staff: [{ id: "s1", first_name: "Amina", last_name: "", staff_role: "doctor", clinic_id: "c1", user_id: "u1", staff_id: "s1", work_email: "", email: "", work_phone: "", phone_number: "", employment_status: "", status: "", role: "" }],
      total: 1,
    } as never);
    vi.mocked(providerService.getClinicService).mockResolvedValue({
      services: [{ id: "svc1", service_name: "Consultation", service_id: "svc1" }],
    } as never);
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it("hydrates clinic state from a shared query", async () => {
    const { result } = renderHook(() => useProvider(), {
      wrapper: createWrapper(),
    });
    await act(async () => {
      await result.current.getMyClinic();
    });

    await waitFor(() => {
      expect(result.current.clinic?.id).toBe("c1");
    });
  });

  it("hydrates clinic, staff, and service lists with view-compatible arrays", async () => {
    const { result } = renderHook(() => useProvider(), {
      wrapper: createWrapper(),
    });

    let clinics;
    let staff;
    let services;
    await act(async () => {
      clinics = await result.current.getClinics();
      staff = await result.current.listClinicStaff("c1");
      services = await result.current.getClinicService("c1");
    });

    expect(clinics.success).toBe(true);
    expect(clinics.data.clinics).toHaveLength(1);
    expect(staff).toMatchObject({
      success: true,
      data: [{ id: "s1", first_name: "Amina" }],
    });
    expect(services).toMatchObject({
      success: true,
      data: [{ id: "svc1", service_name: "Consultation" }],
    });
  });
});
