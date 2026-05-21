import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from "@/api/apiClient";
import { sessionManager } from "@/platform/auth/sessionManager";
import { patientService } from "../patientService";

vi.mock("@/api/apiClient", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/platform/auth/sessionManager", () => ({
  sessionManager: {
    hydrate: vi.fn(),
  },
}));

describe("patientService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the current patient through the backend user profile route", async () => {
    vi.mocked(sessionManager.hydrate).mockReturnValue({
      token: "test-token",
      user: { id: "u1", email: "test@test.com", firstName: "Test", lastName: "User", roles: ["patient"], profileComplete: true },
      expiresAt: "2099-01-01T00:00:00Z",
    });
    vi.mocked(apiClient.get).mockResolvedValue({ data: { id: "p1", user_id: "u1" } });

    const result = await patientService.getCurrentPatientProfile();

    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/patients/user/u1");
    expect(result).toEqual({ id: "p1", user_id: "u1" });
  });

  it("upserts patient profiles through the backend create endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({ data: { id: "p1" } });

    await patientService.upsertPatientProfile({
      user_id: "u1",
      first_name: "Amina",
      last_name: "Dube",
      country: "South Africa",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/api/v1/patients", {
      user_id: "u1",
      first_name: "Amina",
      last_name: "Dube",
      country: "South Africa",
    });
    expect(apiClient.put).not.toHaveBeenCalled();
  });
});
