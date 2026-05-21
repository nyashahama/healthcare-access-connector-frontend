type SenderRole = "system" | "patient" | "provider";

interface RealtimePayload {
  message_id: string;
  content?: string;
  sender_role?: string;
  sent_at?: string;
  message_type?: string;
  is_read?: boolean;
}

interface MappedMessage {
  id: string;
  text: string;
  sender_role: SenderRole;
  sent_at: string;
  message_type: string;
  is_read: boolean;
}

export const normalizeSenderRole = (role: string): SenderRole => {
  if (role === "system") return "system";
  if (role === "patient") return "patient";
  return "provider";
};

export const mapRealtimeMessage = (payload: RealtimePayload, fallbackRole: string = "provider"): MappedMessage => ({
  id: payload.message_id,
  text: payload.content ?? "",
  sender_role: normalizeSenderRole(payload.sender_role || fallbackRole),
  sent_at: payload.sent_at || new Date().toISOString(),
  message_type: payload.message_type || "text",
  is_read: Boolean(payload.is_read),
});
