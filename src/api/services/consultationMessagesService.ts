import apiClient from '@/api/apiClient'
import type { ApiResponse, PaginatedResponse } from '@/types/api'

export interface ConsultationMessage {
  id: string
  consultation_id: string
  sender_id: string
  sender_role: string
  message_type: string
  content?: string
  attachment_url?: string
  attachment_type?: string
  attachment_filename?: string
  metadata?: Record<string, unknown>
  created_at: string
  read_at?: string
}

export const consultationMessagesService = {
  sendMessage: async (consultationId: string, data: Record<string, unknown>): Promise<ApiResponse<ConsultationMessage>> => {
    const response = await apiClient.post<ApiResponse<ConsultationMessage>>(`/api/v1/telemedicine/consultations/${consultationId}/messages`, data)
    return response.data
  },

  deleteMessage: async (consultationId: string, messageId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/${messageId}`)
    return response.data
  },

  insertSystemEvent: async (consultationId: string, data: Record<string, unknown>): Promise<ApiResponse<ConsultationMessage>> => {
    const response = await apiClient.post<ApiResponse<ConsultationMessage>>(`/api/v1/telemedicine/consultations/${consultationId}/events`, data)
    return response.data
  },

  getConsultationMessages: async (consultationId: string, params: { limit?: number; offset?: number } = {}): Promise<PaginatedResponse<ConsultationMessage>> => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))
    const response = await apiClient.get<PaginatedResponse<ConsultationMessage>>(`/api/v1/telemedicine/consultations/${consultationId}/messages?${queryParams}`)
    return response.data
  },

  getMessagesAfterCursor: async (consultationId: string, cursor: string): Promise<ApiResponse<ConsultationMessage[]>> => {
    const queryParams = new URLSearchParams({ cursor })
    const response = await apiClient.get<ApiResponse<ConsultationMessage[]>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/since?${queryParams}`)
    return response.data
  },

  getLastMessage: async (consultationId: string): Promise<ApiResponse<ConsultationMessage>> => {
    const response = await apiClient.get<ApiResponse<ConsultationMessage>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/last`)
    return response.data
  },

  getConsultationAttachments: async (consultationId: string): Promise<ApiResponse<ConsultationMessage[]>> => {
    const response = await apiClient.get<ApiResponse<ConsultationMessage[]>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/attachments`)
    return response.data
  },

  getSystemEvents: async (consultationId: string): Promise<ApiResponse<ConsultationMessage[]>> => {
    const response = await apiClient.get<ApiResponse<ConsultationMessage[]>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/events`)
    return response.data
  },

  markMessageRead: async (consultationId: string, messageId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/${messageId}/read`)
    return response.data
  },

  markAllProviderMessagesRead: async (consultationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/read/provider`)
    return response.data
  },

  markAllPatientMessagesRead: async (consultationId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/read/patient`)
    return response.data
  },

  countUnreadMessages: async (consultationId: string, senderRole: string): Promise<ApiResponse<{ count: number }>> => {
    const queryParams = new URLSearchParams({ sender_role: senderRole })
    const response = await apiClient.get<ApiResponse<{ count: number }>>(`/api/v1/telemedicine/consultations/${consultationId}/messages/unread-count?${queryParams}`)
    return response.data
  },
}
