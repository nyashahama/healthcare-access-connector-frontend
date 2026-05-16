import apiClient from "api/apiClient";
import { sessionManager } from "platform/auth/sessionManager";
import patientService from "../patientService";

jest.mock("api/apiClient", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock("platform/auth/sessionManager", () => ({
  sessionManager: {
    hydrate: jest.fn(),
  },
}));

describe("patientService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the current patient through the backend user profile route", async () => {
    sessionManager.hydrate.mockReturnValue({ user: { id: "u1" } });
    apiClient.get.mockResolvedValue({ data: { id: "p1", user_id: "u1" } });

    const result = await patientService.getCurrentPatientProfile();

    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/patients/user/u1");
    expect(result).toEqual({ id: "p1", user_id: "u1" });
  });

  it("upserts patient profiles through the backend create endpoint", async () => {
    apiClient.post.mockResolvedValue({ data: { id: "p1" } });

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
