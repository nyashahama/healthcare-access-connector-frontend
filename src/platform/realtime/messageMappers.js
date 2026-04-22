export const normalizeSenderRole = (role) => {
  if (role === "system") return "system";
  if (role === "patient") return "patient";
  return "provider";
};

export const mapRealtimeMessage = (payload, fallbackRole = "provider") => ({
  id: payload.message_id,
  text: payload.content ?? "",
  sender_role: normalizeSenderRole(payload.sender_role || fallbackRole),
  sent_at: payload.sent_at || new Date().toISOString(),
  message_type: payload.message_type || "text",
  is_read: Boolean(payload.is_read),
});
