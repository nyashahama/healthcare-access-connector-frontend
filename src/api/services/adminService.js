import apiClient from "api/apiClient";

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
    const response = await apiClient.post("/api/v1/admins/system-admins", data);
    return response.data;
  },

  /**
   * Get system admin by user ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} System admin profile
   */
  getSystemAdminByUserId: async (userId) => {
    const response = await apiClient.get(
      `/api/v1/admins/system-admins/user/${userId}`
    );
    return response.data;
  },

  /**
   * Get system admin by ID
   * @param {string} adminId - System admin ID
   * @returns {Promise<Object>} System admin profile
   */
  getSystemAdmin: async (adminId) => {
    const response = await apiClient.get(
      `/api/v1/admins/system-admins/${adminId}`
    );
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
      `/api/v1/admins/system-admins/${adminId}`,
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
      `/api/v1/admins/system-admins/${adminId}`
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
      `/api/v1/admins/system-admins/user/${userId}`
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
  searchSystemAdmins: async (params) => {
    const queryParams = new URLSearchParams();

    // Add all defined parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, params[key]);
      }
    });

    const response = await apiClient.get(
      `/api/v1/admins/system-admins/search?${queryParams.toString()}`
    );
    return response.data;
  },

  /**
   * Get system admin profile for current user
   * @returns {Promise<Object>} System admin profile
   */
  getCurrentSystemAdminProfile: async () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("No user found in localStorage");
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error("User ID not found");
    }

    if (user.role !== "system_admin") {
      throw new Error("User does not have system_admin role");
    }

    return adminService.getSystemAdminByUserId(user.id);
  },

  /**
   * Create or update system admin profile for current user
   * @param {Object} data - System admin data
   * @returns {Promise<Object>} Created/updated system admin profile
   */
  upsertSystemAdminProfile: async (data) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      throw new Error("No user found in localStorage");
    }

    const user = JSON.parse(userStr);
    if (!user.id) {
      throw new Error("User ID not found");
    }

    if (user.role !== "system_admin") {
      throw new Error("User does not have system_admin role");
    }

    // Try to get existing profile
    try {
      const existing = await adminService.getSystemAdminByUserId(user.id);

      // If exists, update it
      const updated = await adminService.updateSystemAdmin(existing.id, {
        ...data,
        user_id: user.id,
      });
      return updated;
    } catch (error) {
      // If not found, create new
      if (error.response?.status === 404) {
        const created = await adminService.createSystemAdmin({
          ...data,
          user_id: user.id,
        });
        return created;
      }
      throw error;
    }
  },

  /**
   * Get permissions for current admin
   * @returns {Promise<Object>} Admin permissions
   */
  getAdminPermissions: async () => {
    try {
      const adminProfile = await adminService.getCurrentSystemAdminProfile();
      return {
        canManageUsers: adminProfile.can_manage_users || false,
        canManageClinics: adminProfile.can_manage_clinics || false,
        canManageContent: adminProfile.can_manage_content || false,
        canViewAnalytics: adminProfile.can_view_analytics || false,
        canManageSystem: adminProfile.can_manage_system || false,
        permissions: adminProfile.permissions || {},
        adminLevel: adminProfile.admin_level,
        assignedRegions: adminProfile.assigned_regions || [],
      };
    } catch (error) {
      // If admin profile not found or user is not admin, return minimal permissions
      return {
        canManageUsers: false,
        canManageClinics: false,
        canManageContent: false,
        canViewAnalytics: false,
        canManageSystem: false,
        permissions: {},
        adminLevel: null,
        assignedRegions: [],
      };
    }
  },

  /**
   * Check if current admin has specific permission
   * @param {string} permission - Permission to check
   * @returns {Promise<boolean>} Whether admin has permission
   */
  hasPermission: async (permission) => {
    const permissions = await adminService.getAdminPermissions();

    // Map permission strings to properties
    const permissionMap = {
      manage_users: permissions.canManageUsers,
      manage_clinics: permissions.canManageClinics,
      manage_content: permissions.canManageContent,
      view_analytics: permissions.canViewAnalytics,
      manage_system: permissions.canManageSystem,
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
