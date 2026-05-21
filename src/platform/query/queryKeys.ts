export const queryKeys = {
  patient: {
    current: ['patient', 'current'] as const,
    profile: (id: string) => ['patient', 'profile', id] as const,
    byUser: (userId: string) => ['patient', 'user', userId] as const,
    search: (params: Record<string, unknown>) => ['patient', 'search', params] as const,
  },
  provider: {
    clinic: ['provider', 'clinic'] as const,
    clinics: ['provider', 'clinics'] as const,
    staff: (clinicId: string) => ['provider', 'clinic', clinicId, 'staff'] as const,
    activeStaff: (clinicId: string) => ['provider', 'clinic', clinicId, 'staff', 'active'] as const,
    services: (clinicId: string) => ['provider', 'clinic', clinicId, 'services'] as const,
  },
  admin: {
    current: ['admin', 'current'] as const,
    profile: ['admin', 'profile'] as const,
    permissions: ['admin', 'permissions'] as const,
    users: ['admin', 'users'] as const,
    search: (params: Record<string, unknown>) => ['admin', 'search', params] as const,
  },
  staff: {
    list: ['staff', 'list'] as const,
  },
  symptom: {
    data: ['symptoms', 'data'] as const,
    history: ['symptoms', 'history'] as const,
  },
  consultation: {
    active: ['consultations', 'active'] as const,
    list: ['consultations', 'list'] as const,
    detail: (id: string) => ['consultations', 'detail', id] as const,
    messages: (id: string) => ['consultations', id, 'messages'] as const,
    notes: (id: string) => ['consultations', id, 'notes'] as const,
  },
  appointment: {
    list: ['appointments', 'list'] as const,
    detail: (id: string) => ['appointments', 'detail', id] as const,
    today: ['appointments', 'today'] as const,
    pending: ['appointments', 'pending'] as const,
  },
}
