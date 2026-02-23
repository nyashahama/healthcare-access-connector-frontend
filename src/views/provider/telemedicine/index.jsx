import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "components/card";
import { useToast } from "hooks/useToast";
import { useAuth } from "context/AuthContext";
import { useConsultation } from "hooks/useConsultation";
import { useConsultationMessages } from "hooks/useConsultationMessages";
import { useConsultationNotes } from "hooks/useConsultationNotes";

import PatientQueue from "./components/PatientQueue";
import PatientInfo from "./components/PatientInfo";
import ProviderChatHeader from "./components/ProviderChatHeader";
import ProviderMessagesContainer from "./components/ProviderMessagesContainer";
import ProviderMessageInput from "./components/ProviderMessageInput";
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

// ─── Helpers ───────────────────────────────────────────────────────────────────

const mapWaitingRoomEntry = (entry) => ({
  id: entry.consultation_id ?? entry.id,
  consultationId: entry.consultation_id ?? entry.id,
  name: entry.patient_name ?? "Unknown Patient",
  chiefComplaint: entry.chief_complaint ?? "—",
  triageLevel: entry.triage_level,
  severityScore: entry.severity_score,
  channel: entry.channel,
  fee: entry.consultation_fee,
  aiSummary: entry.ai_summary,
  requestedAt: entry.requested_at,
  priority: entry.priority ?? "normal",
  waitTime: entry.wait_time ?? formatWaitTime(entry.requested_at),
  status: "waiting",
});

/**
 * BUG 2 FIX — mapActivePatient now also handles the flat shape returned by
 * GET /consultations/provider/active, which has:
 *   patient_first_name / patient_last_name  (not patient_name)
 *   preferred_communication_method          (not preferred_communication)
 * We support both shapes so the same mapper works for both the resume path
 * (flat active consultation) and the detail path (rich hydrated response).
 */
const mapActivePatient = (details) => {
  const firstName = details.patient_first_name ?? "";
  const lastName = details.patient_last_name ?? "";
  const fullName =
    details.patient_name ??
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : "Patient");

  return {
    id: details.patient_id,
    consultationId: details.id,
    name: fullName,
    chiefComplaint: details.chief_complaint ?? "—",
    channel: details.channel,
    triageLevel: details.triage_level_at_start,
    severityScore: details.severity_score,
    aiSummary: details.ai_summary,
    symptomsReported: details.symptoms_reported ?? [],
    preferredComm:
      details.preferred_communication ?? details.preferred_communication_method,
    priority: details.priority ?? "normal",
  };
};

const mapDbMessage = (m) => ({
  id: m.id,
  text: m.content ?? "",
  sender: m.sender_role, // "provider" | "patient" | "system"
  patient: m.sender_role === "patient" ? "Patient" : undefined,
  time: new Date(m.sent_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  sender_role: m.sender_role,
  message_type: m.message_type,
  is_read: m.is_read,
});

const mapWsMessage = (envelope) => ({
  id: envelope.payload?.message_id ?? `ws-${Date.now()}`,
  text: envelope.payload?.content ?? "",
  sender: envelope.payload?.sender_role ?? "patient",
  patient: envelope.payload?.sender_role === "patient" ? "Patient" : undefined,
  time: new Date(envelope.sent_at ?? Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  sender_role: envelope.payload?.sender_role,
  message_type: envelope.payload?.message_type,
});

function formatWaitTime(requestedAt) {
  if (!requestedAt) return "—";
  const diffMs = Date.now() - new Date(requestedAt).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "< 1 min";
  if (mins < 60) return `${mins} min`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

const ProviderTelemedicineChat = () => {
  const { getToken } = useAuth();
  const { showToast } = useToast();

  // ── Hooks ────────────────────────────────────────────────────────────────────
  const {
    fetchWaitingRoom,
    // BUG 1 FIX — use the PROVIDER-scoped hook, not the patient one.
    // fetchPatientActiveConsultation hits GET /consultations/me/active which
    // resolves a *patient* profile from the JWT. A provider_staff user has no
    // patient profile, so the backend returns 401/404 → AuthContext sees a 401
    // and signs the user out.
    fetchProviderActiveConsultations,
    fetchConsultationWithDetails,
    acceptConsultation,
    startConsultation,
    completeConsultation,
    declineConsultation,
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

  // ── Local state ──────────────────────────────────────────────────────────────
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [activeConsultationId, setActiveConsultationId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [wsMessages, setWsMessages] = useState([]);
  const [patientTyping, setPatientTyping] = useState(false);
  const [queueLoading, setQueueLoading] = useState(false);

  const [endModalOpen, setEndModalOpen] = useState(false);
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [referralModalOpen, setReferralModalOpen] = useState(false);
  const [labModalOpen, setLabModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const wsRef = useRef(null);
  const heartbeatRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isConsulting = !!activePatient && !!activeConsultationId;

  // ── Scroll to bottom ─────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, wsMessages]);

  // ── On mount: load waiting room + check for already-active consultation ──────
  useEffect(() => {
    loadQueue();
    resumeActiveConsultation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * BUG 1 FIX — calls fetchProviderActiveConsultations (provider-scoped endpoint)
   * instead of fetchPatientActiveConsultation.
   *
   * BUG 2 FIX — the active consultations response shape is:
   *   { consultations: [...], count: N }
   * Each item has patient_first_name + patient_last_name (not patient_name).
   * mapActivePatient now handles both field names.
   *
   * BUG 3 FIX — we set activePatient directly from the flat consultation item
   * so the patient panel is populated immediately without waiting for a second
   * /details round-trip (though we still fetch details for richer data).
   */
  const resumeActiveConsultation = useCallback(async () => {
    const result = await fetchProviderActiveConsultations();
    if (result.success && result.data?.consultations?.length > 0) {
      const active = result.data.consultations[0];
      const consultationId = active.id;

      // Show patient immediately with data we already have
      setActiveConsultationId(consultationId);
      setActivePatient(mapActivePatient(active));

      // Then hydrate with full details (enriches symptomsReported etc.)
      await hydrateConsultation(consultationId, /* skipPatientSet */ true);
    }
  }, [fetchProviderActiveConsultations]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadQueue = useCallback(async () => {
    setQueueLoading(true);
    const result = await fetchWaitingRoom();
    if (result.success) {
      const entries = result.data?.entries ?? [];
      setPatients(entries.map(mapWaitingRoomEntry));
    }
    setQueueLoading(false);
  }, [fetchWaitingRoom]);

  /**
   * Fetch full consultation details and messages, then connect to WebSocket.
   * skipPatientSet=true when the caller has already set activePatient from
   * the lighter active-consultations payload.
   */
  const hydrateConsultation = useCallback(
    async (consultationId, skipPatientSet = false) => {
      if (!skipPatientSet) {
        setActiveConsultationId(consultationId);
      }

      // Rich details (symptoms, AI summary, preferred comm, etc.)
      const detailsResult = await fetchConsultationWithDetails(consultationId);
      if (detailsResult.success && !skipPatientSet) {
        setActivePatient(mapActivePatient(detailsResult.data));
      } else if (detailsResult.success && skipPatientSet) {
        // Upgrade the patient record with richer fields
        setActivePatient(mapActivePatient(detailsResult.data));
      }

      await fetchMessages(consultationId, { limit: 50 });
      await fetchNoteByConsultation(consultationId);
      connectWebSocket(consultationId);
    },
    [fetchConsultationWithDetails, fetchMessages, fetchNoteByConsultation] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // ── Accept patient from queue ────────────────────────────────────────────────
  const handleAcceptPatient = useCallback(
    async (patient) => {
      const consultationId = patient.consultationId ?? patient.id;

      const acceptResult = await acceptConsultation(consultationId);
      if (!acceptResult.success) {
        showToast(
          acceptResult.error ?? "Failed to accept consultation",
          "error"
        );
        return;
      }

      await startConsultation(consultationId);
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
      showToast(`Consultation started with ${patient.name}`, "success");
      await hydrateConsultation(consultationId);
    },
    [acceptConsultation, startConsultation, hydrateConsultation, showToast]
  );

  const handleDeclinePatient = useCallback(
    async (patient) => {
      const consultationId = patient.consultationId ?? patient.id;
      await declineConsultation(consultationId);
      setPatients((prev) => prev.filter((p) => p.id !== patient.id));
      showToast(`Declined consultation with ${patient.name}`, "info");
    },
    [declineConsultation, showToast]
  );

  // ── WebSocket ────────────────────────────────────────────────────────────────
  const connectWebSocket = useCallback(
    (consultationId) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const token = getToken();
      if (!token) return;

      const url = `${WS_BASE_URL}/ws/consultations/${consultationId}?token=${token}`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        showToast("Real-time connection established", "success");
        heartbeatRef.current = setInterval(() => {
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

      ws.onerror = (err) => console.error("WS error", err);
      ws.onclose = () => clearInterval(heartbeatRef.current);
    },
    [getToken, showToast] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const disconnectWebSocket = useCallback(() => {
    clearInterval(heartbeatRef.current);
    wsRef.current?.close();
    wsRef.current = null;
  }, []);

  const handleWsEvent = useCallback(
    (envelope) => {
      switch (envelope.type) {
        case "message": {
          const mapped = mapWsMessage(envelope);
          setWsMessages((prev) => {
            if (prev.some((m) => m.id === mapped.id)) return prev;
            return [...prev, mapped];
          });
          break;
        }
        case "typing":
          if (
            envelope.payload?.sender_role === "patient" ||
            envelope.role === "patient"
          ) {
            setPatientTyping(true);
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(
              () => setPatientTyping(false),
              3000
            );
          }
          break;
        case "presence":
          if (envelope.payload?.action === "joined") {
            showToast("Patient has joined the consultation", "info");
          }
          break;
        default:
          break;
      }
    },
    [showToast]
  );

  // ── Merge DB messages + WS messages ─────────────────────────────────────────
  const allMessages = React.useMemo(() => {
    const dbMapped = messages.map(mapDbMessage);
    const seen = new Set(dbMapped.map((m) => m.id));
    const newWs = wsMessages.filter((m) => !seen.has(m.id));
    return [...dbMapped, ...newWs];
  }, [messages, wsMessages]);

  // ── Send message ─────────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConsultationId) return;

    const text = newMessage;
    setNewMessage("");

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          consultation_id: activeConsultationId,
          payload: {
            message_type: "text",
            content: text,
            sender_role: "provider",
          },
        })
      );
    } else {
      const result = await sendMessage(activeConsultationId, {
        sender_role: "provider",
        message_type: "text",
        content: text,
      });
      if (result.success) {
        const m = result.data;
        setWsMessages((prev) => {
          if (prev.some((msg) => msg.id === m.id)) return prev;
          return [...prev, mapDbMessage(m)];
        });
      } else {
        showToast(result.error, "error");
        setNewMessage(text);
      }
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    if (wsRef.current?.readyState === WebSocket.OPEN && activeConsultationId) {
      wsRef.current.send(
        JSON.stringify({
          type: "typing",
          consultation_id: activeConsultationId,
          role: "provider",
        })
      );
    }
  };

  // ── End consultation ─────────────────────────────────────────────────────────
  const handleEndConsultation = () => setEndModalOpen(true);

  const confirmEndConsultation = async () => {
    if (!activeConsultationId) return;
    const result = await completeConsultation(activeConsultationId);
    if (result.success) {
      disconnectWebSocket();
      setActivePatient(null);
      setActiveConsultationId(null);
      clearMessages();
      setWsMessages([]);
      setEndModalOpen(false);
      showToast("Consultation ended and saved to patient records", "success");
      loadQueue();
    } else {
      showToast(result.error ?? "Failed to end consultation", "error");
    }
  };

  // ── Clinical actions ─────────────────────────────────────────────────────────
  const sendClinicalMessage = useCallback(
    (message_type, content) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "message",
            consultation_id: activeConsultationId,
            payload: { message_type, content, sender_role: "provider" },
          })
        );
      }
    },
    [activeConsultationId]
  );

  const handlePrescriptionConfirm = (form) => {
    setPrescriptionModalOpen(false);
    sendClinicalMessage(
      "prescription",
      `Prescription issued: ${form.medication} ${form.dosage}, ${form.frequency} for ${form.duration}. ${form.instructions}`
    );
    showToast("Prescription issued successfully", "success");
  };

  const handleReferralConfirm = (form) => {
    setReferralModalOpen(false);
    sendClinicalMessage(
      "referral",
      `Referral sent to ${form.specialist}${
        form.facility ? ` at ${form.facility}` : ""
      }. Urgency: ${form.urgency}. Reason: ${form.reason}`
    );
    showToast("Referral sent successfully", "success");
  };

  const handleLabConfirm = (form) => {
    setLabModalOpen(false);
    sendClinicalMessage(
      "lab_order",
      `Lab order placed (${form.urgency}): ${form.tests.join(", ")}`
    );
    showToast("Lab order submitted", "success");
  };

  // ── Cleanup on unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      disconnectWebSocket();
      clearTimeout(typingTimeoutRef.current);
    };
  }, [disconnectWebSocket]);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-navy-700 dark:text-white">
          Provider Consultation Room
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Manage your patient queue and conduct secure consultations
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ── Main chat area (left, 2 cols) ── */}
        <div className="space-y-6 lg:col-span-2">
          <Card extra="overflow-hidden">
            <ProviderChatHeader
              isConsulting={isConsulting}
              activePatient={activePatient}
            />

            <ProviderMessagesContainer
              messages={allMessages}
              messagesEndRef={messagesEndRef}
              patientTyping={patientTyping}
              patientName={activePatient?.name}
              isLoading={consultationLoading && allMessages.length === 0}
            />

            <ProviderMessageInput
              isConsulting={isConsulting}
              newMessage={newMessage}
              setNewMessage={handleTyping}
              onSendMessage={handleSendMessage}
              onIssuePrescription={() => setPrescriptionModalOpen(true)}
              onReferPatient={() => setReferralModalOpen(true)}
              onOrderLab={() => setLabModalOpen(true)}
              onEndConsultation={handleEndConsultation}
            />
          </Card>

          {isConsulting && activePatient && (
            <PatientInfo
              patient={activePatient}
              note={note}
              consultationId={activeConsultationId}
              onCreateNote={createNote}
              onUpdateNote={updateNote}
              onFinaliseNote={finaliseNote}
            />
          )}
        </div>

        {/* ── Right sidebar: queue + quick actions (1 col) ── */}
        <div className="space-y-6">
          <PatientQueue
            patients={patients}
            activePatient={activePatient}
            onAcceptPatient={handleAcceptPatient}
            onDeclinePatient={handleDeclinePatient}
            loading={queueLoading}
            onRefresh={loadQueue}
          />
          <ProviderQuickActionsCard />
          {isConsulting && (
            <PrescriptionPadCard
              onIssuePrescription={() => setPrescriptionModalOpen(true)}
            />
          )}
        </div>
      </div>

      <EndConsultationModal
        isOpen={endModalOpen}
        onClose={() => setEndModalOpen(false)}
        onConfirm={confirmEndConsultation}
        patient={activePatient}
      />

      <PrescriptionModal
        isOpen={prescriptionModalOpen}
        onClose={() => setPrescriptionModalOpen(false)}
        patient={activePatient}
        onConfirm={handlePrescriptionConfirm}
      />

      <ReferralModal
        isOpen={referralModalOpen}
        onClose={() => setReferralModalOpen(false)}
        patient={activePatient}
        onConfirm={handleReferralConfirm}
      />

      <LabOrderModal
        isOpen={labModalOpen}
        onClose={() => setLabModalOpen(false)}
        patient={activePatient}
        onConfirm={handleLabConfirm}
      />
    </div>
  );
};

export default ProviderTelemedicineChat;
