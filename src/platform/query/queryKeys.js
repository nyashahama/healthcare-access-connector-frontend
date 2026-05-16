export const queryKeys = {
  patient: {
    current: ["patient", "current"],
    profile: (id) => ["patient", "profile", id],
    byUser: (userId) => ["patient", "user", userId],
    search: (params) => ["patient", "search", params],
  },
  provider: {
    clinic: ["provider", "clinic"],
    clinics: ["provider", "clinics"],
    staff: (clinicId) => ["provider", "clinic", clinicId, "staff"],
    activeStaff: (clinicId) => ["provider", "clinic", clinicId, "staff", "active"],
    services: (clinicId) => ["provider", "clinic", clinicId, "services"],
  },
  admin: {
    current: ["admin", "current"],
    profile: ["admin", "profile"],
    permissions: ["admin", "permissions"],
    users: ["admin", "users"],
    search: (params) => ["admin", "search", params],
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
