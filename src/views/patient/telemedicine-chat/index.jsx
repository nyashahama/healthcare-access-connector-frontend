import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "components/card";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { useConsultation } from "hooks/useConsultation";
import { useConsultationMessages } from "hooks/useConsultationMessages";
import { useConsultationNotes } from "hooks/useConsultationNotes";
import { useProviderAvailability } from "hooks/useProviderAvailability";
import { useSymptomChecker } from "hooks/useSymptomChecker";
import { createConsultationSocket } from "platform/realtime/consultationSocket";
import { getRuntimeConfig } from "platform/config/runtime";
import ErrorBoundaryWrapper from "components/error-boundaries/ErrorBoundaryWrapper";
import CriticalFeatureFallback from "components/error-boundaries/CriticalFeatureFallback";

import ChatHeader from "./components/ChatHeader";
import MessagesContainer from "./components/MessagesContainer";
import MessageInput from "./components/MessageInput";
import ProvidersList from "./components/ProvidersList";
import ConsultationNotes from "./components/ConsultationNotes";
import {
  QuickActionsCard,
  SMSAlternativeBanner,
} from "./components/SidebarComponents";
import {
  EndChatModal,
  VideoCallModal,
  AttachFileModal,
  RatingModal,
} from "./components/ChatModals";

const TelemedicineChat = () => {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  // ── Hooks ────────────────────────────────────────────────────────────────
  const {
    activeConsultation,
    currentConsultation,
    fetchPatientActiveConsultation,
    requestConsultation,
    completeConsultation,
    submitPatientRating,
    loading: consultationLoading,
  } = useConsultation();

  const { messages, fetchMessages, sendMessage, clearMessages } =
    useConsultationMessages();

  const {
    note,
    fetchNoteByConsultation,
    createNote,
    updateNote,
    finaliseNote,
  } = useConsultationNotes();

  const {
    availableProviders,
    fetchAvailableProviders,
    loading: providersLoading,
  } = useProviderAvailability();

  const { eligibleSession, fetchEligibleSession } = useSymptomChecker();

  // ── Local state ──────────────────────────────────────────────────────────
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [providerTyping, setProviderTyping] = useState(false);
  const [wsMessages, setWsMessages] = useState([]); // real-time messages from WS
  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // Stable ref so ws.onmessage always calls the *latest* handleWsEvent without
  // needing to re-run connectWebSocket every time user/showToast changes.
  const wsEventHandlerRef = useRef(null);
  // Stable ref to consultationId for use inside WS close/reconnect callbacks
  // so the auto-reconnect closure never captures a stale value.
  const consultationIdRef = useRef(null);

  // Modal states
  const [endChatModalOpen, setEndChatModalOpen] = useState(false);
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);

  const consultationId = activeConsultation?.id || currentConsultation?.id;

  // Keep consultationIdRef in sync so WS reconnect always knows the current id.
  useEffect(() => {
    consultationIdRef.current = consultationId ?? null;
  }, [consultationId]);

  // ── On mount: check for active consultation + load providers ─────────────
  useEffect(() => {
    fetchPatientActiveConsultation();
    fetchAvailableProviders();
    fetchEligibleSession();
  }, [
    fetchPatientActiveConsultation,
    fetchAvailableProviders,
    fetchEligibleSession,
  ]);

  // ── When active consultation is found, load messages + note ─────────────
  useEffect(() => {
    if (!consultationId) return;

    // Clear any stale WS messages from a previous session before connecting.
    setWsMessages([]);
    setIsConnected(true);
    connectWebSocket(consultationId);
    fetchNoteByConsultation(consultationId);

    // Fetch DB messages, then flush wsMessages so any WS messages that raced
    // in during the fetch (with fallback ws-{ts} IDs) are replaced by the
    // authoritative DB snapshot. Real-time messages arriving after this point
    // will be genuinely new and deduplicated correctly.
    fetchMessages(consultationId, { limit: 50 }).then(() => {
      setWsMessages([]);
    });

    return () => {
      disconnectWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId]);

  // ── WebSocket ────────────────────────────────────────────────────────────
  // ── Keep wsEventHandlerRef always pointing at the latest handler so the
  //    WebSocket onmessage callback never closes over a stale version.
  //    This is the standard React pattern for "stable ref to latest callback".
  const handleWsEvent = useCallback(
    (envelope) => {
      switch (envelope.type) {
        case "message": {
          const payload = envelope.payload;
          const ts = envelope.sent_at
            ? new Date(envelope.sent_at).toISOString()
            : new Date().toISOString();
          const d = new Date(ts);
          const timeStr = isNaN(d.getTime())
            ? ""
            : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

          setWsMessages((prev) => {
            // Deduplicate by message ID
            if (
              payload.message_id &&
              prev.some((m) => m.id === payload.message_id)
            )
              return prev;

            // Find a matching optimistic bubble from this client.
            // If the server omits sender_role in the broadcast, match by
            // content alone so our own optimistic is always replaced rather
            // than leaving a ghost bubble + a wrongly-classified duplicate.
            const optimisticIdx = prev.findIndex(
              (m) =>
                m._optimistic &&
                m.text === payload.content &&
                (!payload.sender_role ||
                  m.sender_role === payload.sender_role)
            );

            // Resolve the true sender_role: prefer broadcast, fall back to
            // the optimistic's role (we know what we sent). If no optimistic
            // matched, the message came from the provider — not from this patient.
            const resolvedRole =
              payload.sender_role ||
              (optimisticIdx >= 0
                ? prev[optimisticIdx].sender_role
                : "provider_staff");

            const incoming = {
              id: payload.message_id || `ws-${Date.now()}`,
              text: payload.content,
              sender: resolvedRole === "patient" ? "user" : "provider",
              time: timeStr,
              sent_at: ts,
              provider: resolvedRole !== "patient" ? "Provider" : undefined,
              sender_role: resolvedRole,
              message_type: payload.message_type,
            };

            if (optimisticIdx >= 0) {
              const updated = [...prev];
              updated[optimisticIdx] = incoming;
              return updated;
            }
            return [...prev, incoming];
          });
          break;
        }
        case "typing":
          if (envelope.payload?.sender_role !== "patient") {
            setProviderTyping(true);
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(
              () => setProviderTyping(false),
              3000
            );
          }
          break;
        case "presence":
          if (
            envelope.payload?.action === "joined" &&
            envelope.payload?.sender_role !== "patient"
          ) {
            showToast("Provider has joined the consultation", "info");
          }
          break;
        case "consult_end":
          showToast(
            "The consultation has been ended by the provider",
            "warning"
          );
          setIsConnected(false);
          break;
        default:
          break;
      }
    },
    [showToast]
  );

  // Always keep the ref in sync with the latest handler version.
  useEffect(() => {
    wsEventHandlerRef.current = handleWsEvent;
  }, [handleWsEvent]);

  const isMountedRef = useRef(true);

  // Mark unmounted so cleanup runs correctly
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const connectWebSocket = useCallback(
    (id) => {
      if (wsRef.current) return;

      const token = getToken();
      if (!token) return;

      const { wsUrl } = getRuntimeConfig();
      const url = `${wsUrl}/ws/consultations/${id}?token=${token}`;

      wsRef.current = createConsultationSocket({
        url,
        onEvent: (envelope) => wsEventHandlerRef.current?.(envelope),
      });

      wsRef.current.connect();
    },
    [getToken] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const disconnectWebSocket = useCallback(() => {
    wsRef.current?.disconnect();
    wsRef.current = null;
  }, []);

  const sendTypingIndicator = useCallback(() => {
    if (consultationId) {
      wsRef.current?.send(
        JSON.stringify({ type: "typing", consultation_id: consultationId })
      );
    }
  }, [consultationId]);

  // ── All messages merged (DB + real-time) ─────────────────────────────────
  const allMessages = React.useMemo(() => {
    const dbMessages = messages.map((m) => {
      const ts = m.sent_at || m.created_at || null;
      const d = ts ? new Date(ts) : null;
      const validDate = d && !isNaN(d.getTime());
      return {
        id: m.id,
        text: m.content || "",
        // Use sender_role — the authoritative field stamped by the backend.
        sender: m.sender_role === "patient" ? "user" : "provider",
        time: validDate
          ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "",
        sent_at: validDate ? ts : null,
        provider: m.sender_role !== "patient" ? "Provider" : undefined,
        sender_role: m.sender_role,
        message_type: m.message_type,
        is_read: m.is_read,
      };
    });

    // Merge, deduplicate
    const seen = new Set(dbMessages.map((m) => m.id));
    const newWs = wsMessages.filter((m) => !seen.has(m.id));
    return [...dbMessages, ...newWs];
  }, [messages, wsMessages]);

  // ── Active provider derived from consultation ────────────────────────────
  const activeProvider = React.useMemo(() => {
    if (!activeConsultation) return null;
    return {
      id: activeConsultation.provider_staff_id,
      name: activeConsultation.provider_name || "Healthcare Provider",
      specialty:
        activeConsultation.provider_specialization || "General Medicine",
      avatar: "👨‍⚕️",
      fee: activeConsultation.fee ? `R${activeConsultation.fee}` : "–",
      status: "available",
      rating: null,
    };
  }, [activeConsultation]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      showToast("Please enter a message", "warning");
      return;
    }
    if (!consultationId) return;

    const text = newMessage;
    setNewMessage(""); // Clear input immediately for responsiveness

    if (wsRef.current?.isOpen?.()) {
      // Show the message immediately (optimistic). The server will broadcast it
      // back and handleWsEvent will replace this bubble with the real one.
      const now = new Date().toISOString();
      const tempId = `optimistic-${Date.now()}`;
      setWsMessages((prev) => [
        ...prev,
        {
          id: tempId,
          text,
          sender: "user",
          time: new Date(now).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sent_at: now,
          sender_role: "patient",
          message_type: "text",
          is_read: false,
          _optimistic: true,
        },
      ]);

      wsRef.current.send(
        JSON.stringify({
          type: "message",
          consultation_id: consultationId,
          payload: { message_type: "text", content: text, sender_role: "patient" },
        })
      );
    } else {
      // WS is down — fall back to HTTP.
      const result = await sendMessage(consultationId, {
        sender_role: "patient",
        message_type: "text",
        content: text,
      });
      if (result.success) {
        const m = result.data;
        const ts = m.sent_at || m.created_at || new Date().toISOString();
        const d = new Date(ts);
        setWsMessages((prev) => {
          if (prev.some((msg) => msg.id === m.id)) return prev;
          return [
            ...prev,
            {
              id: m.id,
              text: m.content || text,
              sender: "user",
              time: isNaN(d.getTime())
                ? ""
                : d.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
              sent_at: isNaN(d.getTime()) ? null : ts,
              is_read: false,
              sender_role: "patient",
              message_type: m.message_type,
            },
          ];
        });
      } else {
        showToast(result.error, "error");
        setNewMessage(text); // Restore input on failure
      }
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    if (!isTyping) {
      setIsTyping(true);
      sendTypingIndicator();
    }
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
  };

  const handleConnectToProvider = async (provider) => {
    const payload = {
      provider_staff_id: provider.id,
      symptom_session_id: eligibleSession?.id || undefined,
      channel: "chat",
    };
    const result = await requestConsultation(payload);
    if (result.success) {
      showToast(`Consultation requested with ${provider.name}`, "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleEndChat = () => setEndChatModalOpen(true);

  const confirmEndChat = async () => {
    if (!consultationId) return;
    const result = await completeConsultation(consultationId);
    if (result.success) {
      disconnectWebSocket();
      setIsConnected(false);
      clearMessages();
      setWsMessages([]);
      setEndChatModalOpen(false);
      setRateModalOpen(true);
      showToast("Consultation ended", "info");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleStartVideoCall = () => setVideoCallModalOpen(true);

  const confirmVideoCall = () => {
    setVideoCallModalOpen(false);
    showToast("Video call initiated. Please allow camera access.", "info");
  };

  const handleStartPhoneCall = () => {
    showToast("Initiating phone call…", "info");
  };

  const handleAttachFile = () => setAttachModalOpen(true);

  const handleFileSelect = async (type) => {
    setAttachModalOpen(false);
    showToast(`${type} upload coming soon`, "info");
  };

  const handleBookFollowUp = () => {
    showToast("Redirecting to appointment booking…", "info");
    setTimeout(() => {
      window.location.href = "/patient/find-clinic";
    }, 1000);
  };

  const handleSubmitRating = async (rating, feedback) => {
    if (!consultationId) return;
    const result = await submitPatientRating(consultationId, {
      rating,
      feedback,
    });
    setRateModalOpen(false);
    if (result.success) {
      showToast(`Thank you for your feedback!`, "success");
    }
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Telemedicine Consultation
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Connect with healthcare providers instantly through secure chat or
          video
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chat Area */}
        <div className="lg:col-span-2">
          <Card extra="overflow-hidden">
            <ChatHeader
              isConnected={isConnected}
              activeProvider={activeProvider}
              waitTime={
                activeConsultation?.estimated_wait_minutes
                  ? `${activeConsultation.estimated_wait_minutes} min`
                  : "Calculating…"
              }
              onStartVideoCall={handleStartVideoCall}
              onStartPhoneCall={handleStartPhoneCall}
            />

            <MessagesContainer
              messages={allMessages}
              messagesEndRef={messagesEndRef}
              providerTyping={providerTyping}
              isLoading={consultationLoading}
            />

            <MessageInput
              isConnected={isConnected}
              newMessage={newMessage}
              setNewMessage={handleTyping}
              onSendMessage={handleSendMessage}
              onAttachFile={handleAttachFile}
              onBookFollowUp={handleBookFollowUp}
              onEndChat={handleEndChat}
              onStartConsultation={() =>
                availableProviders[0] &&
                handleConnectToProvider(availableProviders[0])
              }
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ProvidersList
            providers={availableProviders}
            activeProvider={activeProvider}
            onConnectToProvider={handleConnectToProvider}
            loading={providersLoading}
          />

          <ConsultationNotes
            consultationId={consultationId}
            note={note}
            onCreateNote={createNote}
            onUpdateNote={updateNote}
            onFinaliseNote={finaliseNote}
          />

          <QuickActionsCard />
        </div>
      </div>

      <SMSAlternativeBanner />

      <EndChatModal
        isOpen={endChatModalOpen}
        onClose={() => setEndChatModalOpen(false)}
        onConfirm={confirmEndChat}
      />

      <VideoCallModal
        isOpen={videoCallModalOpen}
        onClose={() => setVideoCallModalOpen(false)}
        provider={activeProvider}
        onConfirm={confirmVideoCall}
      />

      <AttachFileModal
        isOpen={attachModalOpen}
        onClose={() => setAttachModalOpen(false)}
        onFileSelect={handleFileSelect}
      />

      <RatingModal
        isOpen={rateModalOpen}
        onClose={() => setRateModalOpen(false)}
        provider={activeProvider}
        onSubmit={handleSubmitRating}
      />
    </div>
  );
};

const TelemedicineChatWithBoundary = (props) => (
  <ErrorBoundaryWrapper
    fallback={(fallbackProps) => (
      <CriticalFeatureFallback feature="Telemedicine" {...fallbackProps} />
    )}
    context="telemedicine"
  >
    <TelemedicineChat {...props} />
  </ErrorBoundaryWrapper>
);

export default TelemedicineChatWithBoundary;
