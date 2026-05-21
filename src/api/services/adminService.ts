import apiClient from '@/api/apiClient'
import { sessionManager } from '@/platform/auth/sessionManager'
import type { ApiResponse } from '@/types/api'

const getCurrentUserId = (): string => {
  const userId = sessionManager.hydrate()?.user?.id
  if (!userId) {
    throw new Error('Current user is not available')
  }
  return userId
}

export interface SystemAdminProfile {
  id: string
  user_id: string
  admin_level: string
  assigned_regions: string[]
  department?: string
  permissions?: AdminPermissions
  can_manage_users?: boolean
  can_manage_clinics?: boolean
  can_manage_content?: boolean
  can_view_analytics?: boolean
  can_manage_system?: boolean
  work_phone?: string
  extension?: string
  created_at: string
  updated_at: string
}

export interface AdminPermissions {
  adminLevel: string | null
  assignedRegions: string[]
  canManageUsers: boolean
  canManageClinics: boolean
  canManageContent: boolean
  canViewAnalytics: boolean
  canManageSystem: boolean
}

export interface AdminSearchParams {
  admin_level?: string
  region?: string
  department?: string
  query?: string
  limit?: number
  offset?: number
}

export interface AdminLevelOption {
  value: string
  label: string
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export const adminService = {
  createSystemAdmin: async (data: Record<string, unknown>): Promise<ApiResponse<SystemAdminProfile>> => {
    const response = await apiClient.post<ApiResponse<SystemAdminProfile>>('/api/v1/admin/system-admins', data)
    return response.data
  },

  getSystemAdminByUserId: async (userId: string): Promise<ApiResponse<SystemAdminProfile>> => {
    const response = await apiClient.get<ApiResponse<SystemAdminProfile>>(`/api/v1/admin/system-admins/user/${userId}`)
    return response.data
  },

  getSystemAdmin: async (adminId: string): Promise<ApiResponse<SystemAdminProfile>> => {
    const response = await apiClient.get<ApiResponse<SystemAdminProfile>>(`/api/v1/admin/system-admins/${adminId}`)
    return response.data
  },

  updateSystemAdmin: async (adminId: string, data: Record<string, unknown>): Promise<ApiResponse<SystemAdminProfile>> => {
    const response = await apiClient.put<ApiResponse<SystemAdminProfile>>(`/api/v1/admin/system-admins/${adminId}`, data)
    return response.data
  },

  deleteSystemAdmin: async (adminId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/admin/system-admins/${adminId}`)
    return response.data
  },

  deleteSystemAdminByUserId: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/admin/system-admins/user/${userId}`)
    return response.data
  },

  searchSystemAdmins: async (params: AdminSearchParams = {}): Promise<ApiResponse<SystemAdminProfile[]>> => {
    const queryParams = new URLSearchParams()

    if (params.admin_level?.trim()) {
      queryParams.append('admin_level', params.admin_level)
    }

    if (params.region?.trim()) {
      queryParams.append('region', params.region)
    }

    if (params.department?.trim()) {
      queryParams.append('department', params.department)
    }

    if (params.query?.trim()) {
      queryParams.append('query', params.query)
    }

    if (typeof params.limit === 'number' && Number.isFinite(params.limit)) {
      queryParams.append('limit', String(params.limit))
    }

    if (typeof params.offset === 'number' && Number.isFinite(params.offset)) {
      queryParams.append('offset', String(params.offset))
    }

    const query = queryParams.toString()
    const response = await apiClient.get<ApiResponse<SystemAdminProfile[]>>(`/api/v1/admin/system-admins/search${query ? `?${query}` : ''}`)
    return response.data
  },

  getCurrentSystemAdminProfile: async (): Promise<ApiResponse<SystemAdminProfile>> => {
    return adminService.getSystemAdminByUserId(getCurrentUserId())
  },

  upsertSystemAdminProfile: async (data: Record<string, unknown>): Promise<ApiResponse<SystemAdminProfile>> => {
    return adminService.createSystemAdmin(data)
  },

  getAdminPermissions: async (): Promise<AdminPermissions> => {
    const admin = await adminService.getCurrentSystemAdminProfile()
    return adminService.normalizePermissionPayload(admin.data as unknown as Record<string, unknown>)
  },

  normalizePermissionPayload: (payload: Record<string, unknown> | null): AdminPermissions => {
    const source = payload ?? {} as Record<string, unknown>
    const directPermissions =
      source.permissions && typeof source.permissions === 'object'
        ? (source.permissions as Record<string, unknown>)
        : {}

    const getBool = (obj: Record<string, unknown>, snakeKey: string, camelKey: string): boolean => {
      const raw = obj?.[snakeKey] ?? obj?.[camelKey] ?? directPermissions?.[snakeKey]
      if (typeof raw === 'boolean') return raw
      return raw === 1 || raw === '1' || raw === 'true'
    }

    return {
      adminLevel: (source.adminLevel ?? source.admin_level ?? null) as string | null,
      assignedRegions: (source.assignedRegions ?? source.assigned_regions ?? []) as string[],
      canManageUsers:
        getBool(source, 'can_manage_users', 'canManageUsers') ||
        getBool(directPermissions, 'can_manage_users', 'canManageUsers'),
      canManageClinics:
        getBool(source, 'can_manage_clinics', 'canManageClinics') ||
        getBool(directPermissions, 'can_manage_clinics', 'canManageClinics'),
      canManageContent:
        getBool(source, 'can_manage_content', 'canManageContent') ||
        getBool(directPermissions, 'can_manage_content', 'canManageContent'),
      canViewAnalytics:
        getBool(source, 'can_view_analytics', 'canViewAnalytics') ||
        getBool(directPermissions, 'can_view_analytics', 'canViewAnalytics'),
      canManageSystem:
        getBool(source, 'can_manage_system', 'canManageSystem') ||
        getBool(directPermissions, 'can_manage_system', 'canManageSystem'),
    }
  },

  hasPermission: async (permission: string): Promise<boolean> => {
    const permissionsMap = await adminService.getAdminPermissions()

    const permissionMap: Record<string, boolean> = {
      manage_users: permissionsMap.canManageUsers,
      manage_clinics: permissionsMap.canManageClinics,
      manage_content: permissionsMap.canManageContent,
      view_analytics: permissionsMap.canViewAnalytics,
      manage_system: permissionsMap.canManageSystem,
    }

    return permissionMap[permission] || false
  },

  validateSystemAdmin: (data: Record<string, unknown>): ValidationResult => {
    const errors: Record<string, string> = {}

    if (!data.user_id) {
      errors.user_id = 'User ID is required'
    }

    if (!(data.admin_level as string)?.trim()) {
      errors.admin_level = 'Admin level is required'
    } else {
      const validLevels = ['super_admin', 'regional', 'departmental', 'support']
      if (!validLevels.includes(data.admin_level as string)) {
        errors.admin_level = 'Admin level must be one of: super_admin, regional, departmental, support'
      }
    }

    if (data.assigned_regions && !Array.isArray(data.assigned_regions)) {
      errors.assigned_regions = 'Assigned regions must be an array'
    }

    if (data.permissions && typeof data.permissions !== 'object') {
      errors.permissions = 'Permissions must be an object'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },

  getAdminLevelDisplayName: (adminLevel: string): string => {
    const levelMap: Record<string, string> = {
      super_admin: 'Super Administrator',
      regional: 'Regional Administrator',
      departmental: 'Departmental Administrator',
      support: 'Support Administrator',
    }
    return levelMap[adminLevel] || adminLevel
  },

  getAllAdminLevels: (): AdminLevelOption[] => {
    return [
      { value: 'super_admin', label: 'Super Administrator' },
      { value: 'regional', label: 'Regional Administrator' },
      { value: 'departmental', label: 'Departmental Administrator' },
      { value: 'support', label: 'Support Administrator' },
    ]
  },
}
