import adminService from "api/services/adminService";
import { useCallback, useState } from "react";

/**
 * Custom hook for admin operations
 * @returns {Object} Admin methods and state
 */
export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
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

  // Create system admin
  const createSystemAdmin = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = adminService.validateSystemAdmin(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await adminService.createSystemAdmin(data);
      setAdmin(response);

      // Update permissions
      const newPermissions = await adminService.getAdminPermissions();
      setPermissions(newPermissions);

      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to create system admin";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get system admin by ID
  const getSystemAdmin = useCallback(async (adminId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getSystemAdmin(adminId);
      setAdmin(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load system admin";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get system admin by user ID
  const getSystemAdminByUserId = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getSystemAdminByUserId(userId);
      setAdmin(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load system admin";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get current system admin profile
  const getCurrentSystemAdminProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getCurrentSystemAdminProfile();
      setAdmin(response);

      // Update permissions
      const newPermissions = await adminService.getAdminPermissions();
      setPermissions(newPermissions);

      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to load system admin profile";
      setError(errorMessage);
      setLoading(false);
      // Don't set admin to null here, as 404 is expected for non-admin users
      return { success: false, error: errorMessage };
    }
  }, []);

  // Update system admin
  const updateSystemAdmin = useCallback(async (adminId, data) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = adminService.validateSystemAdmin(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await adminService.updateSystemAdmin(adminId, data);
      setAdmin(response);

      // Update permissions
      const newPermissions = await adminService.getAdminPermissions();
      setPermissions(newPermissions);

      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to update system admin";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Delete system admin
  const deleteSystemAdmin = useCallback(async (adminId) => {
    setLoading(true);
    setError(null);

    try {
      await adminService.deleteSystemAdmin(adminId);
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
      setLoading(false);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to delete system admin";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Search system admins
  const searchSystemAdmins = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.searchSystemAdmins(params);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to search system admins";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Create or update system admin (upsert)
  const upsertSystemAdminProfile = useCallback(async (data) => {
    setLoading(true);
    setError(null);

    try {
      // Validate data
      const validation = adminService.validateSystemAdmin(data);
      if (!validation.isValid) {
        throw new Error(
          "Validation failed: " + JSON.stringify(validation.errors)
        );
      }

      const response = await adminService.upsertSystemAdminProfile(data);
      setAdmin(response);

      // Update permissions
      const newPermissions = await adminService.getAdminPermissions();
      setPermissions(newPermissions);

      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to save system admin profile";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get permissions
  const getPermissions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const perms = await adminService.getAdminPermissions();
      setPermissions(perms);
      setLoading(false);
      return { success: true, data: perms };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Failed to load permissions";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Check permission
  const hasPermission = useCallback(async (permission) => {
    try {
      return await adminService.hasPermission(permission);
    } catch (err) {
      console.error("Failed to check permission:", err);
      return false;
    }
  }, []);

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
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

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
