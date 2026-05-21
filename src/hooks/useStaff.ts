import { getErrorMessage } from '@/utils/errorUtils'
import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { staffService } from '@/api/services/staffService'
import { queryKeys } from '@/platform/query/queryKeys'

export const useStaff = () => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeStaffKey, setActiveStaffKey] = useState<string[] | null>(null)
  const [activeStaffListKey, setActiveStaffListKey] = useState<string[] | null>(null)
  const [activeInvitationKey, setActiveInvitationKey] = useState<string[] | null>(null)
  const [activeInvitationsKey, setActiveInvitationsKey] = useState<string[] | null>(null)

  const staffQuery = useQuery({
    queryKey: activeStaffKey || ['staff', 'detail'],
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const staffListQuery = useQuery({
    queryKey: activeStaffListKey || queryKeys.staff.list,
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const invitationQuery = useQuery({
    queryKey: activeInvitationKey || ['staff', 'invitation'],
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const invitationsQuery = useQuery({
    queryKey: activeInvitationsKey || ['staff', 'invitations'],
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const staff: Record<string, unknown> | null = staffQuery.data as Record<string, unknown> | null || null
  const staffList: Record<string, unknown>[] = (staffListQuery.data as { staff?: Record<string, unknown>[] } | null)?.staff || []
  const staffTotal: number = (staffListQuery.data as { total?: number } | null)?.total || 0
  const invitation: Record<string, unknown> | null = invitationQuery.data as Record<string, unknown> | null || null
  const invitationsData = invitationsQuery.data as { staff?: Record<string, unknown>[]; invitations?: Record<string, unknown>[] } | null
  const invitations: Record<string, unknown>[] =
    invitationsData?.staff || invitationsData?.invitations || []
  const invitationsTotal: number = (invitationsQuery.data as { total?: number } | null)?.total || 0

  const createStaffMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => staffService.createStaff(data),
    onSuccess: (data) => {
      queryClient.setQueryData(['staff', 'detail', (data as any).id], data)
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list })
    },
  })

  const updateStaffMutation = useMutation({
    mutationFn: ({ staffId, data }: { staffId: string; data: Record<string, unknown> }) => staffService.updateStaff(staffId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ['staff', 'detail', variables.staffId],
        data
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list })
    },
  })

  const deleteStaffMutation = useMutation({
    mutationFn: (staffId: string) => staffService.deleteStaff(staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list })
    },
  })

  const inviteStaffMutation = useMutation({
    mutationFn: ({ clinicId, data }: { clinicId: string; data: Record<string, unknown> }) => staffService.inviteStaff(clinicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'invitations'] })
    },
  })

  const acceptInvitationMutation = useMutation({
    mutationFn: (token: string) => staffService.acceptInvitation(token),
    onSuccess: (data) => {
      if ((data as any).staff) {
        queryClient.setQueryData(
          ['staff', 'detail', (data as any).staff.id],
          (data as any).staff
        )
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.staff.list })
      queryClient.invalidateQueries({ queryKey: ['staff', 'invitations'] })
    },
  })

  const declineInvitationMutation = useMutation({
    mutationFn: (token: string) => staffService.declineInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', 'invitations'] })
    },
  })

  const cancelInvitationMutation = useMutation({
    mutationFn: ({ clinicId, token }: { clinicId: string; token: string }) =>
      staffService.cancelInvitation(clinicId, token),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['staff', 'invitations'],
        type: 'all' as const,
      })
    },
  })

  const resendInvitationMutation = useMutation({
    mutationFn: ({ clinicId, invitationId }: { clinicId: string; invitationId: string }) =>
      staffService.resendInvitation(clinicId, invitationId),
  })

  const createStaff = useCallback(
    async (data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await createStaffMutation.mutateAsync(data)
        setActiveStaffKey(['staff', 'detail', (response as any).id as string])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error || (err as { message?: string }).message || 'Failed to create staff'
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [createStaffMutation]
  )

  const getStaff = useCallback(
    async (staffId: string) => {
      const key = ['staff', 'detail', staffId]
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getStaff(staffId),
        })
        setActiveStaffKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load staff')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const getStaffByUserId = useCallback(
    async (userId: string) => {
      const key = ['staff', 'by-user', userId]
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getStaffByUserId(userId),
        })
        setActiveStaffKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load staff by user ID')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const updateStaff = useCallback(
    async (staffId: string, data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await updateStaffMutation.mutateAsync({
          staffId,
          data,
        })
        setActiveStaffKey(['staff', 'detail', staffId])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to update staff')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [updateStaffMutation]
  )

  const deleteStaff = useCallback(
    async (staffId: string) => {
      setLoading(true)
      setError(null)
      try {
        await deleteStaffMutation.mutateAsync(staffId)
        setActiveStaffKey(null)
        setLoading(false)
        return { success: true }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to delete staff')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [deleteStaffMutation]
  )

  const checkStaffExists = useCallback(
    async (staffId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['staff', 'exists', staffId],
          queryFn: () => staffService.checkStaffExists(staffId),
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to check staff existence')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const listClinicStaff = useCallback(
    async (clinicId: string) => {
      const key = [...queryKeys.staff.list, clinicId, 'clinic']
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.listClinicStaff(clinicId),
        })
        setActiveStaffListKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to list clinic staff')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const listAllClinicStaff = useCallback(
    async (clinicId: string) => {
      const key = [...queryKeys.staff.list, clinicId, 'all']
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.listAllClinicStaff(clinicId),
        })
        setActiveStaffListKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to list all clinic staff')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const listActiveClinicStaff = useCallback(
    async (clinicId: string) => {
      const key = [...queryKeys.staff.list, clinicId, 'active']
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.listActiveClinicStaff(clinicId),
        })
        setActiveStaffListKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to list active clinic staff')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const inviteStaff = useCallback(
    async (clinicId: string, data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await inviteStaffMutation.mutateAsync({
          clinicId,
          data,
        })
        setActiveInvitationKey(['staff', 'invitation', (response as any).invitation_token as string])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error || (err as { message?: string }).message || 'Failed to send invitation'
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [inviteStaffMutation]
  )

  const getInvitationDetails = useCallback(
    async (token: string) => {
      const key = ['staff', 'invitation', token]
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getInvitationDetails(token),
        })
        setActiveInvitationKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to get invitation details')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const acceptInvitation = useCallback(
    async (token: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await acceptInvitationMutation.mutateAsync(token)
        setActiveInvitationKey(null)
        if ((response as any).staff) {
          setActiveStaffKey(['staff', 'detail', (response as any).staff.id as string])
        }
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to accept invitation')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [acceptInvitationMutation]
  )

  const declineInvitation = useCallback(
    async (token: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await declineInvitationMutation.mutateAsync(token)
        setActiveInvitationKey(null)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to decline invitation')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [declineInvitationMutation]
  )

  const getPendingInvitations = useCallback(
    async (clinicId: string) => {
      const key = ['staff', 'invitations', clinicId, 'pending']
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getPendingInvitations(clinicId),
        })
        setActiveInvitationsKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to get pending invitations')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const getMyInvitations = useCallback(
    async () => {
      const key = ['staff', 'invitations', 'me']
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => staffService.getMyInvitations(),
        })
        setActiveInvitationsKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to get your invitations')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const cancelInvitation = useCallback(
    async (clinicId: string, token: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await cancelInvitationMutation.mutateAsync({
          clinicId,
          token,
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to cancel invitation')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [cancelInvitationMutation]
  )

  const resendInvitation = useCallback(
    async (clinicId: string, invitationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await resendInvitationMutation.mutateAsync({
          clinicId,
          invitationId,
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to resend invitation')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [resendInvitationMutation]
  )

  const clearErrorFn = useCallback(() => {
    setError(null)
  }, [])

  const clearStaffState = useCallback(() => {
    setActiveStaffKey(null)
    setActiveStaffListKey(null)
    setActiveInvitationKey(null)
    setActiveInvitationsKey(null)
    setError(null)
  }, [])

  return {
    createStaff,
    getStaff,
    getStaffByUserId,
    updateStaff,
    deleteStaff,
    checkStaffExists,

    listClinicStaff,
    listAllClinicStaff,
    listActiveClinicStaff,

    inviteStaff,
    getInvitationDetails,
    acceptInvitation,
    declineInvitation,
    getPendingInvitations,
    getMyInvitations,
    cancelInvitation,
    resendInvitation,

    clearError: clearErrorFn,
    clearStaffState,

    loading,
    error,
    staff,
    staffList,
    staffTotal,
    invitation,
    invitations,
    invitationsTotal,

    hasStaff: !!staff,
    hasStaffList: staffList.length > 0,
    hasInvitation: !!invitation,
    hasInvitations: invitations.length > 0,
  }
}
