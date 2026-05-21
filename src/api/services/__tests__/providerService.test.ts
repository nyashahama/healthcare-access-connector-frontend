import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from "api/apiClient";
import { providerService } from "../providerService";

vi.mock("api/apiClient", () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}));

describe("providerService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("updates approved verification status through the backend verify route", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({ data: { message: "Clinic verified successfully" } });

    const result = await providerService.updateVerifyClinic("c1", {
      status: "verified",
      verified_by: "u1",
      notes: "Approved",
    });

    expect(apiClient.put).toHaveBeenCalledWith(
      "/api/v1/providers/clinics/c1/verify",
      { verified_by: "u1", notes: "Approved" }
    );
    expect(result).toEqual({ message: "Clinic verified successfully" });
  });

  it("does not call the removed verification-status endpoint for rejected clinics", async () => {
    await expect(
      providerService.updateVerifyClinic("c1", {
        status: "rejected",
        verified_by: "u1",
        notes: "Missing license",
      })
    ).rejects.toThrow("Clinic rejection is not supported by the backend API");

    expect(apiClient.put).not.toHaveBeenCalled();
  });

  it("registers provider credentials with backend-compatible endpoint", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { id: "cred1", credential_type: "licence" },
    });

    const payload = { credential_type: "licence", number: "ABC123" };
    const result = await providerService.registerCredential(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/api/v1/providers/credentials",
      payload
    );
    expect(result).toEqual({ id: "cred1", credential_type: "licence" });
  });
});
