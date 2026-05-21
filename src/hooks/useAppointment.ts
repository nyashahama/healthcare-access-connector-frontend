import { appointmentService } from '@/api/services/appointmentService'
import { useCallback, useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/platform/query/queryKeys'

export const useAppointment = () => {
  const queryClient = useQueryClient()

  const [appointment, setAppointment] = useState<Record<string, unknown> | null>(null)
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([])
  const [appointmentCount, setAppointmentCount] = useState(0)
  const [todayAppointments, setTodayAppointments] = useState<Record<string, unknown>[]>([])
  const [pendingAppointments, setPendingAppointments] = useState<Record<string, unknown>[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loadingCount, setLoadingCount] = useState(0)

  const startLoading = useCallback(() => setLoadingCount((c) => c + 1), [])
  const stopLoading = useCallback(() => setLoadingCount((c) => Math.max(0, c - 1)), [])
  const loading = loadingCount > 0

  const [activeAppointmentId, setActiveAppointmentId] = useState<string | null>(null)
  const [activePatientId, setActivePatientId] = useState<string | null>(null)
  const [activeClinicId, setActiveClinicId] = useState<string | null>(null)
  const [activeClinicDate, setActiveClinicDate] = useState<{ clinicId: string | null; date: string | null }>({ clinicId: null, date: null })
  const [activeTodayClinicId, setActiveTodayClinicId] = useState<string | null>(null)
  const [activePendingClinicId, setActivePendingClinicId] = useState<string | null>(null)
  const [activeCountPatientId, setActiveCountPatientId] = useState<string | null>(null)

  useQuery({
    queryKey: queryKeys.appointment.detail(activeAppointmentId ?? ''),
    queryFn: () => appointmentService.getAppointmentById(activeAppointmentId!),
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.appointment.list, { patientId: activePatientId }],
    queryFn: () => appointmentService.getAppointmentsByPatient(activePatientId!),
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.appointment.list, { clinicId: activeClinicId }],
    queryFn: () => appointmentService.getAppointmentsByClinic(activeClinicId!),
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.appointment.list, { clinicId: activeClinicDate.clinicId, date: activeClinicDate.date }],
    queryFn: () =>
      appointmentService.getAppointmentsByClinicAndDate(activeClinicDate.clinicId!, activeClinicDate.date!),
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.appointment.today, { clinicId: activeTodayClinicId }],
    queryFn: () => appointmentService.getTodayAppointments(activeTodayClinicId!),
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.appointment.pending, { clinicId: activePendingClinicId }],
    queryFn: () => appointmentService.getPendingAppointments(activePendingClinicId!),
    enabled: false,
  })

  useQuery({
    queryKey: [...queryKeys.appointment.list, 'count', { patientId: activeCountPatientId }],
    queryFn: () => appointmentService.getAppointmentCount(activeCountPatientId!),
    enabled: false,
  })

  const bookMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => appointmentService.bookAppointment(data as any),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
    },
  })

  const rescheduleMutation = useMutation({
    mutationFn: ({ id, data }: any) => appointmentService.rescheduleAppointment(id, data as any),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) })
      }
    },
  })

  const confirmMutation = useMutation({
    mutationFn: ({ id, data }: any) => appointmentService.confirmAppointment(id, data as any),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) })
      }
    },
  })

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, data }: any) => appointmentService.updateAppointmentNotes(id, data as any),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) })
      }
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => appointmentService.completeAppointment(id),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) })
      }
    },
  })

  const cancelMutation = useMutation({
    mutationFn: ({ id, data }: any) => appointmentService.cancelAppointment(id, data as any),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) })
      }
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: any) => appointmentService.updateAppointmentStatus(id, data as any),
    onSuccess: (data: any) => {
      setAppointment(data as Record<string, unknown>)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(data.id) })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => appointmentService.deleteAppointment(id),
    onSuccess: () => {
      setAppointment(null)
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.list })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.today })
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.pending })
    },
  })

  const bookAppointment = useCallback(async (data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await bookMutation.mutateAsync(data)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to book appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [bookMutation, startLoading, stopLoading])

  const getAppointmentById = useCallback(async (id: string) => {
    startLoading()
    setError(null)
    try {
      const response = await queryClient.fetchQuery({
        queryKey: queryKeys.appointment.detail(id),
        queryFn: () => appointmentService.getAppointmentById(id),
      })
      setAppointment(response as any as Record<string, unknown>)
      setActiveAppointmentId(id)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to fetch appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const getAppointmentsByPatient = useCallback(async (patientId: string) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, { patientId }],
        queryFn: () => appointmentService.getAppointmentsByPatient(patientId),
      })
      setAppointments(response.appointments || [])
      setActivePatientId(patientId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to fetch patient appointments'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const getAppointmentsByClinic = useCallback(async (clinicId: string) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, { clinicId }],
        queryFn: () => appointmentService.getAppointmentsByClinic(clinicId),
      })
      setAppointments(response.appointments || [])
      setActiveClinicId(clinicId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to fetch clinic appointments'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const getAppointmentsByClinicAndDate = useCallback(async (clinicId: string, date: string) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, { clinicId, date }],
        queryFn: () => appointmentService.getAppointmentsByClinicAndDate(clinicId, date),
      })
      setAppointments(response.appointments || [])
      setActiveClinicDate({ clinicId, date })
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to fetch appointments'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const getTodayAppointments = useCallback(async (clinicId: string) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.today, { clinicId }],
        queryFn: () => appointmentService.getTodayAppointments(clinicId),
      })
      setTodayAppointments(response.appointments || [])
      setActiveTodayClinicId(clinicId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        "Failed to fetch today's appointments"
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const getPendingAppointments = useCallback(async (clinicId: string) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.pending, { clinicId }],
        queryFn: () => appointmentService.getPendingAppointments(clinicId),
      })
      setPendingAppointments(response.appointments || [])
      setActivePendingClinicId(clinicId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to fetch pending appointments'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const rescheduleAppointment = useCallback(async (id: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await rescheduleMutation.mutateAsync({ id, data })
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to reschedule appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [rescheduleMutation, startLoading, stopLoading])

  const confirmAppointment = useCallback(async (id: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await confirmMutation.mutateAsync({ id, data })
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to confirm appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [confirmMutation, startLoading, stopLoading])

  const updateAppointmentNotes = useCallback(async (id: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await updateNotesMutation.mutateAsync({ id, data })
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to update appointment notes'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [updateNotesMutation, startLoading, stopLoading])

  const completeAppointment = useCallback(async (id: string) => {
    startLoading()
    setError(null)
    try {
      const response = await completeMutation.mutateAsync(id)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to complete appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [completeMutation, startLoading, stopLoading])

  const cancelAppointment = useCallback(async (id: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await cancelMutation.mutateAsync({ id, data })
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to cancel appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [cancelMutation, startLoading, stopLoading])

  const updateAppointmentStatus = useCallback(async (id: string, data: Record<string, unknown>) => {
    startLoading()
    setError(null)
    try {
      const response = await updateStatusMutation.mutateAsync({ id, data })
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to update appointment status'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [updateStatusMutation, startLoading, stopLoading])

  const deleteAppointment = useCallback(async (id: string) => {
    startLoading()
    setError(null)
    try {
      await deleteMutation.mutateAsync(id)
      stopLoading()
      return { success: true }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to delete appointment'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [deleteMutation, startLoading, stopLoading])

  const getAppointmentCount = useCallback(async (patientId: string) => {
    startLoading()
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: [...queryKeys.appointment.list, 'count', { patientId }],
        queryFn: () => appointmentService.getAppointmentCount(patientId),
      })
      setAppointmentCount(response.count)
      setActiveCountPatientId(patientId)
      stopLoading()
      return { success: true, data: response }
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        'Failed to fetch appointment count'
      setError(errorMessage)
      stopLoading()
      return { success: false, error: errorMessage }
    }
  }, [queryClient, startLoading, stopLoading])

  const clearError = useCallback(() => {
    setError(null)
    bookMutation.reset()
    rescheduleMutation.reset()
    confirmMutation.reset()
    updateNotesMutation.reset()
    completeMutation.reset()
    cancelMutation.reset()
    updateStatusMutation.reset()
    deleteMutation.reset()
  }, [bookMutation, rescheduleMutation, confirmMutation, updateNotesMutation, completeMutation, cancelMutation, updateStatusMutation, deleteMutation])

  const clearAppointmentState = useCallback(() => {
    setAppointment(null)
    setAppointments([])
    setAppointmentCount(0)
    setTodayAppointments([])
    setPendingAppointments([])
    setError(null)
    setActiveAppointmentId(null)
    setActivePatientId(null)
    setActiveClinicId(null)
    setActiveClinicDate({ clinicId: null, date: null })
    setActiveTodayClinicId(null)
    setActivePendingClinicId(null)
    setActiveCountPatientId(null)
    bookMutation.reset()
    rescheduleMutation.reset()
    confirmMutation.reset()
    updateNotesMutation.reset()
    completeMutation.reset()
    cancelMutation.reset()
    updateStatusMutation.reset()
    deleteMutation.reset()
  }, [bookMutation, rescheduleMutation, confirmMutation, updateNotesMutation, completeMutation, cancelMutation, updateStatusMutation, deleteMutation])

  useEffect(() => {
    return () => {
      setError(null)
    }
  }, [])

  return {
    bookAppointment,
    getAppointmentById,
    getAppointmentsByPatient,
    getAppointmentsByClinic,
    getAppointmentsByClinicAndDate,
    getTodayAppointments,
    getPendingAppointments,
    rescheduleAppointment,
    confirmAppointment,
    updateAppointmentNotes,
    completeAppointment,
    cancelAppointment,
    updateAppointmentStatus,
    deleteAppointment,
    getAppointmentCount,
    clearError,
    clearAppointmentState,
    loading,
    error,
    appointment,
    appointments,
    appointmentCount,
    todayAppointments,
    pendingAppointments,
    hasAppointment: !!appointment,
    hasAppointments: appointments.length > 0,
    hasTodayAppointments: todayAppointments.length > 0,
    hasPendingAppointments: pendingAppointments.length > 0,
  }
}
