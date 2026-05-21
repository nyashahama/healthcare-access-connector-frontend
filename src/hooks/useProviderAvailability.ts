import { getErrorMessage } from '@/utils/errorUtils'
import { providerAvailabilityService } from '@/api/services/providerAvailabilityService'
import { useCallback, useState } from 'react'

export const useProviderAvailability = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableProviders, setAvailableProviders] = useState<Record<string, unknown>[]>([])
  const [myAvailability, setMyAvailability] = useState<Record<string, unknown> | null>(null)
  const [staleProviders, setStaleProviders] = useState<Record<string, unknown>[]>([])

  const fetchAvailableProviders = useCallback(async (params: Record<string, unknown> = {}) => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.getAvailableProviders(params)
      setAvailableProviders((response as unknown as { providers?: Record<string, unknown>[] }).providers || [])
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch available providers')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const fetchAvailableProvidersBySpecialization = useCallback(
    async (specialization: string) => {
      setLoading(true)
      setError(null)
      try {
        const { data: response } =
          await providerAvailabilityService.getAvailableProvidersBySpecialization(specialization)
        setAvailableProviders((response as unknown as { providers?: Record<string, unknown>[] }).providers || [])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
          'Failed to fetch providers by specialization'
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    []
  )

  const goOnline = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.goOnline()
      setMyAvailability(response as unknown as Record<string, unknown> | null)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to go online')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const goOffline = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.goOffline()
      setMyAvailability(null)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to go offline')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const setAccepting = useCallback(async (data: Record<string, unknown>) => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.setAccepting(data)
      setMyAvailability(response as unknown as Record<string, unknown> | null)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to update accepting state')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const updateStatus = useCallback(
    async (data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const { data: response } = await providerAvailabilityService.updateStatus(data)
        if (myAvailability) {
          setMyAvailability((prev) => ({ ...prev, ...data }))
        }
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to update status')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [myAvailability]
  )

  const updateWaitTime = useCallback(
    async (minutes: number) => {
      setLoading(true)
      setError(null)
      try {
        const { data: response } = await providerAvailabilityService.updateWaitTime(minutes)
        if (myAvailability) {
          setMyAvailability((prev) => ({
            ...prev,
            estimated_wait_minutes: minutes,
          }))
        }
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to update wait time')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [myAvailability]
  )

  const sendHeartbeat = useCallback(async () => {
    try {
      await providerAvailabilityService.sendHeartbeat()
      return { success: true }
    } catch (err: unknown) {
      return { success: false, error: (err as { message?: string }).message }
    }
  }, [])

  const fetchMyAvailability = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.getMyAvailability()
      setMyAvailability(response as unknown as Record<string, unknown> | null)
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch your availability')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const fetchStaleProviders = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.getStaleProviders()
      setStaleProviders((response as unknown as { providers?: Record<string, unknown>[] }).providers || [])
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch stale providers')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const setStaleProvidersOffline = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: response } = await providerAvailabilityService.setStaleProvidersOffline()
      setStaleProviders([])
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to set stale providers offline')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const clearProviders = useCallback(() => {
    setAvailableProviders([])
    setMyAvailability(null)
    setStaleProviders([])
    setError(null)
  }, [])

  const clearErrorFn = useCallback(() => {
    setError(null)
  }, [])

  return {
    fetchAvailableProviders,
    fetchAvailableProvidersBySpecialization,
    goOnline,
    goOffline,
    setAccepting,
    updateStatus,
    updateWaitTime,
    sendHeartbeat,
    fetchMyAvailability,
    fetchStaleProviders,
    setStaleProvidersOffline,
    clearProviders,
    clearError: clearErrorFn,

    loading,
    error,
    availableProviders,
    myAvailability,
    staleProviders,

    hasAvailableProviders: availableProviders.length > 0,
    isOnline: !!myAvailability?.is_online,
    isAccepting: !!myAvailability?.is_accepting,
  }
}
