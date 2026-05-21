import apiClient from '@/api/apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface ConsultationNote {
  id: string
  consultation_id: string
  provider_staff_id: string
  status: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  created_at: string
  updated_at: string
  finalised_at?: string
}

export const consultationNotesService = {
  createNote: async (consultationId: string): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.post<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/consultations/${consultationId}/notes`)
    return response.data
  },

  getNoteByConsultationID: async (consultationId: string): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.get<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/consultations/${consultationId}/notes`)
    return response.data
  },

  updateNote: async (consultationId: string, noteId: string, data: Record<string, unknown>): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.put<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/consultations/${consultationId}/notes/${noteId}`, data)
    return response.data
  },

  finaliseNote: async (consultationId: string, noteId: string): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.put<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/consultations/${consultationId}/notes/${noteId}/finalise`)
    return response.data
  },

  finaliseNoteByConsultation: async (consultationId: string): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.put<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/consultations/${consultationId}/notes/finalise`)
    return response.data
  },

  getNoteByID: async (noteId: string): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.get<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/notes/${noteId}`)
    return response.data
  },

  getNoteWithProviderInfo: async (consultationId: string): Promise<ApiResponse<ConsultationNote>> => {
    const response = await apiClient.get<ApiResponse<ConsultationNote>>(`/api/v1/telemedicine/consultations/${consultationId}/notes/with-provider`)
    return response.data
  },

  getProviderNoteHistory: async (params: { limit?: number; offset?: number } = {}): Promise<PaginatedResponse<ConsultationNote>> => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))
    const response = await apiClient.get<PaginatedResponse<ConsultationNote>>(`/api/v1/telemedicine/notes/history/provider/me?${queryParams}`)
    return response.data
  },

  getPatientNoteHistory: async (): Promise<ApiResponse<ConsultationNote[]>> => {
    const response = await apiClient.get<ApiResponse<ConsultationNote[]>>('/api/v1/telemedicine/notes/history/patient/me')
    return response.data
  },
}
