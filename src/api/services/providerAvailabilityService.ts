import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'

export interface ProviderAvailability {
  id: string
  provider_staff_id: string
  status: string
  is_online: boolean
  is_accepting: boolean
  estimated_wait_minutes?: number
  consultation_fee_override?: number
  status_message?: string
  last_heartbeat_at?: string
  created_at: string
  updated_at: string
}

export const providerAvailabilityService = {
  getAvailableProviders: async (params: { clinic_id?: string } = {}): Promise<ApiResponse<ProviderAvailability[]>> => {
    const queryParams = new URLSearchParams()
    if (params.clinic_id) queryParams.append('clinic_id', params.clinic_id)
    const response = await apiClient.get<ApiResponse<ProviderAvailability[]>>(`/api/v1/telemedicine/providers/available?${queryParams}`)
    return response.data
  },

  getAvailableProvidersBySpecialization: async (specialization: string): Promise<ApiResponse<ProviderAvailability[]>> => {
    const queryParams = new URLSearchParams({ specialization })
    const response = await apiClient.get<ApiResponse<ProviderAvailability[]>>(`/api/v1/telemedicine/providers/available/specialization?${queryParams}`)
    return response.data
  },

  goOnline: async (): Promise<ApiResponse<ProviderAvailability>> => {
    const response = await apiClient.put<ApiResponse<ProviderAvailability>>('/api/v1/telemedicine/providers/me/online')
    return response.data
  },

  goOffline: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/api/v1/telemedicine/providers/me/offline')
    return response.data
  },

  setAccepting: async (data: Record<string, unknown>): Promise<ApiResponse<ProviderAvailability>> => {
    const response = await apiClient.put<ApiResponse<ProviderAvailability>>('/api/v1/telemedicine/providers/me/accepting', data)
    return response.data
  },

  updateStatus: async (data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/api/v1/telemedicine/providers/me/status', data)
    return response.data
  },

  updateWaitTime: async (minutes: number): Promise<ApiResponse<null>> => {
    const queryParams = new URLSearchParams({ minutes: String(minutes) })
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/providers/me/wait-time?${queryParams}`)
    return response.data
  },

  sendHeartbeat: async (): Promise<void> => {
    await apiClient.post('/api/v1/telemedicine/providers/me/heartbeat')
  },

  getMyAvailability: async (): Promise<ApiResponse<ProviderAvailability>> => {
    const response = await apiClient.get<ApiResponse<ProviderAvailability>>('/api/v1/telemedicine/providers/me/availability')
    return response.data
  },

  getStaleProviders: async (): Promise<ApiResponse<ProviderAvailability[]>> => {
    const response = await apiClient.get<ApiResponse<ProviderAvailability[]>>('/api/v1/telemedicine/providers/stale')
    return response.data
  },

  setStaleProvidersOffline: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>('/api/v1/telemedicine/providers/stale/offline')
    return response.data
  },
}
