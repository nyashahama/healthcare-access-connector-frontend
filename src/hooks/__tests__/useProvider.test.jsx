import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import providerService from "api/services/providerService";
import { useProvider } from "../useProvider";

jest.mock("api/services/providerService", () => ({
  __esModule: true,
  default: {
    getMyClinic: jest.fn(),
    getClinics: jest.fn(),
    listClinicStaff: jest.fn(),
    getClinicService: jest.fn(),
  },
}));

describe("useProvider", () => {
  beforeEach(() => {
    providerService.getMyClinic.mockResolvedValue({
      clinic: { id: "c1", name: "City Clinic" },
    });
    providerService.getClinics.mockResolvedValue({
      clinics: [{ id: "c1", clinic_name: "City Clinic" }],
      total: 1,
    });
    providerService.listClinicStaff.mockResolvedValue({
      staff: [{ id: "s1", first_name: "Amina" }],
      total: 1,
    });
    providerService.getClinicService.mockResolvedValue({
      services: [{ id: "svc1", service_name: "Consultation" }],
      total: 1,
    });
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    return ({ children }) => (
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
    expect(staff).toEqual({
      success: true,
      data: [{ id: "s1", first_name: "Amina" }],
    });
    expect(services).toEqual({
      success: true,
      data: [{ id: "svc1", service_name: "Consultation" }],
    });
  });
});
