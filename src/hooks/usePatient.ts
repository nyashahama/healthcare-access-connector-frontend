import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { patientService } from '@/api/services/patientService'
import { queryKeys } from '@/platform/query/queryKeys'

const getErrorMessage = (err: unknown, fallback: string): string =>
  (err as any)?.response?.data?.error || (err as any)?.message || fallback

export const usePatient = () => {
  const queryClient = useQueryClient()
  const [patient, setPatient] = useState<Record<string, unknown> | null>(null)
  const [loadingCount, setLoadingCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const startLoading = useCallback(() => setLoadingCount((count) => count + 1), [])
  const stopLoading = useCallback(
    () => setLoadingCount((count) => Math.max(0, count - 1)),
    []
  )

  const setPatientCache = useCallback(
    (profile: Record<string, unknown> | null) => {
      setPatient(profile || null)
      if (profile) {
        queryClient.setQueryData(queryKeys.patient.current, profile)
        queryClient.setQueryData(queryKeys.patient.profile(profile.id as string), profile)
        queryClient.setQueryData(queryKeys.patient.byUser(profile.user_id as string), profile)
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

  const createPatientProfile = useCallback(
    async (data: Record<string, unknown>) =>
      run(async () => {
        const response = await patientService.createPatientProfile(data as any)
        setPatientCache(response as any)
        return response
      }, 'Failed to create patient profile'),
    [run, setPatientCache]
  )

  const getPatientProfile = useCallback(
    async (patientId: string) =>
      run(async () => {
        const response = await patientService.getPatientProfile(patientId)
        setPatientCache(response as any)
        return response
      }, 'Failed to load patient profile'),
    [run, setPatientCache]
  )

  const getPatientProfileByUserId = useCallback(
    async (userId: string) =>
      run(async () => {
        const response = await patientService.getPatientProfileByUserId(userId)
        setPatientCache(response as any)
        return response
      }, 'Failed to load patient profile'),
    [run, setPatientCache]
  )

  const getCurrentPatientProfile = useCallback(
    async () =>
      run(async () => {
        const response = await patientService.getCurrentPatientProfile()
        setPatientCache(response as any)
        return response
      }, 'Failed to load patient profile'),
    [run, setPatientCache]
  )

  const updatePatientProfile = useCallback(
    async (patientId: string, data: Record<string, unknown>) =>
      run(async () => {
        const response = await patientService.updatePatientProfile(patientId, data as any)
        setPatientCache(response as any)
        return response
      }, 'Failed to update patient profile'),
    [run, setPatientCache]
  )

  const deletePatientProfile = useCallback(
    async (patientId: string) =>
      run(async () => {
        const response = await patientService.deletePatientProfile(patientId)
        setPatient(null)
        queryClient.invalidateQueries({ queryKey: queryKeys.patient.current })
        return response
      }, 'Failed to delete patient profile'),
    [queryClient, run]
  )

  const upsertPatientProfile = useCallback(
    async (data: Record<string, unknown>) =>
      run(async () => {
        const response = await patientService.upsertPatientProfile(data as any)
        setPatientCache(response as any)
        return response
      }, 'Failed to save patient profile'),
    [run, setPatientCache]
  )

  const searchPatients = useCallback(
    async (params: Record<string, unknown> = {}) =>
      run(async () => {
        const response = await patientService.searchPatients(params as any)
        queryClient.setQueryData(queryKeys.patient.search(params), response)
        return response
      }, 'Failed to search patients'),
    [queryClient, run]
  )

  const getDemographicsSummary = useCallback(
    async () =>
      run(async () => {
        const response = await patientService.getDemographicsSummary()
        queryClient.setQueryData(['patient', 'demographics'], response)
        return response
      }, 'Failed to load demographics'),
    [queryClient, run]
  )

  const clearPatientState = useCallback(() => {
    setPatient(null)
    setError(null)
  }, [])

  const clearErrorFn = useCallback(() => setError(null), [])

  return {
    createPatientProfile,
    getPatientProfile,
    getPatientProfileByUserId,
    getCurrentPatientProfile,
    updatePatientProfile,
    deletePatientProfile,
    upsertPatientProfile,
    searchPatients,
    getDemographicsSummary,
    clearPatientState,
    clearError: clearErrorFn,
    validatePatientProfile: patientService.validatePatientProfile,
    patient,
    profileCompletion: patientService.calculateProfileCompletion(patient as any),
    loading: loadingCount > 0,
    error,
    hasPatient: Boolean(patient),
  }
}
