export const queryKeys = {
  patient: {
    current: ["patient", "current"],
  },
  provider: {
    clinic: ["provider", "clinic"],
  },
  admin: {
    current: ["admin", "current"],
  },
  staff: {
    list: ["staff", "list"],
  },
  symptom: {
    data: ["symptoms", "data"],
    history: ["symptoms", "history"],
  },
  consultation: {
    active: ["consultations", "active"],
    list: ["consultations", "list"],
    detail: (id) => ["consultations", "detail", id],
    messages: (id) => ["consultations", id, "messages"],
    notes: (id) => ["consultations", id, "notes"],
  },
  appointment: {
    list: ["appointments", "list"],
    detail: (id) => ["appointments", "detail", id],
    today: ["appointments", "today"],
    pending: ["appointments", "pending"],
  },
};
