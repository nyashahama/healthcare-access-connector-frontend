import adminService from "api/services/adminService";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for admin operations
 * @returns {Object} Admin methods and state
 */
export const useAdmin = () => {
  const queryClient = useQueryClient();

  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [permissions, setPermissions] = useState({
    canManageUsers: false,
    canManageClinics: false,
    canManageContent: false,
    canViewAnalytics: false,
    canManageSystem: false,
    adminLevel: null,
    assignedRegions: [],
  });

  const startLoading = useCallback(() => setLoadingCount((c) => c + 1), []);
  const stopLoading = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), []);
  const loading = loadingCount > 0;

  // Query parameter states for useQuery hooks with enabled: false
  const [activeAdminId, setActiveAdminId] = useState(null);
  const [activeUserId, setActiveUserId] = useState(null);
  const [activeSearchParams, setActiveSearchParams] = useState(null);
  const [activePermission, setActivePermission] = useState(null);

  // useQuery hooks with enabled: false (for cache registration only)
  useQuery({
    queryKey: [...queryKeys.admin.profile, activeAdminId],
    queryFn: () => adminService.getSystemAdmin(activeAdminId),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.admin.profile, "user", activeUserId],
    queryFn: () => adminService.getSystemAdminByUserId(activeUserId),
    enabled: false,
  });

  useQuery({
    queryKey: queryKeys.admin.profile,
    queryFn: () => adminService.getCurrentSystemAdminProfile(),
    enabled: false,
  });

  useQuery({
    queryKey: queryKeys.admin.permissions,
    queryFn: () => adminService.getAdminPermissions(),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.admin.users, activeSearchParams],
    queryFn: () => adminService.searchSystemAdmins(activeSearchParams),
    enabled: false,
  });

  useQuery({
    queryKey: [...queryKeys.admin.permissions, activePermission],
    queryFn: () => adminService.hasPermission(activePermission),
    enabled: false,
  });

  // Mutations
  const createSystemAdminMutation = useMutation({
    mutationFn: (data) => adminService.createSystemAdmin(data),
    onSuccess: async (data) => {
      setAdmin(data);
      try {
        const newPermissions = await adminService.getAdminPermissions();
        setPermissions(newPermissions);
        queryClient.setQueryData(queryKeys.admin.permissions, newPermissions);
      } catch (err) {
        // Silently fail permissions update
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });

  const updateSystemAdminMutation = useMutation({
    mutationFn: ({ adminId, data }) => adminService.updateSystemAdmin(adminId, data),
    onSuccess: async (data) => {
      setAdmin(data);
      try {
        const newPermissions = await adminService.getAdminPermissions();
        setPermissions(newPermissions);
        queryClient.setQueryData(queryKeys.admin.permissions, newPermissions);
      } catch (err) {
        // Silently fail permissions update
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });

  const deleteSystemAdminMutation = useMutation({
    mutationFn: (adminId) => adminService.deleteSystemAdmin(adminId),
    onSuccess: () => {
      setAdmin(null);
      setPermissions({
        canManageUsers: false,
        canManageClinics: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSystem: false,
        adminLevel: null,
        assignedRegions: [],
      });
      queryClient.removeQueries({ queryKey: queryKeys.admin.profile });
      queryClient.removeQueries({ queryKey: queryKeys.admin.permissions });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });

  const upsertSystemAdminProfileMutation = useMutation({
    mutationFn: (data) => adminService.upsertSystemAdminProfile(data),
    onSuccess: async (data) => {
      setAdmin(data);
      try {
        const newPermissions = await adminService.getAdminPermissions();
        setPermissions(newPermissions);
        queryClient.setQueryData(queryKeys.admin.permissions, newPermissions);
      } catch (err) {
        // Silently fail permissions update
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users });
    },
  });

  // Create system admin
  const createSystemAdmin = async (data) => {
    startLoading();
    setError(null);
    try {
      const validation = adminService.validateSystemAdmin(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await createSystemAdminMutation.mutateAsync(data);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to create system admin";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Get system admin by ID
  const getSystemAdmin = async (adminId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.admin.profile, adminId],
        queryFn: () => adminService.getSystemAdmin(adminId),
      });
      setAdmin(response);
      setActiveAdminId(adminId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load system admin";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Get system admin by user ID
  const getSystemAdminByUserId = async (userId) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.admin.profile, "user", userId],
        queryFn: () => adminService.getSystemAdminByUserId(userId),
      });
      setAdmin(response);
      setActiveUserId(userId);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load system admin";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Get current system admin profile
  const getCurrentSystemAdminProfile = async () => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.admin.profile,
        queryFn: () => adminService.getCurrentSystemAdminProfile(),
      });
      setAdmin(response);

      // Update permissions
      try {
        const newPermissions = await adminService.getAdminPermissions();
        setPermissions(newPermissions);
        queryClient.setQueryData(queryKeys.admin.permissions, newPermissions);
      } catch (err) {
        // Silently fail permissions update
      }

      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to load system admin profile";
      setError(errorMessage);
      stopLoading();
      // Don't set admin to null here, as 404 is expected for non-admin users
      return { success: false, error: errorMessage };
    }
  };

  // Update system admin
  const updateSystemAdmin = async (adminId, data) => {
    startLoading();
    setError(null);
    try {
      const validation = adminService.validateSystemAdmin(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await updateSystemAdminMutation.mutateAsync({ adminId, data });
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update system admin";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Delete system admin
  const deleteSystemAdmin = async (adminId) => {
    startLoading();
    setError(null);
    try {
      await deleteSystemAdminMutation.mutateAsync(adminId);
      stopLoading();
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete system admin";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Search system admins
  const searchSystemAdmins = async (params) => {
    startLoading();
    setError(null);
    try {
      const response = await queryClient.fetchQuery({
        queryKey: [...queryKeys.admin.users, params],
        queryFn: () => adminService.searchSystemAdmins(params),
      });
      setActiveSearchParams(params);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to search system admins";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Create or update system admin (upsert)
  const upsertSystemAdminProfile = async (data) => {
    startLoading();
    setError(null);
    try {
      const validation = adminService.validateSystemAdmin(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await upsertSystemAdminProfileMutation.mutateAsync(data);
      stopLoading();
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to save system admin profile";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Get permissions
  const getPermissions = async () => {
    startLoading();
    setError(null);
    try {
      const perms = await queryClient.fetchQuery({
        queryKey: queryKeys.admin.permissions,
        queryFn: () => adminService.getAdminPermissions(),
      });
      setPermissions(perms);
      stopLoading();
      return { success: true, data: perms };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load permissions";
      setError(errorMessage);
      stopLoading();
      return { success: false, error: errorMessage };
    }
  };

  // Check permission
  const hasPermission = async (permission) => {
    try {
      const result = await queryClient.fetchQuery({
        queryKey: [...queryKeys.admin.permissions, permission],
        queryFn: () => adminService.hasPermission(permission),
      });
      setActivePermission(permission);
      return result;
    } catch (err) {
      console.error("Failed to check permission:", err);
      return false;
    }
  };

  // Validate admin data
  const validateAdminData = useCallback((data) => {
    return adminService.validateSystemAdmin(data);
  }, []);

  // Get admin level display name
  const getAdminLevelDisplayName = useCallback((adminLevel) => {
    return adminService.getAdminLevelDisplayName(adminLevel);
  }, []);

  // Get all admin levels
  const getAllAdminLevels = useCallback(() => {
    return adminService.getAllAdminLevels();
  }, []);

  // Clear admin state
  const clearAdmin = useCallback(() => {
    setAdmin(null);
    setPermissions({
      canManageUsers: false,
      canManageClinics: false,
      canManageContent: false,
      canViewAnalytics: false,
      canManageSystem: false,
      adminLevel: null,
      assignedRegions: [],
    });
    setError(null);
    setActiveAdminId(null);
    setActiveUserId(null);
    setActiveSearchParams(null);
    setActivePermission(null);
    createSystemAdminMutation.reset();
    updateSystemAdminMutation.reset();
    deleteSystemAdminMutation.reset();
    upsertSystemAdminProfileMutation.reset();
  }, [createSystemAdminMutation, updateSystemAdminMutation, deleteSystemAdminMutation, upsertSystemAdminProfileMutation]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    createSystemAdminMutation.reset();
    updateSystemAdminMutation.reset();
    deleteSystemAdminMutation.reset();
    upsertSystemAdminProfileMutation.reset();
  }, [createSystemAdminMutation, updateSystemAdminMutation, deleteSystemAdminMutation, upsertSystemAdminProfileMutation]);

  // REMOVED: Auto-load useEffect that was causing infinite loops
  // Components should manually call getCurrentSystemAdminProfile when needed

  return {
    // Methods
    createSystemAdmin,
    getSystemAdmin,
    getSystemAdminByUserId,
    getCurrentSystemAdminProfile,
    updateSystemAdmin,
    deleteSystemAdmin,
    searchSystemAdmins,
    upsertSystemAdminProfile,
    getPermissions,
    hasPermission,
    validateAdminData,
    getAdminLevelDisplayName,
    getAllAdminLevels,
    clearAdmin,
    clearError,

    // State
    loading,
    error,
    admin,
    permissions,

    // Derived state
    isAdmin: !!admin,
    isSuperAdmin: permissions.adminLevel === "super_admin",
    canManageUsers: permissions.canManageUsers,
    canManageClinics: permissions.canManageClinics,
    canManageContent: permissions.canManageContent,
    canViewAnalytics: permissions.canViewAnalytics,
    canManageSystem: permissions.canManageSystem,
  };
};
