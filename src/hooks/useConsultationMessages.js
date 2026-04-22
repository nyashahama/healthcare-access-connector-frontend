import consultationMessagesService from "api/services/consultationMessagesService";
import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "platform/query/queryKeys";

/**
 * Custom hook for consultation message operations.
 *
 * sender_user_id is never sent — derived from JWT.
 */
export const useConsultationMessages = () => {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [systemEvents, setSystemEvents] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    total: 0,
  });

  const [activeConsultationId, setActiveConsultationId] = useState(null);
  const [activeSenderRole, setActiveSenderRole] = useState(null);

  // useQuery hooks with enabled: false for all fetch operations
  useQuery({
    queryKey: queryKeys.consultation.messages(activeConsultationId),
    queryFn: () =>
      consultationMessagesService.getConsultationMessages(
        activeConsultationId,
        {}
      ),
    enabled: false,
  });

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId),
      "afterCursor",
    ],
    queryFn: () =>
      consultationMessagesService.getMessagesAfterCursor(
        activeConsultationId,
        null
      ),
    enabled: false,
  });

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId),
      "lastMessage",
    ],
    queryFn: () =>
      consultationMessagesService.getLastMessage(activeConsultationId),
    enabled: false,
  });

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId),
      "attachments",
    ],
    queryFn: () =>
      consultationMessagesService.getConsultationAttachments(
        activeConsultationId
      ),
    enabled: false,
  });

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId),
      "systemEvents",
    ],
    queryFn: () =>
      consultationMessagesService.getSystemEvents(activeConsultationId),
    enabled: false,
  });

  useQuery({
    queryKey: [
      ...queryKeys.consultation.messages(activeConsultationId),
      "unreadCount",
      { senderRole: activeSenderRole },
    ],
    queryFn: () =>
      consultationMessagesService.countUnreadMessages(
        activeConsultationId,
        activeSenderRole
      ),
    enabled: false,
  });

  // ─── Mutations ──────────────────────────────────────────────────────────

  const sendMessageMutation = useMutation({
    mutationFn: ({ consultationId, data }) => {
      const { sender_user_id, ...cleanPayload } = data;
      return consultationMessagesService.sendMessage(
        consultationId,
        cleanPayload
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: ({ consultationId, messageId }) =>
      consultationMessagesService.deleteMessage(consultationId, messageId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      });
    },
  });

  const insertSystemEventMutation = useMutation({
    mutationFn: ({ consultationId, data }) =>
      consultationMessagesService.insertSystemEvent(consultationId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      });
      queryClient.invalidateQueries({
        queryKey: [
          ...queryKeys.consultation.messages(variables.consultationId),
          "systemEvents",
        ],
      });
    },
  });

  const markMessageReadMutation = useMutation({
    mutationFn: ({ consultationId, messageId }) =>
      consultationMessagesService.markMessageRead(consultationId, messageId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      });
    },
  });

  const markAllProviderMessagesReadMutation = useMutation({
    mutationFn: ({ consultationId }) =>
      consultationMessagesService.markAllProviderMessagesRead(consultationId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      });
    },
  });

  const markAllPatientMessagesReadMutation = useMutation({
    mutationFn: ({ consultationId }) =>
      consultationMessagesService.markAllPatientMessagesRead(consultationId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.consultation.messages(variables.consultationId),
      });
    },
  });

  // ─── Write operations ───────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (consultationId, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await sendMessageMutation.mutateAsync({
          consultationId,
          data,
        });
        setMessages((prev) => [...prev, response]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to send message";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [sendMessageMutation]
  );

  const deleteMessage = useCallback(
    async (consultationId, messageId) => {
      setLoading(true);
      setError(null);
      try {
        await deleteMessageMutation.mutateAsync({ consultationId, messageId });
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        setLoading(false);
        return { success: true };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to delete message";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [deleteMessageMutation]
  );

  const insertSystemEvent = useCallback(
    async (consultationId, data) => {
      setLoading(true);
      setError(null);
      try {
        const response = await insertSystemEventMutation.mutateAsync({
          consultationId,
          data,
        });
        setMessages((prev) => [...prev, response]);
        setSystemEvents((prev) => [...prev, response]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to insert system event";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [insertSystemEventMutation]
  );

  // ─── Read operations ────────────────────────────────────────────────────

  const fetchMessages = useCallback(
    async (consultationId, params = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.consultation.messages(consultationId),
          queryFn: () =>
            consultationMessagesService.getConsultationMessages(
              consultationId,
              params
            ),
        });
        setMessages(response.messages || []);
        setPagination({
          limit: response.limit,
          offset: response.offset,
          total: response.count,
        });
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch messages";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const fetchMessagesAfterCursor = useCallback(
    async (consultationId, cursor) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            "afterCursor",
            cursor,
          ],
          queryFn: () =>
            consultationMessagesService.getMessagesAfterCursor(
              consultationId,
              cursor
            ),
        });
        setMessages((prev) => [...prev, ...(response.messages || [])]);
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to fetch new messages";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const fetchLastMessage = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            "lastMessage",
          ],
          queryFn: () =>
            consultationMessagesService.getLastMessage(consultationId),
        });
        setLastMessage(response);
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to fetch last message";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const fetchAttachments = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            "attachments",
          ],
          queryFn: () =>
            consultationMessagesService.getConsultationAttachments(
              consultationId
            ),
        });
        setAttachments(response.attachments || []);
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to fetch attachments";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  const fetchSystemEvents = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            "systemEvents",
          ],
          queryFn: () =>
            consultationMessagesService.getSystemEvents(consultationId),
        });
        setSystemEvents(response.events || []);
        setActiveConsultationId(consultationId);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to fetch system events";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  // ─── Read receipts ──────────────────────────────────────────────────────

  const markMessageRead = useCallback(
    async (consultationId, messageId) => {
      setLoading(true);
      setError(null);
      try {
        await markMessageReadMutation.mutateAsync({
          consultationId,
          messageId,
        });
        setMessages((prev) =>
          prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
        );
        setLoading(false);
        return { success: true };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to mark message read";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [markMessageReadMutation]
  );

  const markAllProviderMessagesRead = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        await markAllProviderMessagesReadMutation.mutateAsync({
          consultationId,
        });
        setMessages((prev) =>
          prev.map((m) =>
            m.sender_role === "provider" ? { ...m, is_read: true } : m
          )
        );
        setLoading(false);
        return { success: true };
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Failed to mark provider messages read";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [markAllProviderMessagesReadMutation]
  );

  const markAllPatientMessagesRead = useCallback(
    async (consultationId) => {
      setLoading(true);
      setError(null);
      try {
        await markAllPatientMessagesReadMutation.mutateAsync({
          consultationId,
        });
        setMessages((prev) =>
          prev.map((m) =>
            m.sender_role === "patient" ? { ...m, is_read: true } : m
          )
        );
        setLoading(false);
        return { success: true };
      } catch (err) {
        const msg =
          err.response?.data?.error ||
          "Failed to mark patient messages read";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [markAllPatientMessagesReadMutation]
  );

  const fetchUnreadCount = useCallback(
    async (consultationId, senderRole) => {
      setLoading(true);
      setError(null);
      try {
        const response = await queryClient.fetchQuery({
          queryKey: [
            ...queryKeys.consultation.messages(consultationId),
            "unreadCount",
            { senderRole },
          ],
          queryFn: () =>
            consultationMessagesService.countUnreadMessages(
              consultationId,
              senderRole
            ),
        });
        setUnreadCount(response.count);
        setActiveConsultationId(consultationId);
        setActiveSenderRole(senderRole);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg =
          err.response?.data?.error || "Failed to fetch unread count";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    [queryClient]
  );

  // ─── Clear helpers ──────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    setMessages([]);
    setAttachments([]);
    setSystemEvents([]);
    setLastMessage(null);
    setUnreadCount(0);
    setError(null);
    setActiveConsultationId(null);
    setActiveSenderRole(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Methods
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
    clearError,

    // State
    loading,
    error,
    messages,
    attachments,
    systemEvents,
    lastMessage,
    unreadCount,
    pagination,

    // Derived
    hasMessages: messages.length > 0,
    hasAttachments: attachments.length > 0,
    hasSystemEvents: systemEvents.length > 0,
  };
};
