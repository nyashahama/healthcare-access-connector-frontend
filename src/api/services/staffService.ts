import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'

export interface StaffData {
  id: string
  user_id: string
  clinic_id: string
  staff_role: string
  work_email?: string
  work_phone?: string
  personal_phone?: string
  employment_status: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export interface StaffListWithTotal {
  staff: StaffData[]
  total: number
  limit?: number
  offset?: number
}

export interface InviteStaffRequest {
  email: string
  staff_role: string
  work_email?: string
  work_phone?: string
  first_name?: string
  last_name?: string
}

export interface StaffInvitation {
  id: string
  token: string
  clinic_id: string
  email: string
  staff_role: string
  invited_by: string
  status: string
  expires_at: string
  created_at: string
}

export interface InvitationWithStaff {
  message: string
  staff: StaffData
}

export interface MyInvitationsResponse {
  invitations: StaffInvitation[]
  total: number
}

export const staffService = {
  createStaff: async (data: Record<string, unknown>): Promise<ApiResponse<StaffData>> => {
    const response = await apiClient.post<ApiResponse<StaffData>>('/api/v1/providers/staff', data)
    return response.data
  },

  getStaff: async (staffId: string): Promise<ApiResponse<StaffData>> => {
    const response = await apiClient.get<ApiResponse<StaffData>>(`/api/v1/providers/staff/${staffId}`)
    return response.data
  },

  getStaffByUserId: async (userId: string): Promise<ApiResponse<StaffData>> => {
    const response = await apiClient.get<ApiResponse<StaffData>>(`/api/v1/providers/staff/user/${userId}`)
    return response.data
  },

  updateStaff: async (staffId: string, data: Record<string, unknown>): Promise<ApiResponse<StaffData>> => {
    const response = await apiClient.put<ApiResponse<StaffData>>(`/api/v1/providers/staff/${staffId}`, data)
    return response.data
  },

  deleteStaff: async (staffId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/providers/staff/${staffId}`)
    return response.data
  },

  checkStaffExists: async (staffId: string): Promise<ApiResponse<{ exists: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ exists: boolean }>>(`/api/v1/providers/staff/${staffId}/exists`)
    return response.data
  },

  listClinicStaff: async (clinicId: string): Promise<StaffListWithTotal> => {
    const response = await apiClient.get<StaffListWithTotal>(`/api/v1/providers/clinics/${clinicId}/staff`)
    return response.data
  },

  listAllClinicStaff: async (clinicId: string): Promise<StaffListWithTotal> => {
    const response = await apiClient.get<StaffListWithTotal>(`/api/v1/providers/clinics/${clinicId}/staff/all`)
    return response.data
  },

  listActiveClinicStaff: async (clinicId: string): Promise<StaffListWithTotal> => {
    const response = await apiClient.get<StaffListWithTotal>(`/api/v1/providers/clinics/${clinicId}/staff/active`)
    return response.data
  },

  inviteStaff: async (clinicId: string, data: Record<string, unknown>): Promise<ApiResponse<StaffInvitation>> => {
    const response = await apiClient.post<ApiResponse<StaffInvitation>>(`/api/v1/providers/clinics/${clinicId}/staff/invite`, data)
    return response.data
  },

  getInvitationDetails: async (token: string): Promise<ApiResponse<StaffInvitation>> => {
    const response = await apiClient.get<ApiResponse<StaffInvitation>>(`/api/v1/staff/invitations/${token}`)
    return response.data
  },

  acceptInvitation: async (token: string): Promise<ApiResponse<InvitationWithStaff>> => {
    const response = await apiClient.post<ApiResponse<InvitationWithStaff>>(`/api/v1/staff/invitations/${token}/accept`)
    return response.data
  },

  declineInvitation: async (token: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(`/api/v1/staff/invitations/${token}/decline`)
    return response.data
  },

  getPendingInvitations: async (clinicId: string): Promise<StaffListWithTotal> => {
    const response = await apiClient.get<StaffListWithTotal>(`/api/v1/providers/clinics/${clinicId}/staff/invitations/pending`)
    return response.data
  },

  getMyInvitations: async (): Promise<MyInvitationsResponse> => {
    const response = await apiClient.get<MyInvitationsResponse>('/api/v1/staff/invitations/my')
    return response.data
  },

  cancelInvitation: async (clinicId: string, token: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/api/v1/providers/clinics/${clinicId}/staff/invitations/${token}`)
    return response.data
  },

  resendInvitation: async (clinicId: string, invitationId: string): Promise<ApiResponse<{ message: string; new_token: string; invitation_expires: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string; new_token: string; invitation_expires: string }>>(`/api/v1/providers/clinics/${clinicId}/staff/invitations/${invitationId}/resend`)
    return response.data
  },
}
