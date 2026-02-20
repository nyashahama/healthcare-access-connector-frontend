import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "components/card";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { useConsultation } from "hooks/useConsultation";
import { useConsultationMessages } from "hooks/useConsultationMessages";
import { useConsultationNotes } from "hooks/useConsultationNotes";
import { useProviderAvailability } from "hooks/useProviderAvailability";
import { useSymptomChecker } from "hooks/useSymptomChecker";

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

const WS_BASE_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8080";

const TelemedicineChat = () => {
  const { user, getToken } = useAuth();
  const { showToast } = useToast();

  // ── Hooks ────────────────────────────────────────────────────────────────
  const {
    activeConsultation,
    currentConsultation,
    fetchPatientActiveConsultation,
    requestConsultation,
    cancelConsultation,
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
  const heartbeatIntervalRef = useRef(null);

  // Modal states
  const [endChatModalOpen, setEndChatModalOpen] = useState(false);
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false);
  const [attachModalOpen, setAttachModalOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);

  const consultationId = activeConsultation?.id || currentConsultation?.id;

  // ── Scroll to bottom whenever messages change ────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, wsMessages]);

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
    if (consultationId) {
      fetchMessages(consultationId, { limit: 50 });
      fetchNoteByConsultation(consultationId);
      setIsConnected(true);
      connectWebSocket(consultationId);
    }
    return () => {
      disconnectWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId]);

  // ── WebSocket ────────────────────────────────────────────────────────────
  const connectWebSocket = useCallback(
    (id) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const token = getToken();
      if (!token) return;

      const url = `${WS_BASE_URL}/ws/consultations/${id}?token=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        showToast("Real-time connection established", "success");
        // Heartbeat to keep connection alive
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25000);
      };

      ws.onmessage = (event) => {
        try {
          const envelope = JSON.parse(event.data);
          handleWsEvent(envelope);
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket error", err);
      };

      ws.onclose = () => {
        clearInterval(heartbeatIntervalRef.current);
      };
    },
    [getToken, showToast]
  );

  const disconnectWebSocket = useCallback(() => {
    clearInterval(heartbeatIntervalRef.current);
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const handleWsEvent = useCallback(
    (envelope) => {
      switch (envelope.type) {
        case "message":
          setWsMessages((prev) => {
            // Deduplicate by id
            const payload = envelope.payload;
            if (prev.some((m) => m.id === payload.message_id)) return prev;
            return [
              ...prev,
              {
                id: payload.message_id || Date.now(),
                text: payload.content,
                sender:
                  envelope.sender_user_id === user?.id ? "user" : "provider",
                time: new Date(envelope.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                provider:
                  envelope.sender_user_id !== user?.id ? "Provider" : undefined,
                sender_role: payload.sender_role,
                message_type: payload.message_type,
              },
            ];
          });
          break;
        case "typing":
          if (envelope.sender_user_id !== user?.id) {
            setProviderTyping(true);
            setTimeout(() => setProviderTyping(false), 3000);
          }
          break;
        case "presence":
          if (
            envelope.payload?.action === "joined" &&
            envelope.sender_user_id !== user?.id
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
    [user?.id, showToast]
  );

  const sendTypingIndicator = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && consultationId) {
      wsRef.current.send(
        JSON.stringify({ type: "typing", consultation_id: consultationId })
      );
    }
  }, [consultationId]);

  // ── All messages merged (DB + real-time) ─────────────────────────────────
  const allMessages = React.useMemo(() => {
    const dbMessages = messages.map((m) => ({
      id: m.id,
      text: m.content || "",
      sender: m.sender_user_id === user?.id ? "user" : "provider",
      time: new Date(m.sent_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      provider: m.sender_role === "provider" ? "Provider" : undefined,
      sender_role: m.sender_role,
      message_type: m.message_type,
      is_read: m.is_read,
    }));

    // Merge, deduplicate
    const seen = new Set(dbMessages.map((m) => m.id));
    const newWs = wsMessages.filter((m) => !seen.has(m.id));
    return [...dbMessages, ...newWs];
  }, [messages, wsMessages, user?.id]);

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

    // Send over WebSocket — the server persists it and broadcasts back to ALL
    // clients including the sender. The broadcast handler is the single place
    // that adds messages to wsMessages, so no duplicate can occur.
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          consultation_id: consultationId,
          payload: {
            message_type: "text",
            content: text,
          },
        })
      );
    } else {
      // WS is down — fall back to HTTP. The HTTP response is the persisted
      // message; add it directly to wsMessages so it appears immediately
      // without waiting for a page refresh.
      const result = await sendMessage(consultationId, {
        sender_role: "patient",
        message_type: "text",
        content: text,
      });
      if (result.success) {
        const m = result.data;
        setWsMessages((prev) => {
          if (prev.some((msg) => msg.id === m.id)) return prev;
          return [
            ...prev,
            {
              id: m.id,
              text: m.content || text,
              sender: "user",
              time: new Date(m.sent_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              is_read: false,
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

export default TelemedicineChat;
