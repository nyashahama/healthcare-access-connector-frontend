import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'
import type { User, LoginPayload, RegisterPayload, SessionData } from '@/types/auth'

export const authService = {
  register: async (data: RegisterPayload): Promise<ApiResponse<SessionData>> => {
    const response = await apiClient.post<ApiResponse<SessionData>>('/api/v1/auth/register', data)
    return response.data
  },

  registerInvitedStaff: async (data: Record<string, unknown>): Promise<ApiResponse<SessionData>> => {
    const response = await apiClient.post<ApiResponse<SessionData>>('/api/v1/auth/register/staff', data)
    return response.data
  },

  login: async (credentials: LoginPayload): Promise<ApiResponse<SessionData>> => {
    const response = await apiClient.post<ApiResponse<SessionData>>('/api/v1/auth/login', credentials)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/api/v1/auth/logout')
  },

  refreshToken: async (): Promise<ApiResponse<SessionData>> => {
    const response = await apiClient.post<ApiResponse<SessionData>>('/api/v1/auth/refresh')
    return response.data
  },

  verifyEmail: async (token: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.get<ApiResponse<null>>(`/api/v1/auth/verify-email?token=${token}`)
    return response.data
  },

  requestPasswordReset: async (identifier: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/password/reset-request', { identifier })
    return response.data
  },

  resetPassword: async (data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/password/reset', data)
    return response.data
  },

  generateOTP: async (data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/otp/generate', data)
    return response.data
  },

  verifyOTP: async (data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/otp/verify', data)
    return response.data
  },

  resendVerification: async (email: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/api/v1/auth/resend-verification', { email })
    return response.data
  },

  getProfile: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/api/v1/users/${userId}`)
    return response.data
  },

  updatePassword: async (userId: string, data: Record<string, unknown>): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/users/${userId}/password`, data)
    return response.data
  },

  getConsent: async (userId: string): Promise<ApiResponse<{ consented: boolean }>> => {
    const response = await apiClient.get<ApiResponse<{ consented: boolean }>>(`/api/v1/users/${userId}/consent`)
    return response.data
  },
}
