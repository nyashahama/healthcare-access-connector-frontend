import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "components/card";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { useConsultation } from "hooks/useConsultation";
import { useConsultationMessages } from "hooks/useConsultationMessages";
import { useConsultationNotes } from "hooks/useConsultationNotes";
import { useProviderAvailability } from "hooks/useProviderAvailability";

import ProviderChatHeader from "./components/ProviderChatHeader";
import PatientQueue from "./components/PatientQueue";
import ProviderMessagesContainer from "./components/ProviderMessagesContainer";
import ProviderMessageInput from "./components/ProviderMessageInput";
import PatientInfo from "./components/PatientInfo";
import {
  ProviderQuickActionsCard,
  PrescriptionPadCard,
} from "./components/ProviderSidebarComponents";
import {
  EndConsultationModal,
  PrescriptionModal,
  ReferralModal,
  LabOrderModal,
} from "./components/ProviderChatModals";

const WS_BASE_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8080";
const WAITING_ROOM_POLL_MS = 30_000;

const ProviderTelemedicineChat = () => {
  const { user, getToken } = useAuth();
  const { showToast } = useToast();

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const {
    waitingRoom,
    fetchWaitingRoom,
    fetchProviderActiveConsultations,
    acceptConsultation,
    startConsultation,
    completeConsultation,
    declineConsultation,
    fetchConsultationWithDetails,
    loading: consultationLoading,
  } = useConsultation();

  const {
    messages,
    fetchMessages,
    sendMessage,
    markAllPatientMessagesRead,
    clearMessages,
  } = useConsultationMessages();

  const {
    note,
    fetchNoteByConsultation,
    createNote,
    updateNote,
    finaliseNote,
    clearNote,
  } = useConsultationNotes();

  const {
    fetchMyAvailability,
    goOnline,
    goOffline,
    setAccepting,
    sendHeartbeat,
    isOnline,
    isAccepting,
  } = useProviderAvailability();

  // ── Local state ────────────────────────────────────────────────────────────
  const [newMessage, setNewMessage] = useState("");
  // Full ConsultationWithDetailsResponse for the currently active consultation
  const [activeConsultation, setActiveConsultation] = useState(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [wsMessages, setWsMessages] = useState([]);
  const [patientTyping, setPatientTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // Ref keeps activeConsultation accessible inside WS callbacks without stale closures
  const activeConsultationRef = useRef(null);

  // Modal states
  const [endConsultationModalOpen, setEndConsultationModalOpen] =
    useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [labOrderModalOpen, setLabOrderModalOpen] = useState(false);

  const consultationId = activeConsultation?.id;

  // Keep ref in sync with state
  useEffect(() => {
    activeConsultationRef.current = activeConsultation;
  }, [activeConsultation]);

  // ── Scroll to bottom ───────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, wsMessages]);

  // ── On mount ───────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchMyAvailability();
    fetchWaitingRoom();
    fetchProviderActiveConsultations();

    // Provider heartbeat — keeps the availability record alive server-side
    const availabilityHeartbeat = setInterval(() => {
      sendHeartbeat();
    }, 60_000);

    // Poll waiting room so new patients appear automatically
    pollIntervalRef.current = setInterval(() => {
      fetchWaitingRoom();
    }, WAITING_ROOM_POLL_MS);

    return () => {
      clearInterval(availabilityHeartbeat);
      clearInterval(pollIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── When a consultation becomes active load messages + note ───────────────
  useEffect(() => {
    if (consultationId) {
      fetchMessages(consultationId, { limit: 50 });
      fetchNoteByConsultation(consultationId);
      markAllPatientMessagesRead(consultationId);
      connectWebSocket(consultationId);
    }
    return () => {
      disconnectWebSocket();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultationId]);

  // ── WebSocket ──────────────────────────────────────────────────────────────
  const connectWebSocket = useCallback(
    (id) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;
      const token = getToken();
      if (!token) return;

      const ws = new WebSocket(
        `${WS_BASE_URL}/ws/consultations/${id}?token=${token}`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "ping" }));
          }
        }, 25_000);
      };

      ws.onmessage = (event) => {
        try {
          handleWsEvent(JSON.parse(event.data));
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onerror = (err) => console.error("Provider WS error", err);
      ws.onclose = () => clearInterval(heartbeatIntervalRef.current);
    },
    [getToken] // handleWsEvent deliberately excluded — read via closure over ref
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
      const ac = activeConsultationRef.current;
      switch (envelope.type) {
        case "message": {
          const payload = envelope.payload;
          setWsMessages((prev) => {
            if (prev.some((m) => m.id === payload.message_id)) return prev;
            const isOwnMessage = envelope.sender_user_id === user?.id;
            return [
              ...prev,
              {
                id: payload.message_id || Date.now(),
                text: payload.content,
                // Provider POV: own = right ("provider"), patient = left ("patient")
                sender: isOwnMessage ? "provider" : "patient",
                time: new Date(envelope.sent_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                patient:
                  !isOwnMessage && ac
                    ? `${ac.patient_first_name} ${ac.patient_last_name}`
                    : undefined,
                message_type: payload.message_type,
              },
            ];
          });
          break;
        }
        case "typing":
          if (envelope.sender_user_id !== user?.id) {
            setPatientTyping(true);
            setTimeout(() => setPatientTyping(false), 3000);
          }
          break;
        case "presence":
          if (
            envelope.payload?.action === "joined" &&
            envelope.sender_user_id !== user?.id
          ) {
            showToast("Patient has joined the consultation", "info");
          }
          break;
        case "consult_end":
          showToast("The consultation was ended by the patient", "warning");
          handlePostConsultation();
          break;
        default:
          break;
      }
    },
    [user?.id, showToast] // activeConsultation read via ref — no stale dependency
  );

  const sendTypingIndicator = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN && consultationId) {
      wsRef.current.send(
        JSON.stringify({ type: "typing", consultation_id: consultationId })
      );
    }
  }, [consultationId]);

  // ── Merged messages ────────────────────────────────────────────────────────
  const allMessages = React.useMemo(() => {
    const patientName = activeConsultation
      ? `${activeConsultation.patient_first_name} ${activeConsultation.patient_last_name}`
      : "Patient";

    const dbMessages = (messages || []).map((m) => ({
      id: m.id,
      text: m.content || "",
      sender: m.sender_role === "provider" ? "provider" : "patient",
      time: new Date(m.sent_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      patient: m.sender_role !== "provider" ? patientName : undefined,
      message_type: m.message_type,
      is_read: m.is_read,
    }));

    const seen = new Set(dbMessages.map((m) => m.id));
    const newWs = wsMessages.filter((m) => !seen.has(m.id));
    return [...dbMessages, ...newWs];
  }, [messages, wsMessages, activeConsultation]);

  // ── Map WaitingRoomEntryResponse → queue card shape ────────────────────────
  const queuePatients = React.useMemo(
    () =>
      (waitingRoom || []).map((e) => ({
        id: e.id,
        name: `${e.patient_first_name} ${e.patient_last_name}`,
        chiefComplaint: e.chief_complaint,
        triageLevel: e.triage_level_at_start,
        severityScore: e.severity_score,
        channel: e.channel,
        fee: e.consultation_fee,
        aiSummary: e.ai_summary,
        requestedAt: e.requested_at,
        priority: ["high", "emergency"].includes(e.triage_level_at_start)
          ? "urgent"
          : "normal",
        waitTime: e.requested_at
          ? `${Math.round(
              (Date.now() - new Date(e.requested_at).getTime()) / 60_000
            )} min`
          : "–",
        status: "waiting",
      })),
    [waitingRoom]
  );

  // ── Map ConsultationWithDetailsResponse → PatientInfo / header shape ────────
  const activePatientForUI = React.useMemo(() => {
    if (!activeConsultation) return null;
    return {
      id: activeConsultation.id,
      name: `${activeConsultation.patient_first_name} ${activeConsultation.patient_last_name}`,
      chiefComplaint: activeConsultation.chief_complaint,
      channel: activeConsultation.channel,
      triageLevel: activeConsultation.triage_level_at_start,
      severityScore: activeConsultation.severity_score,
      aiSummary: activeConsultation.ai_summary,
      symptomsReported: activeConsultation.symptoms_reported,
      preferredComm: activeConsultation.preferred_communication_method,
      priority: ["high", "emergency"].includes(
        activeConsultation.triage_level_at_start
      )
        ? "urgent"
        : "normal",
    };
  }, [activeConsultation]);

  // ── Post-consultation cleanup ──────────────────────────────────────────────
  const handlePostConsultation = useCallback(() => {
    disconnectWebSocket();
    setIsConsulting(false);
    setActiveConsultation(null);
    setWsMessages([]);
    clearMessages();
    clearNote();
    fetchWaitingRoom();
    fetchProviderActiveConsultations();
  }, [
    disconnectWebSocket,
    clearMessages,
    clearNote,
    fetchWaitingRoom,
    fetchProviderActiveConsultations,
  ]);

  // ── Action handlers ────────────────────────────────────────────────────────

  const handleAcceptPatient = useCallback(
    async (queueEntry) => {
      // 1. Accept  →  2. Start  →  3. Fetch full details
      const acceptResult = await acceptConsultation(queueEntry.id);
      if (!acceptResult.success) {
        showToast(acceptResult.error, "error");
        return;
      }

      const startResult = await startConsultation(queueEntry.id);
      if (!startResult.success) {
        showToast(startResult.error, "error");
        return;
      }

      const detailsResult = await fetchConsultationWithDetails(queueEntry.id);
      if (!detailsResult.success) {
        showToast(detailsResult.error, "error");
        return;
      }

      setActiveConsultation(detailsResult.data);
      setIsConsulting(true);
      setWsMessages([]);
      showToast(`Consultation started with ${queueEntry.name}`, "success");
      fetchWaitingRoom();
    },
    [
      acceptConsultation,
      startConsultation,
      fetchConsultationWithDetails,
      fetchWaitingRoom,
      showToast,
    ]
  );

  const handleDeclinePatient = useCallback(
    async (queueEntry) => {
      const result = await declineConsultation(queueEntry.id);
      if (result.success) {
        showToast(`Declined consultation for ${queueEntry.name}`, "info");
        fetchWaitingRoom();
      } else {
        showToast(result.error, "error");
      }
    },
    [declineConsultation, fetchWaitingRoom, showToast]
  );

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      showToast("Please enter a message", "warning");
      return;
    }
    if (!consultationId) return;

    const text = newMessage;
    setNewMessage("");

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Server persists → broadcasts back → handleWsEvent adds it (no duplicate)
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          consultation_id: consultationId,
          payload: { message_type: "text", content: text },
        })
      );
    } else {
      // HTTP fallback — add the persisted response directly
      const result = await sendMessage(consultationId, {
        sender_role: "provider",
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
              sender: "provider",
              time: new Date(m.sent_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              message_type: m.message_type,
            },
          ];
        });
      } else {
        showToast(result.error, "error");
        setNewMessage(text);
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

  const handleEndConsultation = () => setEndConsultationModalOpen(true);

  const confirmEndConsultation = async () => {
    if (!consultationId) return;
    const result = await completeConsultation(consultationId);
    if (result.success) {
      // Notify the patient before closing the socket
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "consult_end",
            consultation_id: consultationId,
          })
        );
      }
      setEndConsultationModalOpen(false);
      handlePostConsultation();
      showToast("Consultation ended. Records updated.", "info");
    } else {
      showToast(result.error, "error");
    }
  };

  // Clinical events — persisted as system_event messages so they appear in
  // both chat histories. WS broadcast shows them to the patient in real time.
  const postSystemEvent = useCallback(
    async (text) => {
      if (!consultationId) return;
      await sendMessage(consultationId, {
        sender_role: "provider",
        message_type: "system_event",
        content: text,
      });
    },
    [consultationId, sendMessage]
  );

  const handleIssuePrescription = () => setPrescriptionModalOpen(true);
  const confirmPrescription = async (data) => {
    setPrescriptionModalOpen(false);
    await postSystemEvent(
      `📋 Prescription issued: ${data.medication} ${data.dosage} — ${data.frequency} for ${data.duration}` +
        (data.instructions ? ` (${data.instructions})` : "")
    );
    showToast("Prescription sent to patient", "success");
  };

  const handleReferPatient = () => setReferralModalOpen(true);
  const confirmReferral = async (data) => {
    setReferralModalOpen(false);
    await postSystemEvent(
      `📤 Referral: ${data.specialist}` +
        (data.facility ? ` at ${data.facility}` : "") +
        ` — ${data.urgency}` +
        (data.reason ? ` · ${data.reason}` : "")
    );
    showToast("Referral sent successfully", "success");
  };

  const handleOrderLab = () => setLabOrderModalOpen(true);
  const confirmLabOrder = async (data) => {
    setLabOrderModalOpen(false);
    await postSystemEvent(
      `🔬 Lab order: ${data.tests.join(", ")} — Urgency: ${data.urgency}`
    );
    showToast("Lab order submitted", "success");
  };

  const handleToggleAvailability = async () => {
    if (isOnline) {
      // Go offline — also marks is_accepting=false server-side
      const result = await goOffline();
      if (result.success) {
        showToast("You are now offline", "info");
      } else {
        showToast(result.error, "error");
      }
    } else {
      // Step 1: go online
      const onlineResult = await goOnline();
      if (!onlineResult.success) {
        showToast(onlineResult.error, "error");
        return;
      }
      // Step 2: set is_accepting=true so IncrementActiveConsultations succeeds.
      // goOnline only sets is_online=true — is_accepting must be flipped separately.
      const acceptResult = await setAccepting({ is_accepting: true });
      if (!acceptResult.success) {
        showToast(
          acceptResult.error ||
            "Online but failed to enable patient acceptance",
          "warning"
        );
        return;
      }
      showToast("You are now online and accepting patients", "success");
    }
    // Re-sync availability state after any change
    await fetchMyAvailability();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="h-full">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
            Provider Consultation Dashboard
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Manage patient consultations, issue prescriptions, and coordinate
            care
          </p>
        </div>

        <button
          onClick={handleToggleAvailability}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isOnline
              ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-navy-700 dark:text-gray-400"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {isOnline ? "Online" : "Offline"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card extra="overflow-hidden">
            <ProviderChatHeader
              isConsulting={isConsulting}
              activePatient={activePatientForUI}
            />

            <ProviderMessagesContainer
              messages={allMessages}
              messagesEndRef={messagesEndRef}
              patientTyping={patientTyping}
              patientName={activePatientForUI?.name}
              isLoading={consultationLoading && allMessages.length === 0}
            />

            <ProviderMessageInput
              isConsulting={isConsulting}
              newMessage={newMessage}
              setNewMessage={handleTyping}
              onSendMessage={handleSendMessage}
              onIssuePrescription={handleIssuePrescription}
              onReferPatient={handleReferPatient}
              onOrderLab={handleOrderLab}
              onEndConsultation={handleEndConsultation}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <PatientQueue
            patients={queuePatients}
            activePatient={activePatientForUI}
            onAcceptPatient={handleAcceptPatient}
            onDeclinePatient={handleDeclinePatient}
            loading={consultationLoading}
            onRefresh={fetchWaitingRoom}
          />

          {activePatientForUI && (
            <PatientInfo
              patient={activePatientForUI}
              note={note}
              consultationId={consultationId}
              onCreateNote={createNote}
              onUpdateNote={updateNote}
              onFinaliseNote={finaliseNote}
            />
          )}

          <ProviderQuickActionsCard />

          <PrescriptionPadCard onIssuePrescription={handleIssuePrescription} />
        </div>
      </div>

      <EndConsultationModal
        isOpen={endConsultationModalOpen}
        onClose={() => setEndConsultationModalOpen(false)}
        onConfirm={confirmEndConsultation}
        patient={activePatientForUI}
      />
      <PrescriptionModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        patient={activePatientForUI}
        onConfirm={confirmPrescription}
      />
      <ReferralModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        patient={activePatientForUI}
        onConfirm={confirmReferral}
      />
      <LabOrderModal
        isOpen={labOrderModalOpen}
        onClose={() => setLabOrderModalOpen(false)}
        patient={activePatientForUI}
        onConfirm={confirmLabOrder}
      />
    </div>
  );
};

export default ProviderTelemedicineChat;
