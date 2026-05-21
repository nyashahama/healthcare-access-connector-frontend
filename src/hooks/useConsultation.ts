import { getErrorMessage } from '@/utils/errorUtils'
import { consultationService } from '@/api/services/consultationService'
import { useCallback, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/platform/query/queryKeys'

export const useConsultation = () => {
  const queryClient = useQueryClient()

  const [loadingCount, setLoadingCount] = useState(0)
  const startLoading = useCallback(() => setLoadingCount((c) => c + 1), [])
  const stopLoading = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), [])
  const loading = loadingCount > 0

  const [error, setError] = useState<string | null>(null)

  const [consultations, setConsultations] = useState<Record<string, unknown>[]>([])
  const [currentConsultation, setCurrentConsultation] = useState<Record<string, unknown> | null>(null)
  const [activeConsultation, setActiveConsultation] = useState<Record<string, unknown> | null>(null)
  const [waitingRoom, setWaitingRoom] = useState<Record<string, unknown>[]>([])
  const [providerActiveConsultations, setProviderActiveConsultations] = useState<Record<string, unknown>[]>([])
  const [providerHistory, setProviderHistory] = useState<Record<string, unknown>[]>([])
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  })

  const [activeDetailId, setActiveDetailId] = useState<string | null>(null)
  const [activePatientListParams, setActivePatientListParams] = useState<Record<string, unknown>>({})
  const [activeProviderHistoryParams, setActiveProviderHistoryParams] = useState<Record<string, unknown>>({})

  useQuery({
    queryKey: queryKeys.consultation.active,
    queryFn: async () => {
      try {
        return await consultationService.getPatientActiveConsultation()
      } catch (err: unknown) {
        if ((err as any)?.response?.status === 404) return null
        throw err
      }
    },
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.consultation.list, activePatientListParams],
    queryFn: () => consultationService.getPatientConsultations(activePatientListParams),
    enabled: false,
  })

  useQuery({
    queryKey: queryKeys.consultation.detail(activeDetailId ?? ''),
    queryFn: () => consultationService.getConsultationByID(activeDetailId!),
    enabled: false,
  })

  useQuery({
    queryKey: ['consultations', 'provider', 'active'],
    queryFn: () => consultationService.getProviderActiveConsultations(),
    enabled: false,
  })

  useQuery({
    queryKey: ['consultations', 'provider', 'history', activeProviderHistoryParams],
    queryFn: () => consultationService.getProviderConsultationHistory(activeProviderHistoryParams),
    enabled: false,
  })

  useQuery({
    queryKey: ['consultations', 'waitingRoom'],
    queryFn: () => consultationService.getWaitingRoom(),
    enabled: false,
  })

  const requestConsultationMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => {
      const { patient_id: _, ...cleanPayload } = data
      return consultationService.requestConsultation(cleanPayload)
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.active })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(data.id) })
      }
    },
  })

  const cancelConsultationMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.cancelConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.active })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
    },
  })

  const submitPatientRatingMutation = useMutation({
    mutationFn: ({ consultationId, data }: any) =>
      consultationService.submitPatientRating(consultationId, data),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(variables.consultationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list })
    },
  })

  const updateConsultationChannelMutation = useMutation({
    mutationFn: ({ consultationId, data }: any) =>
      consultationService.updateConsultationChannel(consultationId, data),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(variables.consultationId) })
    },
  })

  const acceptConsultationMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.acceptConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', 'waitingRoom'] })
      queryClient.invalidateQueries({ queryKey: ['consultations', 'provider', 'active'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
    },
  })

  const startConsultationMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.startConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', 'provider', 'active'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
    },
  })

  const completeConsultationMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.completeConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', 'provider', 'active'] })
      queryClient.invalidateQueries({ queryKey: ['consultations', 'provider', 'history'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.list })
    },
  })

  const escalateConsultationMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.escalateConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', 'provider', 'active'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
    },
  })

  const declineConsultationMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.declineConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', 'waitingRoom'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
    },
  })

  const markNoShowMutation = useMutation({
    mutationFn: (consultationId: string) => consultationService.markNoShow(consultationId),
    onSuccess: (_data, consultationId) => {
      queryClient.invalidateQueries({ queryKey: ['consultations', 'provider', 'active'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(consultationId) })
    },
  })

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ consultationId, data }: any) =>
      consultationService.updatePaymentStatus(consultationId, data),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(variables.consultationId) })
    },
  })

  const linkFollowUpAppointmentMutation = useMutation({
    mutationFn: ({ consultationId, data }: any) =>
      consultationService.linkFollowUpAppointment(consultationId, data),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.consultation.detail(variables.consultationId) })
    },
  })

  const requestConsultation = async (data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await requestConsultationMutation.mutateAsync(data)
      setCurrentConsultation(response as any as Record<string, unknown>)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to request consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const fetchPatientActiveConsultation = useCallback(async () => {
    startLoading()
    setError(null)
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.consultation.active,
        queryFn: async () => {
          try {
            return await consultationService.getPatientActiveConsultation()
          } catch (err: unknown) {
            if ((err as any)?.response?.status === 404) return null
            throw err
          }
        },
      })
      setActiveConsultation(response as any as Record<string, unknown>)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch active consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }, [queryClient, startLoading, stopLoading])

  const fetchPatientConsultations = async (params: Record<string, unknown> = {}) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.consultation.list, params],
        queryFn: () => consultationService.getPatientConsultations(params),
      })
      setConsultations(response.consultations || [])
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      })
      setActivePatientListParams(params)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to load patient consultations')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const cancelConsultation = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await cancelConsultationMutation.mutateAsync(consultationId)
      if (currentConsultation?.id === consultationId) {
        setCurrentConsultation(response as any as Record<string, unknown>)
      }
      if (activeConsultation?.id === consultationId) {
        setActiveConsultation(null)
      }
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to cancel consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const submitPatientRating = async (consultationId: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await submitPatientRatingMutation.mutateAsync({ consultationId, data } as any)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to submit rating')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const fetchConsultationByID = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.consultation.detail(consultationId),
        queryFn: () => consultationService.getConsultationByID(consultationId),
      })
      setCurrentConsultation(response as any as Record<string, unknown>)
      setActiveDetailId(consultationId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const fetchConsultationWithDetails = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.consultation.detail(consultationId),
        queryFn: () => consultationService.getConsultationWithDetails(consultationId),
      })
      setCurrentConsultation(response as any as Record<string, unknown>)
      setActiveDetailId(consultationId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch consultation details')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const updateConsultationChannel = async (consultationId: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await updateConsultationChannelMutation.mutateAsync({ consultationId, data } as any)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update channel')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const acceptConsultation = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await acceptConsultationMutation.mutateAsync(consultationId)
      setWaitingRoom((prev) => prev.filter((c) => c.id !== consultationId))
      setProviderActiveConsultations((prev) => [...prev, response as any as Record<string, unknown>])
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to accept consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const startConsultation = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await startConsultationMutation.mutateAsync(consultationId)
      setProviderActiveConsultations((prev) =>
        prev.map((c) => (c.id === consultationId ? response as any as Record<string, unknown> : c))
      )
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to start consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const completeConsultation = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await completeConsultationMutation.mutateAsync(consultationId)
      setProviderActiveConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      )
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to complete consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const escalateConsultation = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await escalateConsultationMutation.mutateAsync(consultationId)
      setProviderActiveConsultations((prev) =>
        prev.map((c) => (c.id === consultationId ? response as any as Record<string, unknown> : c))
      )
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to escalate consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const declineConsultation = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await declineConsultationMutation.mutateAsync(consultationId)
      setWaitingRoom((prev) => prev.filter((c) => c.id !== consultationId))
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to decline consultation')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const markNoShow = async (consultationId: string) => {
    startLoading()
    setError(null)
    try {
      const response = await markNoShowMutation.mutateAsync(consultationId)
      setProviderActiveConsultations((prev) =>
        prev.filter((c) => c.id !== consultationId)
      )
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to mark no-show')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const fetchProviderActiveConsultations = async () => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: ['consultations', 'provider', 'active'],
        queryFn: () => consultationService.getProviderActiveConsultations(),
      })
      setProviderActiveConsultations(response.consultations || [])
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg =
        (err as any)?.response?.data?.error ||
        'Failed to fetch provider active consultations'
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const fetchProviderConsultationHistory = async (params: Record<string, unknown> = {}) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: ['consultations', 'provider', 'history', params],
        queryFn: () => consultationService.getProviderConsultationHistory(params),
      })
      setProviderHistory(response.consultations || [])
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      })
      setActiveProviderHistoryParams(params)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch provider history')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const fetchWaitingRoom = async () => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: ['consultations', 'waitingRoom'],
        queryFn: () => consultationService.getWaitingRoom(),
      })
      setWaitingRoom(response.entries || [])
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch waiting room')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const updatePaymentStatus = async (consultationId: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await updatePaymentStatusMutation.mutateAsync({ consultationId, data } as any)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update payment status')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const linkFollowUpAppointment = async (consultationId: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await linkFollowUpAppointmentMutation.mutateAsync({ consultationId, data } as any)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to link follow-up')
      setError(msg)
      stopLoading()
      return { success: false, error: msg }
    }
  }

  const clearConsultations = useCallback(() => {
    setConsultations([])
    setCurrentConsultation(null)
    setActiveConsultation(null)
    setWaitingRoom([])
    setProviderActiveConsultations([])
    setProviderHistory([])
    setError(null)
    setActiveDetailId(null)
    setActivePatientListParams({})
    setActiveProviderHistoryParams({})
    requestConsultationMutation.reset()
    cancelConsultationMutation.reset()
    submitPatientRatingMutation.reset()
    updateConsultationChannelMutation.reset()
    acceptConsultationMutation.reset()
    startConsultationMutation.reset()
    completeConsultationMutation.reset()
    escalateConsultationMutation.reset()
    declineConsultationMutation.reset()
    markNoShowMutation.reset()
    updatePaymentStatusMutation.reset()
    linkFollowUpAppointmentMutation.reset()
  }, [
    requestConsultationMutation,
    cancelConsultationMutation,
    submitPatientRatingMutation,
    updateConsultationChannelMutation,
    acceptConsultationMutation,
    startConsultationMutation,
    completeConsultationMutation,
    escalateConsultationMutation,
    declineConsultationMutation,
    markNoShowMutation,
    updatePaymentStatusMutation,
    linkFollowUpAppointmentMutation,
  ])

  const clearErrorFn = useCallback(() => {
    setError(null)
    requestConsultationMutation.reset()
    cancelConsultationMutation.reset()
    submitPatientRatingMutation.reset()
    updateConsultationChannelMutation.reset()
    acceptConsultationMutation.reset()
    startConsultationMutation.reset()
    completeConsultationMutation.reset()
    escalateConsultationMutation.reset()
    declineConsultationMutation.reset()
    markNoShowMutation.reset()
    updatePaymentStatusMutation.reset()
    linkFollowUpAppointmentMutation.reset()
  }, [
    requestConsultationMutation,
    cancelConsultationMutation,
    submitPatientRatingMutation,
    updateConsultationChannelMutation,
    acceptConsultationMutation,
    startConsultationMutation,
    completeConsultationMutation,
    escalateConsultationMutation,
    declineConsultationMutation,
    markNoShowMutation,
    updatePaymentStatusMutation,
    linkFollowUpAppointmentMutation,
  ])

  useEffect(() => {
    return () => {
      setError(null)
    }
  }, [])

  return {
    requestConsultation,
    fetchPatientActiveConsultation,
    fetchPatientConsultations,
    cancelConsultation,
    submitPatientRating,
    fetchConsultationByID,
    fetchConsultationWithDetails,
    updateConsultationChannel,
    acceptConsultation,
    startConsultation,
    completeConsultation,
    escalateConsultation,
    declineConsultation,
    markNoShow,
    fetchProviderActiveConsultations,
    fetchProviderConsultationHistory,
    fetchWaitingRoom,
    updatePaymentStatus,
    linkFollowUpAppointment,
    clearConsultations,
    clearError: clearErrorFn,

    loading,
    error,
    consultations,
    currentConsultation,
    activeConsultation,
    waitingRoom,
    providerActiveConsultations,
    providerHistory,
    pagination,

    hasConsultations: consultations.length > 0,
    hasActiveConsultation: !!activeConsultation,
    hasWaitingRoomEntries: waitingRoom.length > 0,
    hasProviderActive: providerActiveConsultations.length > 0,
  }
}
