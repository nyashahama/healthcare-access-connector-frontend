import apiClient from "api/apiClient";
import { sessionManager } from "platform/auth/sessionManager";

const getCurrentUserId = () => {
  const userId = sessionManager.hydrate()?.user?.id;
  if (!userId) {
    throw new Error("Current user is not available");
  }
  return userId;
};

/**
 * Admin Service
 * Handles all API calls related to system admin operations
 */
const adminService = {
  /**
   * Create a new system admin profile
   * @param {Object} data - System admin data
   * @param {string} data.user_id - User ID
   * @param {string} data.admin_level - Admin level
   * @param {string[]} data.assigned_regions - Assigned regions
   * @param {string} data.department - Department
   * @param {Object} data.permissions - Permissions object
   * @param {boolean} data.can_manage_users - Can manage users
   * @param {boolean} data.can_manage_clinics - Can manage clinics
   * @param {boolean} data.can_manage_content - Can manage content
   * @param {boolean} data.can_view_analytics - Can view analytics
   * @param {boolean} data.can_manage_system - Can manage system
   * @param {string} data.work_phone - Work phone
   * @param {string} data.extension - Extension
   * @returns {Promise<Object>} Created system admin profile
   */
  createSystemAdmin: async (data) => {
    const response = await apiClient.post("/api/v1/admin/system-admins", data);
    return response.data;
  },

  /**
   * Get system admin by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} System admin profile
   */
  getSystemAdminByUserId: async (userId) => {
    const response = await apiClient.get(
      `/api/v1/admin/system-admins/user/${userId}`
    );
    return response.data;
  },

  /**
   * Get system admin by ID
   * @param {string} adminId - System admin ID
   * @returns {Promise<Object>} System admin profile
   */
  getSystemAdmin: async (adminId) => {
    const response = await apiClient.get(`/api/v1/admin/system-admins/${adminId}`);
    return response.data;
  },

  /**
   * Update system admin profile
   * @param {string} adminId - System admin ID
   * @param {Object} data - Updated system admin data
   * @returns {Promise<Object>} Updated system admin profile
   */
  updateSystemAdmin: async (adminId, data) => {
    const response = await apiClient.put(
      `/api/v1/admin/system-admins/${adminId}`,
      data
    );
    return response.data;
  },

  /**
   * Delete system admin profile
   * @param {string} adminId - System admin ID
   * @returns {Promise<Object>} Success message
   */
  deleteSystemAdmin: async (adminId) => {
    const response = await apiClient.delete(
      `/api/v1/admin/system-admins/${adminId}`
    );
    return response.data;
  },

  /**
   * Delete system admin profile by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Success message
   */
  deleteSystemAdminByUserId: async (userId) => {
    const response = await apiClient.delete(
      `/api/v1/admin/system-admins/user/${userId}`
    );
    return response.data;
  },

  /**
   * Search system admins with filters
   * @param {Object} params - Search parameters
   * @param {string} params.admin_level - Admin level filter
   * @param {string} params.region - Region filter
   * @param {string} params.department - Department filter
   * @param {string} params.query - Search query
   * @param {number} params.limit - Results limit
   * @param {number} params.offset - Results offset
   * @returns {Promise<Object>} Search results
   */
  searchSystemAdmins: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.admin_level?.trim()) {
      queryParams.append("admin_level", params.admin_level);
    }

    if (params.region?.trim()) {
      queryParams.append("region", params.region);
    }

    if (params.department?.trim()) {
      queryParams.append("department", params.department);
    }

    if (params.query?.trim()) {
      queryParams.append("query", params.query);
    }

    if (typeof params.limit === "number" && Number.isFinite(params.limit)) {
      queryParams.append("limit", String(params.limit));
    }

    if (typeof params.offset === "number" && Number.isFinite(params.offset)) {
      queryParams.append("offset", String(params.offset));
    }

    const query = queryParams.toString();
    const response = await apiClient.get(
      `/api/v1/admin/system-admins/search${query ? `?${query}` : ""}`
    );
    return response.data;
  },

  /**
   * Get system admin profile for current user
   * @returns {Promise<Object>} System admin profile
   */
  getCurrentSystemAdminProfile: async () => {
    return adminService.getSystemAdminByUserId(getCurrentUserId());
  },

  /**
   * Create or update system admin profile for current user
   * @param {Object} data - System admin data
   * @returns {Promise<Object>} Created/updated system admin profile
   */
  upsertSystemAdminProfile: async (data) => {
    return adminService.createSystemAdmin(data);
  },

  /**
   * Get permissions for current admin
   * @returns {Promise<Object>} Admin permissions
   */
  getAdminPermissions: async () => {
    const admin = await adminService.getCurrentSystemAdminProfile();
    return adminService.normalizePermissionPayload(admin);
  },

  normalizePermissionPayload: (payload) => {
    const source = payload ?? {};
    const directPermissions =
      source.permissions && typeof source.permissions === "object"
        ? source.permissions
        : {};

    const getBool = (obj, snakeKey, camelKey) => {
      const raw =
        obj?.[snakeKey] ?? obj?.[camelKey] ?? directPermissions?.[snakeKey];
      if (typeof raw === "boolean") return raw;
      return raw === 1 || raw === "1" || raw === "true";
    };

    return {
      adminLevel:
        source.adminLevel ??
        source.admin_level ??
        null,
      assignedRegions:
        source.assignedRegions ??
        source.assigned_regions ??
        [],
      canManageUsers:
        getBool(source, "can_manage_users", "canManageUsers") ||
        getBool(directPermissions, "can_manage_users", "canManageUsers"),
      canManageClinics:
        getBool(source, "can_manage_clinics", "canManageClinics") ||
        getBool(directPermissions, "can_manage_clinics", "canManageClinics"),
      canManageContent:
        getBool(source, "can_manage_content", "canManageContent") ||
        getBool(directPermissions, "can_manage_content", "canManageContent"),
      canViewAnalytics:
        getBool(source, "can_view_analytics", "canViewAnalytics") ||
        getBool(directPermissions, "can_view_analytics", "canViewAnalytics"),
      canManageSystem:
        getBool(source, "can_manage_system", "canManageSystem") ||
        getBool(directPermissions, "can_manage_system", "canManageSystem"),
    };
  },

  /**
   * Check if current admin has specific permission
   * @param {string} permission - Permission to check
   * @returns {Promise<boolean>} Whether admin has permission
   */
  hasPermission: async (permission) => {
    const permissions = await adminService.getAdminPermissions();
    const permissionsMap = adminService.normalizePermissionPayload(permissions);

    // Map permission strings to properties
    const permissionMap = {
      manage_users: permissionsMap.canManageUsers,
      manage_clinics: permissionsMap.canManageClinics,
      manage_content: permissionsMap.canManageContent,
      view_analytics: permissionsMap.canViewAnalytics,
      manage_system: permissionsMap.canManageSystem,
    };

    return permissionMap[permission] || false;
  },

  /**
   * Validate system admin data
   * @param {Object} data - System admin data
   * @returns {Object} Validation result with isValid and errors
   */
  validateSystemAdmin: (data) => {
    const errors = {};

    // Required fields
    if (!data.user_id) {
      errors.user_id = "User ID is required";
    }

    if (!data.admin_level?.trim()) {
      errors.admin_level = "Admin level is required";
    } else {
      const validLevels = [
        "super_admin",
        "regional",
        "departmental",
        "support",
      ];
      if (!validLevels.includes(data.admin_level)) {
        errors.admin_level =
          "Admin level must be one of: super_admin, regional, departmental, support";
      }
    }

    // Validate assigned_regions if provided
    if (data.assigned_regions && !Array.isArray(data.assigned_regions)) {
      errors.assigned_regions = "Assigned regions must be an array";
    }

    // Validate permissions if provided
    if (data.permissions && typeof data.permissions !== "object") {
      errors.permissions = "Permissions must be an object";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },

  /**
   * Get admin level display name
   * @param {string} adminLevel - Admin level code
   * @returns {string} Display name
   */
  getAdminLevelDisplayName: (adminLevel) => {
    const levelMap = {
      super_admin: "Super Administrator",
      regional: "Regional Administrator",
      departmental: "Departmental Administrator",
      support: "Support Administrator",
    };
    return levelMap[adminLevel] || adminLevel;
  },

  /**
   * Get all admin levels with display names
   * @returns {Array<{value: string, label: string}>} Admin levels
   */
  getAllAdminLevels: () => {
    return [
      { value: "super_admin", label: "Super Administrator" },
      { value: "regional", label: "Regional Administrator" },
      { value: "departmental", label: "Departmental Administrator" },
      { value: "support", label: "Support Administrator" },
    ];
  },
};

export default adminService;
