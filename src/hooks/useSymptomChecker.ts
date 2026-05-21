import { getErrorMessage } from '@/utils/errorUtils'
import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { symptomCheckerService } from '@/api/services/symptomCheckerService'
import { queryKeys } from '@/platform/query/queryKeys'

export const useSymptomChecker = () => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [activeSessionKey, setActiveSessionKey] = useState<string[] | null>(null)
  const [activeSessionsKey, setActiveSessionsKey] = useState<string[] | null>(null)
  const [activeEligibleKey, setActiveEligibleKey] = useState<string[] | null>(null)

  const sessionQuery = useQuery({
    queryKey: activeSessionKey || queryKeys.symptom.data,
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const sessionsQuery = useQuery({
    queryKey: activeSessionsKey || queryKeys.symptom.history,
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const eligibleQuery = useQuery({
    queryKey: activeEligibleKey || ['symptoms', 'eligible'],
    enabled: false,
    queryFn: () => Promise.resolve(null),
  })

  const currentSession: Record<string, unknown> | null = sessionQuery.data as Record<string, unknown> | null || null
  const sessions: Record<string, unknown>[] = (sessionsQuery.data as { sessions?: Record<string, unknown>[] } | null)?.sessions || []
  const eligibleSession: Record<string, unknown> | null = eligibleQuery.data as Record<string, unknown> | null || null

  const submitSessionMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => symptomCheckerService.submitSession(data),
    onSuccess: (data) => {
      queryClient.setQueryData([...queryKeys.symptom.data, (data as any).id], data)
      queryClient.invalidateQueries({ queryKey: queryKeys.symptom.history })
    },
  })

  const abandonSessionMutation = useMutation({
    mutationFn: (sessionId: string) => symptomCheckerService.abandonSession(sessionId),
    onSuccess: (_data, sessionId) => {
      queryClient.setQueryData(
        [...queryKeys.symptom.data, sessionId],
        (old: unknown) => (old ? { ...(old as Record<string, unknown>), status: 'abandoned' } : old)
      )
    },
  })

  const submitSession = useCallback(
    async (data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)

      try {
        if (!(data.chief_complaint as string)?.trim()) {
          throw new Error('Chief complaint is required')
        }
        if (!(data.symptoms_reported as unknown[])?.length) {
          throw new Error('At least one symptom is required')
        }
        if (data.is_for_dependent && !data.dependent_id) {
          throw new Error('Dependent ID is required when session is for a dependent')
        }

        const { patient_id: _, user_id: __, ...cleanPayload } = data

        const response = await submitSessionMutation.mutateAsync(cleanPayload)
        setActiveSessionKey([...queryKeys.symptom.data, (response as any).id as string])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
          (err as { message?: string }).message ||
          'Failed to submit symptom session'
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [submitSessionMutation]
  )

  const fetchSession = useCallback(
    async (sessionId: string) => {
      const key = [...queryKeys.symptom.data, sessionId]
      setLoading(true)
      setError(null)

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => symptomCheckerService.getSessionById(sessionId),
        })
        setActiveSessionKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load session')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const abandonSession = useCallback(
    async (sessionId: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await abandonSessionMutation.mutateAsync(sessionId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to abandon session')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [abandonSessionMutation]
  )

  const fetchPatientSessions = useCallback(
    async (params: Record<string, unknown> = {}) => {
      const key = [...queryKeys.symptom.history, JSON.stringify(params)]
      setLoading(true)
      setError(null)

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => symptomCheckerService.getPatientSessions(params),
        })
        setActiveSessionsKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load sessions')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const fetchEligibleSession = useCallback(
    async () => {
      const key = ['symptoms', 'eligible']
      setLoading(true)
      setError(null)

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () => symptomCheckerService.getLatestEligibleSession(),
        })
        setActiveEligibleKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load eligible session')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const fetchDependentSessions = useCallback(
    async (dependentId: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['symptoms', 'dependent', dependentId],
          queryFn: () =>
            symptomCheckerService.getDependentSessions(dependentId),
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load dependent sessions')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const fetchSessionsByTriageLevel = useCallback(
    async (params: Record<string, unknown>) => {
      const key = [...queryKeys.symptom.history, 'triage', JSON.stringify(params)]
      setLoading(true)
      setError(null)

      try {
        const response = await queryClient.fetchQuery({
          queryKey: key,
          queryFn: () =>
            symptomCheckerService.getSessionsByTriageLevel(params as any),
        })
        setActiveSessionsKey(key)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load sessions by triage')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const fetchOutcomeCounts = useCallback(
    async (params: Record<string, unknown>) => {
      setLoading(true)
      setError(null)

      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['symptoms', 'outcomes', JSON.stringify(params)],
          queryFn: () =>
            symptomCheckerService.countSessionsByOutcome(params as any),
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const errorMessage = getErrorMessage(err, 'Failed to load outcome counts')
        setError(errorMessage)
        setLoading(false)
        return { success: false, error: errorMessage }
      }
    },
    [queryClient]
  )

  const clearSessions = useCallback(() => {
    setActiveSessionKey(null)
    setActiveSessionsKey(null)
    setActiveEligibleKey(null)
    setError(null)
  }, [])

  const clearErrorFn = useCallback(() => {
    setError(null)
  }, [])

  return {
    submitSession,
    fetchSession,
    abandonSession,
    fetchPatientSessions,
    fetchEligibleSession,
    fetchDependentSessions,
    fetchSessionsByTriageLevel,
    fetchOutcomeCounts,
    clearSessions,
    clearError: clearErrorFn,

    loading,
    error,
    sessions,
    currentSession,
    eligibleSession,

    hasSessions: sessions.length > 0,
    hasCurrentSession: !!currentSession,
  }
}
