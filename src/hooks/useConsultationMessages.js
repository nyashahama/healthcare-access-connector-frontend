import consultationMessagesService from "api/services/consultationMessagesService";
import { useCallback, useState } from "react";

/**
 * Custom hook for consultation message operations.
 *
 * sender_user_id is never sent — derived from JWT.
 */
export const useConsultationMessages = () => {
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

  // ─── Write operations ───────────────────────────────────────────────────

  const sendMessage = useCallback(async (consultationId, data) => {
    setLoading(true);
    setError(null);
    try {
      // Ensure no sender_user_id is sent
      const { sender_user_id, ...cleanPayload } = data;
      const response = await consultationMessagesService.sendMessage(
        consultationId,
        cleanPayload
      );
      // Prepend or append based on your UI preference (here we append to bottom)
      setMessages((prev) => [...prev, response]);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to send message";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const deleteMessage = useCallback(async (consultationId, messageId) => {
    setLoading(true);
    setError(null);
    try {
      await consultationMessagesService.deleteMessage(
        consultationId,
        messageId
      );
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to delete message";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const insertSystemEvent = useCallback(async (consultationId, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationMessagesService.insertSystemEvent(
        consultationId,
        data
      );
      setMessages((prev) => [...prev, response]);
      setSystemEvents((prev) => [...prev, response]); // assuming system event is also included
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to insert system event";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Read operations ────────────────────────────────────────────────────

  const fetchMessages = useCallback(async (consultationId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await consultationMessagesService.getConsultationMessages(
          consultationId,
          params
        );
      setMessages(response.messages || []);
      setPagination({
        limit: response.limit,
        offset: response.offset,
        total: response.count,
      });
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch messages";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchMessagesAfterCursor = useCallback(
    async (consultationId, cursor) => {
      setLoading(true);
      setError(null);
      try {
        const response =
          await consultationMessagesService.getMessagesAfterCursor(
            consultationId,
            cursor
          );
        // Append new messages to existing list
        setMessages((prev) => [...prev, ...(response.messages || [])]);
        setLoading(false);
        return { success: true, data: response };
      } catch (err) {
        const msg = err.response?.data?.error || "Failed to fetch new messages";
        setError(msg);
        setLoading(false);
        return { success: false, error: msg };
      }
    },
    []
  );

  const fetchLastMessage = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationMessagesService.getLastMessage(
        consultationId
      );
      setLastMessage(response);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch last message";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchAttachments = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response =
        await consultationMessagesService.getConsultationAttachments(
          consultationId
        );
      setAttachments(response.attachments || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch attachments";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchSystemEvents = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationMessagesService.getSystemEvents(
        consultationId
      );
      setSystemEvents(response.events || []);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch system events";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Read receipts ──────────────────────────────────────────────────────

  const markMessageRead = useCallback(async (consultationId, messageId) => {
    setLoading(true);
    setError(null);
    try {
      await consultationMessagesService.markMessageRead(
        consultationId,
        messageId
      );
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_read: true } : m))
      );
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to mark message read";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const markAllProviderMessagesRead = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      await consultationMessagesService.markAllProviderMessagesRead(
        consultationId
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_role === "provider" ? { ...m, is_read: true } : m
        )
      );
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to mark provider messages read";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const markAllPatientMessagesRead = useCallback(async (consultationId) => {
    setLoading(true);
    setError(null);
    try {
      await consultationMessagesService.markAllPatientMessagesRead(
        consultationId
      );
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_role === "patient" ? { ...m, is_read: true } : m
        )
      );
      setLoading(false);
      return { success: true };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to mark patient messages read";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  const fetchUnreadCount = useCallback(async (consultationId, senderRole) => {
    setLoading(true);
    setError(null);
    try {
      const response = await consultationMessagesService.countUnreadMessages(
        consultationId,
        senderRole
      );
      setUnreadCount(response.count);
      setLoading(false);
      return { success: true, data: response };
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch unread count";
      setError(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  }, []);

  // ─── Clear helpers ──────────────────────────────────────────────────────

  const clearMessages = useCallback(() => {
    setMessages([]);
    setAttachments([]);
    setSystemEvents([]);
    setLastMessage(null);
    setUnreadCount(0);
    setError(null);
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
