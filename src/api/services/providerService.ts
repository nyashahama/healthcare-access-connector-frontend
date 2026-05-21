import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'

export interface ClinicPayload {
  name?: string
  address?: string
  phone?: string
  email?: string
  clinic_type?: string
  accepts_medical_aid?: boolean
  operating_hours?: Record<string, unknown>
  [key: string]: unknown
}

export interface StaffPayload {
  staff_role?: string
  role?: string
  work_email?: string
  email?: string
  work_phone?: string
  phone_number?: string
  employment_status?: string
  status?: string
  [key: string]: unknown
}

export interface ServicePayload {
  cost_currency?: string
  follow_up_required?: boolean
  is_covered_by_medical_aid?: boolean
  is_active?: boolean
  requires_appointment?: boolean
  walk_in_allowed?: boolean
  [key: string]: unknown
}

export interface StaffRecord {
  id: string
  staff_id: string
  user_id: string
  clinic_id: string
  staff_role: string
  role: string
  work_email: string
  email: string
  work_phone: string
  phone_number: string
  personal_phone?: string
  employment_status: string
  status: string
  [key: string]: unknown
}

export interface ServiceRecord {
  id: string
  service_id: string
  [key: string]: unknown
}

export interface StaffListResponse {
  staff: StaffRecord[]
  total?: number
  limit?: number
  offset?: number
}

export interface ServiceListResponse {
  services: ServiceRecord[]
  [key: string]: unknown
}

const CLINIC_TYPE_ALIASES: Record<string, string> = {
  private: 'private_clinic',
  public: 'public_health_clinic',
  community: 'community_health_center',
  mobile: 'mobile_clinic',
}

const normalizeClinicPayload = (data: ClinicPayload = {}): ClinicPayload => {
  const { operating_hours, ...rest } = data
  const payload: ClinicPayload = {
    ...rest,
    clinic_type: CLINIC_TYPE_ALIASES[data.clinic_type as string] || data.clinic_type,
    accepts_medical_aid: Boolean(data.accepts_medical_aid),
  }

  if (operating_hours && typeof operating_hours === 'object') {
    payload.operating_hours = operating_hours
  }

  return payload
}

const normalizeStaffPayload = (data: StaffPayload = {}): StaffPayload => {
  const payload: StaffPayload = {
    ...data,
    staff_role: data.staff_role || data.role,
    work_email: data.work_email || data.email,
    work_phone: data.work_phone || data.phone_number,
    employment_status: data.employment_status || data.status || 'active',
  }

  delete payload.role
  delete payload.email
  delete payload.phone_number
  delete payload.status
  return payload
}

const normalizeServicePayload = (data: ServicePayload = {}): ServicePayload => ({
  ...data,
  cost_currency: data.cost_currency || 'ZAR',
  follow_up_required: Boolean(data.follow_up_required),
  is_covered_by_medical_aid: Boolean(data.is_covered_by_medical_aid),
  is_active: data.is_active !== undefined ? data.is_active : true,
  requires_appointment: data.requires_appointment !== undefined ? data.requires_appointment : true,
  walk_in_allowed: Boolean(data.walk_in_allowed),
})

const normalizeStaff = (staff: StaffRecord = {} as StaffRecord): StaffRecord => ({
  ...staff,
  staff_id: staff.staff_id || staff.id,
  role: staff.role || staff.staff_role,
  email: staff.email || staff.work_email,
  phone_number: staff.phone_number || staff.work_phone || staff.personal_phone || '',
  status: staff.status || staff.employment_status || 'active',
})

const normalizeService = (service: ServiceRecord = {} as ServiceRecord): ServiceRecord => ({
  ...service,
  service_id: service.service_id || service.id,
})

const normalizeStaffList = (payload: StaffListResponse): StaffListResponse => ({
  ...payload,
  staff: (payload.staff || []).map(normalizeStaff),
})

const normalizeServiceList = (payload: ServiceListResponse): ServiceListResponse => ({
  ...payload,
  services: (payload.services || []).map(normalizeService),
})

const normalizeVerificationPayload = (
  dataOrUserId: string | Record<string, unknown>,
  notes?: string
): { verified_by: string; notes: string; status: string } => {
  if (typeof dataOrUserId === 'object' && dataOrUserId !== null) {
    return {
      verified_by: dataOrUserId.verified_by as string,
      notes: (dataOrUserId.notes || dataOrUserId.rejection_reason || dataOrUserId.status || 'Clinic verification reviewed') as string,
      status: (dataOrUserId.status || dataOrUserId.verification_status) as string,
    }
  }

  return {
    verified_by: dataOrUserId,
    notes: notes || 'Clinic verified',
    status: 'verified',
  }
}

export const providerService = {
  registerClinic: async (data: ClinicPayload): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.post<ApiResponse<Record<string, unknown>>>('/api/v1/providers/clinics', normalizeClinicPayload(data))
    return response.data
  },

  getClinic: async (clinicId: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/api/v1/providers/clinics/${clinicId}`)
    return response.data
  },

  getClinics: async (): Promise<ApiResponse<Record<string, unknown>[]>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>[]>>('/api/v1/providers/clinics')
    return response.data
  },

  getMyClinic: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>('/api/v1/providers/clinics/my-clinic')
    return response.data
  },

  updateClinic: async (clinicId: string, data: ClinicPayload): Promise<ApiResponse<Record<string, unknown>>> => {
    let existing = {}
    try {
      const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/api/v1/providers/clinics/${clinicId}`)
      existing = response.data || {}
    } catch {
      existing = {}
    }

    const response = await apiClient.put<ApiResponse<Record<string, unknown>>>(`/api/v1/providers/clinics/${clinicId}`, normalizeClinicPayload({ ...existing, ...data }))
    return response.data
  },

  deleteClinic: async (clinicId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/providers/clinics/${clinicId}`)
    return response.data
  },

  verifyClinic: async (clinicId: string, data: string | Record<string, unknown>, notes?: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const payload = normalizeVerificationPayload(data, notes)
    const response = await apiClient.put<ApiResponse<Record<string, unknown>>>(`/api/v1/providers/clinics/${clinicId}/verify`, {
      verified_by: payload.verified_by,
      notes: payload.notes,
    })
    return response.data
  },

  updateVerifyClinic: async (clinicId: string, data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    const payload = normalizeVerificationPayload(data)
    if (payload.status === 'rejected') {
      throw new Error('Clinic rejection is not supported by the backend API')
    }
    return providerService.verifyClinic(clinicId, payload)
  },

  registerStaff: async (data: StaffPayload): Promise<StaffRecord> => {
    const response = await apiClient.post<StaffRecord>('/api/v1/providers/staff', normalizeStaffPayload(data))
    return normalizeStaff(response.data)
  },

  getStaff: async (staffId: string): Promise<StaffRecord> => {
    const response = await apiClient.get<StaffRecord>(`/api/v1/providers/staff/${staffId}`)
    return normalizeStaff(response.data)
  },

  updateStaff: async (staffId: string, data: StaffPayload): Promise<StaffRecord> => {
    const response = await apiClient.put<StaffRecord>(`/api/v1/providers/staff/${staffId}`, normalizeStaffPayload(data))
    return normalizeStaff(response.data)
  },

  deleteStaff: async (staffId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/providers/staff/${staffId}`)
    return response.data
  },

  checkStaffStatus: async (staffId: string): Promise<ApiResponse<{ exists: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ exists: boolean }>>(`/api/v1/providers/staff/${staffId}/exists`)
    return response.data
  },

  listClinicStaff: async (clinicId: string): Promise<StaffListResponse> => {
    const response = await apiClient.get<StaffListResponse>(`/api/v1/providers/clinics/${clinicId}/staff`)
    return normalizeStaffList(response.data)
  },

  listActiveClinicStaff: async (clinicId: string): Promise<StaffListResponse> => {
    const response = await apiClient.get<StaffListResponse>(`/api/v1/providers/clinics/${clinicId}/staff/active`)
    return normalizeStaffList(response.data)
  },

  registerService: async (data: ServicePayload): Promise<ServiceRecord> => {
    const response = await apiClient.post<ServiceRecord>('/api/v1/providers/services', normalizeServicePayload(data))
    return normalizeService(response.data)
  },

  getService: async (serviceId: string): Promise<ServiceRecord> => {
    const response = await apiClient.get<ServiceRecord>(`/api/v1/providers/services/${serviceId}`)
    return normalizeService(response.data)
  },

  updateService: async (serviceId: string, data: ServicePayload): Promise<ServiceRecord> => {
    const response = await apiClient.put<ServiceRecord>(`/api/v1/providers/services/${serviceId}`, normalizeServicePayload(data))
    return normalizeService(response.data)
  },

  deleteService: async (serviceId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/providers/services/${serviceId}`)
    return response.data
  },

  checkServiceExists: async (serviceId: string): Promise<ApiResponse<{ exists: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ exists: boolean }>>(`/api/v1/providers/services/${serviceId}/exists`)
    return response.data
  },

  getClinicService: async (clinicId: string): Promise<ServiceListResponse> => {
    const response = await apiClient.get<ServiceListResponse>(`/api/v1/providers/clinics/${clinicId}/services`)
    return normalizeServiceList(response.data)
  },

  registerCredential: async (data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.post<ApiResponse<Record<string, unknown>>>('/api/v1/providers/credentials', data)
    return response.data
  },

  deleteCredential: async (credentialId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/providers/credentials/${credentialId}`)
    return response.data
  },

  getStaffCredential: async (staffId: string): Promise<ApiResponse<Record<string, unknown>[]>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>[]>>(`/api/v1/providers/staff/${staffId}/credentials`)
    return response.data
  },
}
