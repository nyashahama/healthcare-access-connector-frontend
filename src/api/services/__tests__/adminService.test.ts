import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from "@/api/apiClient";
import { sessionManager } from "@/platform/auth/sessionManager";
import { adminService } from "../adminService";

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

describe("adminService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the current admin through the backend user admin route", async () => {
    vi.mocked(sessionManager.hydrate).mockReturnValue({
      token: "test-token",
      user: { id: "u1", email: "test@test.com", firstName: "Test", lastName: "User", roles: ["system_admin"], profileComplete: true },
      expiresAt: "2099-01-01T00:00:00Z",
    });
    vi.mocked(apiClient.get).mockResolvedValue({
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

  it("loads a system admin by id", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { id: "a1", user_id: "u1", admin_level: "super_admin" },
    });

    const result = await adminService.getSystemAdmin("a1");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/a1"
    );
    expect(result).toEqual({ id: "a1", user_id: "u1", admin_level: "super_admin" });
  });

  it("updates a system admin by id", async () => {
    vi.mocked(apiClient.put).mockResolvedValue({
      data: { id: "a1", admin_level: "regional" },
    });

    const result = await adminService.updateSystemAdmin("a1", {
      admin_level: "regional",
    });

    expect(apiClient.put).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/a1",
      { admin_level: "regional" }
    );
    expect(result).toEqual({ id: "a1", admin_level: "regional" });
  });

  it("deletes a system admin by id", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: { message: "System admin deleted successfully" },
    });

    const result = await adminService.deleteSystemAdmin("a1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/a1"
    );
    expect(result).toEqual({ message: "System admin deleted successfully" });
  });

  it("deletes a system admin by user id", async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({
      data: { message: "System admin deleted successfully" },
    });

    const result = await adminService.deleteSystemAdminByUserId("u1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/user/u1"
    );
    expect(result).toEqual({ message: "System admin deleted successfully" });
  });

  it("searches system admins with filters", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: [{ id: "a1" }, { id: "a2" }],
    });

    const result = await adminService.searchSystemAdmins({
      admin_level: "super_admin",
      region: "North",
      query: "john",
      limit: 10,
      offset: 2,
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/search?admin_level=super_admin&region=North&query=john&limit=10&offset=2"
    );
    expect(result).toEqual([{ id: "a1" }, { id: "a2" }]);
  });
});
