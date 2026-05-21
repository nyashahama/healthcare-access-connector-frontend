import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { adminService } from '@/api/services/adminService'
import { queryKeys } from '@/platform/query/queryKeys'
import type { ApiResponse } from '@/types/api'

interface AdminPermissions {
  canManageUsers: boolean
  canManageClinics: boolean
  canManageContent: boolean
  canViewAnalytics: boolean
  canManageSystem: boolean
  adminLevel: string | null
  assignedRegions: string[]
}

const emptyPermissions: AdminPermissions = {
  canManageUsers: false,
  canManageClinics: false,
  canManageContent: false,
  canViewAnalytics: false,
  canManageSystem: false,
  adminLevel: null,
  assignedRegions: [],
}

const getErrorMessage = (err: unknown, fallback: string): string =>
  (err as any)?.response?.data?.error || (err as any)?.message || fallback

export const useAdmin = () => {
  const queryClient = useQueryClient()
  const [loadingCount, setLoadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [admin, setAdmin] = useState<Record<string, unknown> | null>(null)
  const [permissions, setPermissions] = useState<AdminPermissions>(emptyPermissions)

  const startLoading = useCallback(() => setLoadingCount((count) => count + 1), [])
  const stopLoading = useCallback(
    () => setLoadingCount((count) => Math.max(0, count - 1)),
    []
  )

  const setAdminState = useCallback(
    (profile: Record<string, unknown> | null) => {
      setAdmin(profile || null)
      const normalized = adminService.normalizePermissionPayload(profile as any)
      setPermissions(normalized)
      if (profile) {
        queryClient.setQueryData(
          [...queryKeys.admin.profile, 'user', profile.user_id],
          profile
        )
        queryClient.setQueryData(queryKeys.admin.current, profile)
        queryClient.setQueryData(queryKeys.admin.permissions, normalized)
      }
    },
    [queryClient]
  )

  const run = useCallback(
    async (fn: () => Promise<any>, fallback: string) => {
      startLoading()
      setError(null)
      try {
        const data = await fn()
        stopLoading()
        return { success: true, data }
      } catch (err: unknown) {
        const message = getErrorMessage(err, fallback)
        setError(message)
        stopLoading()
        return { success: false, error: message }
      }
    },
    [startLoading, stopLoading]
  )

  const createSystemAdmin = useCallback(
    async (data: Record<string, unknown>) =>
      run(async () => {
        const validation = adminService.validateSystemAdmin(data as any)
        if (!validation.isValid) {
          throw new Error(
            `Validation failed: ${JSON.stringify(validation.errors)}`
          )
        }

        const { data: response } = await adminService.createSystemAdmin(data as any)
        setAdminState(response as any as Record<string, unknown>)
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.users })
        return response
      }, 'Failed to create system admin'),
    [queryClient, run, setAdminState]
  )

  const getSystemAdminByUserId = useCallback(
    async (userId: string) =>
      run(async () => {
        const response = await queryClient.fetchQuery({
          queryKey: [...queryKeys.admin.profile, 'user', userId],
          queryFn: () => adminService.getSystemAdminByUserId(userId),
        })
        setAdminState(response as any as Record<string, unknown>)
        return response
      }, 'Failed to load system admin'),
    [queryClient, run, setAdminState]
  )

  const getCurrentSystemAdminProfile = useCallback(
    async () =>
      run(async () => {
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.admin.current,
          queryFn: adminService.getCurrentSystemAdminProfile,
        })
        setAdminState(response as any as Record<string, unknown>)
        return response
      }, 'Failed to load system admin profile'),
    [queryClient, run, setAdminState]
  )

  const getPermissions = useCallback(
    async () =>
      run(async () => {
        const response = await adminService.getAdminPermissions()
        setPermissions(response as any as AdminPermissions)
        queryClient.setQueryData(queryKeys.admin.permissions, response)
        return response
      }, 'Failed to load permissions'),
    [queryClient, run]
  )

  const hasPermission = useCallback(
    async (permission: string) => {
      const source =
        admin || (await adminService.getCurrentSystemAdminProfile().catch(() => null))
      const normalized = adminService.normalizePermissionPayload(source as any)
      const permissionMap: Record<string, boolean> = {
        manage_users: normalized.canManageUsers,
        manage_clinics: normalized.canManageClinics,
        manage_content: normalized.canManageContent,
        view_analytics: normalized.canViewAnalytics,
        manage_system: normalized.canManageSystem,
      }
      return Boolean(permissionMap[permission])
    },
    [admin]
  )

  const getSystemAdmin = useCallback(
    async (adminId: string) =>
      run(async () => {
        const response = await queryClient.fetchQuery({
          queryKey: [...queryKeys.admin.profile, 'id', adminId],
          queryFn: () => adminService.getSystemAdmin(adminId),
        })
        setAdminState(response as any as Record<string, unknown>)
        return response
      }, 'Failed to load system admin'),
      [queryClient, run, setAdminState]
  )

  const clearAdmin = useCallback(() => {
    setAdmin(null)
    setPermissions(emptyPermissions)
    setError(null)
    queryClient.removeQueries({ queryKey: queryKeys.admin.current })
    queryClient.removeQueries({ queryKey: queryKeys.admin.permissions })
  }, [queryClient])

  const updateSystemAdmin = useCallback(
    async (adminId: string, data: Record<string, unknown>) =>
      run(async () => {
        const response = await adminService.updateSystemAdmin(adminId, data as any)
        setAdminState(response as any as Record<string, unknown>)
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.current })
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.users })
        queryClient.removeQueries({
          queryKey: [...queryKeys.admin.profile, 'id', adminId],
        })
        return response
      }, 'Failed to update system admin'),
      [queryClient, run, setAdminState]
  )

  const deleteSystemAdmin = useCallback(
    async (adminId: string) =>
      run(async () => {
        const response = await adminService.deleteSystemAdmin(adminId)

        queryClient.removeQueries({
          queryKey: queryKeys.admin.current,
        })
        queryClient.removeQueries({
          queryKey: [...queryKeys.admin.profile, 'id', adminId],
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.users })
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.permissions,
        })

        if (admin?.id === adminId) {
          clearAdmin()
        }

        return response
      }, 'Failed to delete system admin'),
    [admin, clearAdmin, queryClient, run]
  )

  const deleteSystemAdminByUserId = useCallback(
    async (userId: string) =>
      run(async () => {
        const response = await adminService.deleteSystemAdminByUserId(userId)
        queryClient.removeQueries({
          queryKey: [...queryKeys.admin.profile, 'user', userId],
        })
        queryClient.removeQueries({
          queryKey: queryKeys.admin.current,
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.users })
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.permissions,
        })

        if (admin?.user_id === userId) {
          clearAdmin()
        }

        return response
      }, 'Failed to delete system admin'),
    [admin, clearAdmin, queryClient, run]
  )

  const searchSystemAdmins = useCallback(
    async (params: Record<string, unknown> = {}) =>
      run(async () => {
        const response = await adminService.searchSystemAdmins(params as any)
        queryClient.setQueryData(queryKeys.admin.search(params), response)
        return response
      }, 'Failed to search system admins'),
    [queryClient, run]
  )

  const validateAdminData = useCallback(
    (data: Record<string, unknown>) => adminService.validateSystemAdmin(data as any),
    []
  )

  const getAdminLevelDisplayName = useCallback(
    (adminLevel: string) => adminService.getAdminLevelDisplayName(adminLevel),
    []
  )

  const getAllAdminLevels = useCallback(
    () => adminService.getAllAdminLevels(),
    []
  )

  const clearErrorFn = useCallback(() => setError(null), [])

  return {
    createSystemAdmin,
    getSystemAdmin,
    getSystemAdminByUserId,
    getCurrentSystemAdminProfile,
    updateSystemAdmin,
    deleteSystemAdmin,
    deleteSystemAdminByUserId,
    searchSystemAdmins,
    upsertSystemAdminProfile: createSystemAdmin,
    getPermissions,
    hasPermission,
    validateAdminData,
    getAdminLevelDisplayName,
    getAllAdminLevels,
    clearAdmin,
    clearError: clearErrorFn,
    loading: loadingCount > 0,
    error,
    admin,
    permissions,
    isAdmin: Boolean(admin),
    isSuperAdmin: permissions.adminLevel === 'super_admin',
    canManageUsers: permissions.canManageUsers,
    canManageClinics: permissions.canManageClinics,
    canManageContent: permissions.canManageContent,
    canViewAnalytics: permissions.canViewAnalytics,
    canManageSystem: permissions.canManageSystem,
  }
}
