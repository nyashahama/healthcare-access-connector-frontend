import apiClient from '@/api/apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface Consultation {
  id: string
  symptom_session_id: string
  patient_id: string
  provider_staff_id?: string
  clinic_id?: string
  channel: string
  status: string
  consultation_fee?: number
  fee_currency?: string
  rating?: number
  feedback?: string
  payment_status?: string
  payment_reference?: string
  follow_up_appointment_id?: string
  created_at: string
  updated_at: string
}

export const consultationService = {
  requestConsultation: async (data: Record<string, unknown>): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.post<ApiResponse<Consultation>>('/api/v1/telemedicine/consultations', data)
    return response.data
  },

  getPatientActiveConsultation: async (): Promise<ApiResponse<Consultation | null>> => {
    const response = await apiClient.get<ApiResponse<Consultation | null>>('/api/v1/telemedicine/consultations/me/active')
    return response.data
  },

  getPatientConsultations: async (params: { limit?: number; offset?: number } = {}): Promise<PaginatedResponse<Consultation>> => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))
    const response = await apiClient.get<PaginatedResponse<Consultation>>(`/api/v1/telemedicine/consultations/me/history?${queryParams}`)
    return response.data
  },

  cancelConsultation: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.put<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}/cancel`)
    return response.data
  },

  submitPatientRating: async (consultationId: string, data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/rating`, data)
    return response.data
  },

  getConsultationByID: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.get<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}`)
    return response.data
  },

  getConsultationWithDetails: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.get<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}/details`)
    return response.data
  },

  updateConsultationChannel: async (consultationId: string, data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/channel`, data)
    return response.data
  },

  acceptConsultation: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.put<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}/accept`)
    return response.data
  },

  startConsultation: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.put<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}/start`)
    return response.data
  },

  completeConsultation: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.put<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}/complete`)
    return response.data
  },

  escalateConsultation: async (consultationId: string): Promise<ApiResponse<Consultation>> => {
    const response = await apiClient.put<ApiResponse<Consultation>>(`/api/v1/telemedicine/consultations/${consultationId}/escalate`)
    return response.data
  },

  declineConsultation: async (consultationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/decline`)
    return response.data
  },

  markNoShow: async (consultationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/no-show`)
    return response.data
  },

  getProviderActiveConsultations: async (): Promise<ApiResponse<Consultation[]>> => {
    const response = await apiClient.get<ApiResponse<Consultation[]>>('/api/v1/telemedicine/consultations/provider/active')
    return response.data
  },

  getProviderConsultationHistory: async (params: { limit?: number; offset?: number } = {}): Promise<PaginatedResponse<Consultation>> => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))
    const response = await apiClient.get<PaginatedResponse<Consultation>>(`/api/v1/telemedicine/consultations/provider/history?${queryParams}`)
    return response.data
  },

  getWaitingRoom: async (): Promise<ApiResponse<Consultation[]>> => {
    const response = await apiClient.get<ApiResponse<Consultation[]>>('/api/v1/telemedicine/consultations/waiting-room')
    return response.data
  },

  updatePaymentStatus: async (consultationId: string, data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/payment`, data)
    return response.data
  },

  linkFollowUpAppointment: async (consultationId: string, data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/follow-up`, data)
    return response.data
  },
}
