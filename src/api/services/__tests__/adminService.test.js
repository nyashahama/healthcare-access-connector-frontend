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

  it("loads a system admin by id", async () => {
    apiClient.get.mockResolvedValue({
      data: { id: "a1", user_id: "u1", admin_level: "super_admin" },
    });

    const result = await adminService.getSystemAdmin("a1");

    expect(apiClient.get).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/a1"
    );
    expect(result).toEqual({ id: "a1", user_id: "u1", admin_level: "super_admin" });
  });

  it("updates a system admin by id", async () => {
    apiClient.put.mockResolvedValue({
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
    apiClient.delete.mockResolvedValue({
      data: { message: "System admin deleted successfully" },
    });

    const result = await adminService.deleteSystemAdmin("a1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/a1"
    );
    expect(result).toEqual({ message: "System admin deleted successfully" });
  });

  it("deletes a system admin by user id", async () => {
    apiClient.delete.mockResolvedValue({
      data: { message: "System admin deleted successfully" },
    });

    const result = await adminService.deleteSystemAdminByUserId("u1");

    expect(apiClient.delete).toHaveBeenCalledWith(
      "/api/v1/admin/system-admins/user/u1"
    );
    expect(result).toEqual({ message: "System admin deleted successfully" });
  });

  it("searches system admins with filters", async () => {
    apiClient.get.mockResolvedValue({
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
