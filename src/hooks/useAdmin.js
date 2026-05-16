import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import adminService from "api/services/adminService";
import { queryKeys } from "platform/query/queryKeys";

const emptyPermissions = {
  canManageUsers: false,
  canManageClinics: false,
  canManageContent: false,
  canViewAnalytics: false,
  canManageSystem: false,
  adminLevel: null,
  assignedRegions: [],
};

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error || err.message || fallback;

export const useAdmin = () => {
  const queryClient = useQueryClient();
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [permissions, setPermissions] = useState(emptyPermissions);

  const startLoading = useCallback(() => setLoadingCount((count) => count + 1), []);
  const stopLoading = useCallback(
    () => setLoadingCount((count) => Math.max(0, count - 1)),
    []
  );

  const setAdminState = useCallback(
    (profile) => {
      setAdmin(profile || null);
      const normalized = adminService.normalizePermissionPayload(profile);
      setPermissions(normalized);
      if (profile) {
        queryClient.setQueryData(
          [...queryKeys.admin.profile, "user", profile.user_id],
          profile
        );
        queryClient.setQueryData(queryKeys.admin.current, profile);
        queryClient.setQueryData(queryKeys.admin.permissions, normalized);
      }
    },
    [queryClient]
  );

  const run = useCallback(
    async (fn, fallback) => {
      startLoading();
      setError(null);
      try {
        const data = await fn();
        stopLoading();
        return { success: true, data };
      } catch (err) {
        const message = getErrorMessage(err, fallback);
        setError(message);
        stopLoading();
        return { success: false, error: message };
      }
    },
    [startLoading, stopLoading]
  );

  const createSystemAdmin = useCallback(
    async (data) =>
      run(async () => {
        const validation = adminService.validateSystemAdmin(data);
        if (!validation.isValid) {
          throw new Error(
            `Validation failed: ${JSON.stringify(validation.errors)}`
          );
        }

        const response = await adminService.createSystemAdmin(data);
        setAdminState(response);
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
        return response;
      }, "Failed to create system admin"),
    [queryClient, run, setAdminState]
  );

  const getSystemAdminByUserId = useCallback(
    async (userId) =>
      run(async () => {
        const response = await queryClient.fetchQuery({
          queryKey: [...queryKeys.admin.profile, "user", userId],
          queryFn: () => adminService.getSystemAdminByUserId(userId),
        });
        setAdminState(response);
        return response;
      }, "Failed to load system admin"),
    [queryClient, run, setAdminState]
  );

  const getCurrentSystemAdminProfile = useCallback(
    async () =>
      run(async () => {
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.admin.current,
          queryFn: adminService.getCurrentSystemAdminProfile,
        });
        setAdminState(response);
        return response;
      }, "Failed to load system admin profile"),
    [queryClient, run, setAdminState]
  );

  const getPermissions = useCallback(
    async () =>
      run(async () => {
        const response = await adminService.getAdminPermissions();
        setPermissions(response);
        queryClient.setQueryData(queryKeys.admin.permissions, response);
        return response;
      }, "Failed to load permissions"),
    [queryClient, run]
  );

  const hasPermission = useCallback(
    async (permission) => {
      const source =
        admin || (await adminService.getCurrentSystemAdminProfile().catch(() => null));
      const normalized = adminService.normalizePermissionPayload(source);
      const permissionMap = {
        manage_users: normalized.canManageUsers,
        manage_clinics: normalized.canManageClinics,
        manage_content: normalized.canManageContent,
        view_analytics: normalized.canViewAnalytics,
        manage_system: normalized.canManageSystem,
      };
      return Boolean(permissionMap[permission]);
    },
    [admin]
  );

  const unsupported = useCallback(
    async (operation) => ({
      success: false,
      error: `${operation} is not supported by the backend admin API`,
    }),
    []
  );

  const validateAdminData = useCallback(
    (data) => adminService.validateSystemAdmin(data),
    []
  );

  const getAdminLevelDisplayName = useCallback(
    (adminLevel) => adminService.getAdminLevelDisplayName(adminLevel),
    []
  );

  const getAllAdminLevels = useCallback(
    () => adminService.getAllAdminLevels(),
    []
  );

  const clearAdmin = useCallback(() => {
    setAdmin(null);
    setPermissions(emptyPermissions);
    setError(null);
    queryClient.removeQueries({ queryKey: queryKeys.admin.current });
    queryClient.removeQueries({ queryKey: queryKeys.admin.permissions });
  }, [queryClient]);

  const clearError = useCallback(() => setError(null), []);

  return {
    createSystemAdmin,
    getSystemAdmin: (adminId) =>
      unsupported(`Loading system admin by profile ID ${adminId}`),
    getSystemAdminByUserId,
    getCurrentSystemAdminProfile,
    updateSystemAdmin: (adminId) =>
      unsupported(`Updating system admin by profile ID ${adminId}`),
    deleteSystemAdmin: (adminId) =>
      unsupported(`Deleting system admin by profile ID ${adminId}`),
    searchSystemAdmins: () => unsupported("Searching system admins"),
    upsertSystemAdminProfile: createSystemAdmin,
    getPermissions,
    hasPermission,
    validateAdminData,
    getAdminLevelDisplayName,
    getAllAdminLevels,
    clearAdmin,
    clearError,
    loading: loadingCount > 0,
    error,
    admin,
    permissions,
    isAdmin: Boolean(admin),
    isSuperAdmin: permissions.adminLevel === "super_admin",
    canManageUsers: permissions.canManageUsers,
    canManageClinics: permissions.canManageClinics,
    canManageContent: permissions.canManageContent,
    canViewAnalytics: permissions.canViewAnalytics,
    canManageSystem: permissions.canManageSystem,
  };
};
