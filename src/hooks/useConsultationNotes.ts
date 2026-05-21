import { getErrorMessage } from '@/utils/errorUtils'
import { consultationNotesService } from '@/api/services/consultationNotesService'
import { useCallback, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/platform/query/queryKeys'

export const useConsultationNotes = () => {
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState<Record<string, unknown> | null>(null)
  const [providerNoteHistory, setProviderNoteHistory] = useState<Record<string, unknown>[]>([])
  const [patientNoteHistory, setPatientNoteHistory] = useState<Record<string, unknown>[]>([])
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  })

  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(null)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [activeProviderHistoryParams, setActiveProviderHistoryParams] = useState<Record<string, unknown> | null>(null)

  useQuery({
    queryKey: queryKeys.consultation.notes(activeConsultationId ?? ''),
    queryFn: () =>
      consultationNotesService.getNoteByConsultationID(activeConsultationId!),
    enabled: false,
  })

  useQuery({
    queryKey: ['consultationNotes', 'detail', activeNoteId],
    queryFn: () => consultationNotesService.getNoteByID(activeNoteId!),
    enabled: false,
  })

  useQuery({
    queryKey: [
      ...queryKeys.consultation.notes(activeConsultationId ?? ''),
      'providerInfo',
    ],
    queryFn: () =>
      consultationNotesService.getNoteWithProviderInfo(activeConsultationId!),
    enabled: false,
  })

  useQuery({
    queryKey: [
      'consultationNotes',
      'providerHistory',
      activeProviderHistoryParams,
    ],
    queryFn: () =>
      consultationNotesService.getProviderNoteHistory(
        activeProviderHistoryParams!
      ),
    enabled: false,
  })

  useQuery({
    queryKey: ['consultationNotes', 'patientHistory'],
    queryFn: () => consultationNotesService.getPatientNoteHistory(),
    enabled: false,
  })

  const createNoteMutation = useMutation({
    mutationFn: (consultationId: string) =>
      consultationNotesService.createNote(consultationId),
    onSuccess: (data, consultationId) => {
      setNote(data as unknown as Record<string, unknown> | null)
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(consultationId),
      })
    },
  })

  const updateNoteMutation = useMutation({
    mutationFn: ({ consultationId, noteId, data }: { consultationId: string; noteId: string; data: Record<string, unknown> }) =>
      consultationNotesService.updateNote(consultationId, noteId, data),
    onSuccess: (data, variables) => {
      setNote(data as unknown as Record<string, unknown> | null)
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(variables.consultationId),
      })
    },
  })

  const finaliseNoteMutation = useMutation({
    mutationFn: ({ consultationId, noteId }: { consultationId: string; noteId: string }) =>
      consultationNotesService.finaliseNote(consultationId, noteId),
    onSuccess: (data, variables) => {
      setNote(data as unknown as Record<string, unknown> | null)
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(variables.consultationId),
      })
    },
  })

  const finaliseNoteByConsultationMutation = useMutation({
    mutationFn: (consultationId: string) =>
      consultationNotesService.finaliseNoteByConsultation(consultationId),
    onSuccess: (data, consultationId) => {
      setNote(data as unknown as Record<string, unknown> | null)
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.notes(consultationId),
      })
    },
  })

  const createNote = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await createNoteMutation.mutateAsync(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to create note')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [createNoteMutation]
  )

  const fetchNoteByConsultation = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.consultation.notes(consultationId),
          queryFn: () =>
            consultationNotesService.getNoteByConsultationID(consultationId),
        })
        setNote(response as unknown as Record<string, unknown> | null)
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        if ((err as { response?: { status?: number } }).response?.status === 404) {
          setNote(null)
          setActiveConsultationId(consultationId)
          setLoading(false)
          return { success: true, data: null }
        }
        const msg = getErrorMessage(err, 'Failed to fetch note')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const updateNote = useCallback(
    async (consultationId: string, noteId: string, data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await updateNoteMutation.mutateAsync({
          consultationId,
          noteId,
          data,
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to update note')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [updateNoteMutation]
  )

  const finaliseNote = useCallback(
    async (consultationId: string, noteId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await finaliseNoteMutation.mutateAsync({
          consultationId,
          noteId,
        })
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to finalise note')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [finaliseNoteMutation]
  )

  const finaliseNoteByConsultation = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response =
          await finaliseNoteByConsultationMutation.mutateAsync(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
          'Failed to finalise note by consultation'
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [finaliseNoteByConsultationMutation]
  )

  const fetchNoteByID = useCallback(
    async (noteId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ['consultationNotes', 'detail', noteId],
          queryFn: () => consultationNotesService.getNoteByID(noteId),
        })
        setNote(response as unknown as Record<string, unknown> | null)
        setActiveNoteId(noteId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch note')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchNoteWithProviderInfo = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.notes(consultationId),
            'providerInfo',
          ],
          queryFn: () =>
            consultationNotesService.getNoteWithProviderInfo(consultationId),
        })
        setNote(response as unknown as Record<string, unknown> | null)
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
          'Failed to fetch note with provider info'
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchProviderNoteHistory = useCallback(
    async (params: Record<string, unknown> = {}) => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await queryClient.fetchQuery({
          queryKey: ['consultationNotes', 'providerHistory', params],
          queryFn: () =>
            consultationNotesService.getProviderNoteHistory(params as any),
        })
        setProviderNoteHistory(response.notes || [])
        setPagination({
          limit: response.limit ?? 20,
          offset: response.offset ?? 0,
          total: response.count ?? 0,
        })
        setActiveProviderHistoryParams(params)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } }).response?.data?.error ||
          'Failed to fetch provider note history'
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchPatientNoteHistory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response: any = await queryClient.fetchQuery({
        queryKey: ['consultationNotes', 'patientHistory'],
        queryFn: () => consultationNotesService.getPatientNoteHistory(),
      })
      setPatientNoteHistory(response.notes || [])
      setLoading(false)
      return { success: true, data: response }
    } catch (err: unknown) {
      const msg = getErrorMessage(err, 'Failed to fetch patient note history')
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [queryClient])

  const clearNote = useCallback(() => {
    setNote(null)
    setError(null)
  }, [])

  const clearHistory = useCallback(() => {
    setProviderNoteHistory([])
    setPatientNoteHistory([])
    setError(null)
  }, [])

  const clearErrorFn = useCallback(() => {
    setError(null)
  }, [])

  return {
    createNote,
    fetchNoteByConsultation,
    updateNote,
    finaliseNote,
    finaliseNoteByConsultation,
    fetchNoteByID,
    fetchNoteWithProviderInfo,
    fetchProviderNoteHistory,
    fetchPatientNoteHistory,
    clearNote,
    clearHistory,
    clearError: clearErrorFn,

    loading,
    error,
    note,
    providerNoteHistory,
    patientNoteHistory,
    pagination,

    hasNote: !!note,
    hasProviderNotes: providerNoteHistory.length > 0,
    hasPatientNotes: patientNoteHistory.length > 0,
  }
}
