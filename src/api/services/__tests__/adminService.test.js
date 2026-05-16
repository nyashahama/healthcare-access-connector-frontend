import apiClient from "api/apiClient";
import { sessionManager } from "platform/auth/sessionManager";
import adminService from "../adminService";

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

describe("adminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads the current admin through the backend user admin route", async () => {
    sessionManager.hydrate.mockReturnValue({ user: { id: "u1" } });
    apiClient.get.mockResolvedValue({
      data: { id: "a1", user_id: "u1", admin_level: "super_admin" },
    });

    const result = await adminService.getCurrentSystemAdminProfile();

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/user/u1"
    );
    expect(result).toEqual({
      id: "a1",
      user_id: "u1",
      admin_level: "super_admin",
    });
  });
});
