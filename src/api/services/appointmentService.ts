import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'

export interface Appointment {
  id: string
  patient_id: string
  clinic_id: string
  provider_staff_id?: string
  date: string
  time: string
  status: string
  notes?: string
  reason?: string
}

export const appointmentService = {
  bookAppointment: async (data: Record<string, unknown>): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.post<ApiResponse<Appointment>>('/api/v1/appointments', data)
    return response.data
  },

  getAppointmentById: async (id: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.get<ApiResponse<Appointment>>(`/api/v1/appointments/${id}`)
    return response.data
  },

  getAppointmentsByPatient: async (patientId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/api/v1/appointments/patient/${patientId}`)
    return response.data
  },

  getAppointmentsByClinic: async (clinicId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/api/v1/appointments/clinic/${clinicId}`)
    return response.data
  },

  getAppointmentsByClinicAndDate: async (clinicId: string, date: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/api/v1/appointments/clinic/${clinicId}/date/${date}`)
    return response.data
  },

  getTodayAppointments: async (clinicId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/api/v1/appointments/clinic/${clinicId}/today`)
    return response.data
  },

  getPendingAppointments: async (clinicId: string): Promise<ApiResponse<Appointment[]>> => {
    const response = await apiClient.get<ApiResponse<Appointment[]>>(`/api/v1/appointments/clinic/${clinicId}/pending`)
    return response.data
  },

  rescheduleAppointment: async (id: string, data: Record<string, unknown>): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/reschedule`, data)
    return response.data
  },

  confirmAppointment: async (id: string, data: Record<string, unknown>): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/confirm`, data)
    return response.data
  },

  updateAppointmentNotes: async (id: string, data: Record<string, unknown>): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/notes`, data)
    return response.data
  },

  completeAppointment: async (id: string): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/complete`)
    return response.data
  },

  cancelAppointment: async (id: string, data: Record<string, unknown>): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/cancel`, data)
    return response.data
  },

  updateAppointmentStatus: async (id: string, data: Record<string, unknown>): Promise<ApiResponse<Appointment>> => {
    const response = await apiClient.put<ApiResponse<Appointment>>(`/api/v1/appointments/${id}/status`, data)
    return response.data
  },

  deleteAppointment: async (id: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/appointments/${id}`)
    return response.data
  },

  getAppointmentCount: async (patientId: string): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>(`/api/v1/appointments/patient/${patientId}/count`)
    return response.data
  },
}
