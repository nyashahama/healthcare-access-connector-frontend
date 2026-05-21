import { getErrorMessage } from '@/utils/errorUtils'
import { consultationMessagesService } from '@/api/services/consultationMessagesService'
import { useCallback, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/platform/query/queryKeys'

export const useConsultationMessages = () => {
  const queryClient = useQueryClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, unknown>[]>([])
  const [attachments, setAttachments] = useState<Record<string, unknown>[]>([])
  const [systemEvents, setSystemEvents] = useState<Record<string, unknown>[]>([])
  const [lastMessage, setLastMessage] = useState<Record<string, unknown> | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  })

  const [activeConsultationId, setActiveConsultationId] = useState<string | null>(null)
  const [activeSenderRole, setActiveSenderRole] = useState<string | null>(null)

  useQuery({
    queryKey: queryKeys.consultation.messages(activeConsultationId ?? ''),
    queryFn: () =>
      consultationMessagesService.getConsultationMessages(
        activeConsultationId!,
        {}
      ),
    enabled: false,
  })

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId ?? ''),
      'afterCursor',
    ],
    queryFn: () =>
      consultationMessagesService.getMessagesAfterCursor(
        activeConsultationId!,
        '' as any
      ),
    enabled: false,
  })

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId ?? ''),
      'lastMessage',
    ],
    queryFn: () =>
      consultationMessagesService.getLastMessage(activeConsultationId!),
    enabled: false,
  })

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId ?? ''),
      'attachments',
    ],
    queryFn: () =>
      consultationMessagesService.getConsultationAttachments(
        activeConsultationId!
      ),
    enabled: false,
  })

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId ?? ''),
      'systemEvents',
    ],
    queryFn: () =>
      consultationMessagesService.getSystemEvents(activeConsultationId!),
    enabled: false,
  })

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId ?? ''),
      'unreadCount',
      { senderRole: activeSenderRole },
    ],
    queryFn: () =>
      consultationMessagesService.countUnreadMessages(
        activeConsultationId!,
        activeSenderRole!
      ),
    enabled: false,
  })

  const sendMessageMutation = useMutation({
    mutationFn: ({ consultationId, data }: any) => {
      const { sender_user_id: _, ...cleanPayload } = data
      return consultationMessagesService.sendMessage(
        consultationId,
        cleanPayload
      )
    },
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      })
    },
  })

  const deleteMessageMutation = useMutation({
    mutationFn: ({ consultationId, messageId }: any) =>
      consultationMessagesService.deleteMessage(consultationId, messageId),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      })
    },
  })

  const insertSystemEventMutation = useMutation({
    mutationFn: ({ consultationId, data }: any) =>
      consultationMessagesService.insertSystemEvent(consultationId, data as any),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      })
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.consultation.messages(variables.consultationId),
          'systemEvents',
        ],
      })
    },
  })

  const markMessageReadMutation = useMutation({
    mutationFn: ({ consultationId, messageId }: any) =>
      consultationMessagesService.markMessageRead(consultationId, messageId),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      })
    },
  })

  const markAllProviderMessagesReadMutation = useMutation({
    mutationFn: ({ consultationId }: any) =>
      consultationMessagesService.markAllProviderMessagesRead(consultationId),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      })
    },
  })

  const markAllPatientMessagesReadMutation = useMutation({
    mutationFn: ({ consultationId }: any) =>
      consultationMessagesService.markAllPatientMessagesRead(consultationId),
    onSuccess: (_data, variables: any) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      })
    },
  })

  const sendMessage = useCallback(
    async (consultationId: string, data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await sendMessageMutation.mutateAsync({
          consultationId,
          data,
        } as any)
        setMessages((prev) => [...prev, response as any as Record<string, unknown>])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to send message')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [sendMessageMutation]
  )

  const deleteMessage = useCallback(
    async (consultationId: string, messageId: string) => {
      setLoading(true)
      setError(null)
      try {
        await deleteMessageMutation.mutateAsync({ consultationId, messageId } as any)
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
        setLoading(false)
        return { success: true }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to delete message')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [deleteMessageMutation]
  )

  const insertSystemEvent = useCallback(
    async (consultationId: string, data: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const response = await insertSystemEventMutation.mutateAsync({
          consultationId,
          data,
        } as any)
        setMessages((prev) => [...prev, response as any as Record<string, unknown>])
        setSystemEvents((prev) => [...prev, response as any as Record<string, unknown>])
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to insert system event')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [insertSystemEventMutation]
  )

  const fetchMessages = useCallback(
    async (consultationId: string, params: Record<string, unknown> = {}) => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await queryClient.fetchQuery({
          queryKey: queryKeys.consultation.messages(consultationId),
          queryFn: () =>
            consultationMessagesService.getConsultationMessages(
              consultationId,
              params
            ),
        })
        setMessages(response.messages || [])
        setPagination({
          limit: response.limit ?? 20,
          offset: response.offset ?? 0,
          total: response.count ?? 0,
        })
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch messages')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchMessagesAfterCursor = useCallback(
    async (consultationId: string, cursor: string | null) => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            'afterCursor',
            cursor,
          ],
          queryFn: () =>
            consultationMessagesService.getMessagesAfterCursor(
              consultationId,
              cursor as any
            ),
        })
        setMessages((prev) => [...prev, ...(response.messages || [])])
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch new messages')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchLastMessage = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            'lastMessage',
          ],
          queryFn: () =>
            consultationMessagesService.getLastMessage(consultationId),
        })
        setLastMessage(response as any as Record<string, unknown>)
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch last message')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchAttachments = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            'attachments',
          ],
          queryFn: () =>
            consultationMessagesService.getConsultationAttachments(
              consultationId
            ),
        })
        setAttachments(response.attachments || [])
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch attachments')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const fetchSystemEvents = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            'systemEvents',
          ],
          queryFn: () =>
            consultationMessagesService.getSystemEvents(consultationId),
        })
        setSystemEvents(response.events || [])
        setActiveConsultationId(consultationId)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch system events')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const markMessageRead = useCallback(
    async (consultationId: string, messageId: string) => {
      setLoading(true)
      setError(null)
      try {
        await markMessageReadMutation.mutateAsync({
          consultationId,
          messageId,
        } as any)
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
        )
        setLoading(false)
        return { success: true }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to mark message read')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [markMessageReadMutation]
  )

  const markAllProviderMessagesRead = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        await markAllProviderMessagesReadMutation.mutateAsync({
          consultationId,
        } as any)
        setMessages((prev) =>
          prev.map((m) =>
            m.sender_role === 'provider' ? { ...m, is_read: true } : m
          )
        )
        setLoading(false)
        return { success: true }
      } catch (err: unknown) {
        const msg =
          (err as any)?.response?.data?.error ||
          'Failed to mark provider messages read'
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [markAllProviderMessagesReadMutation]
  )

  const markAllPatientMessagesRead = useCallback(
    async (consultationId: string) => {
      setLoading(true)
      setError(null)
      try {
        await markAllPatientMessagesReadMutation.mutateAsync({
          consultationId,
        } as any)
        setMessages((prev) =>
          prev.map((m) =>
            m.sender_role === 'patient' ? { ...m, is_read: true } : m
          )
        )
        setLoading(false)
        return { success: true }
      } catch (err: unknown) {
        const msg =
          (err as any)?.response?.data?.error ||
          'Failed to mark patient messages read'
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [markAllPatientMessagesReadMutation]
  )

  const fetchUnreadCount = useCallback(
    async (consultationId: string, senderRole: string) => {
      setLoading(true)
      setError(null)
      try {
        const response: any = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            'unreadCount',
            { senderRole },
          ],
          queryFn: () =>
            consultationMessagesService.countUnreadMessages(
              consultationId,
              senderRole
            ),
        })
        setUnreadCount(response.count)
        setActiveConsultationId(consultationId)
        setActiveSenderRole(senderRole)
        setLoading(false)
        return { success: true, data: response }
      } catch (err: unknown) {
        const msg = getErrorMessage(err, 'Failed to fetch unread count')
        setError(msg)
        setLoading(false)
        return { success: false, error: msg }
      }
    },
    [queryClient]
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setAttachments([])
    setSystemEvents([])
    setLastMessage(null)
    setUnreadCount(0)
    setError(null)
    setActiveConsultationId(null)
    setActiveSenderRole(null)
  }, [])

  const clearErrorFn = useCallback(() => {
    setError(null)
  }, [])

  return {
    sendMessage,
    deleteMessage,
    insertSystemEvent,
    fetchMessages,
    fetchMessagesAfterCursor,
    fetchLastMessage,
    fetchAttachments,
    fetchSystemEvents,
    markMessageRead,
    markAllProviderMessagesRead,
    markAllPatientMessagesRead,
    fetchUnreadCount,
    clearMessages,
    clearError: clearErrorFn,

    loading,
    error,
    messages,
    attachments,
    systemEvents,
    lastMessage,
    unreadCount,
    pagination,

    hasMessages: messages.length > 0,
    hasAttachments: attachments.length > 0,
    hasSystemEvents: systemEvents.length > 0,
  }
}
