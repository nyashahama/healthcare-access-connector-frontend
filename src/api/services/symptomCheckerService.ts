import apiClient from '@/api/apiClient'
import type { ApiResponse } from '@/types/api'

export interface SymptomSession {
  id: string
  patient_id: string
  chief_complaint: string
  symptoms_reported: string[]
  symptom_duration?: string
  body_systems_affected?: string[]
  severity_score?: number
  is_for_dependent: boolean
  dependent_id?: string
  raw_answers?: Record<string, unknown>
  triage_level?: string
  outcome?: string
  status: string
  created_at: string
  updated_at: string
}

export interface TriageQueryParams {
  triage_level: string
  from: string
  to: string
  limit?: number
  offset?: number
}

export interface OutcomeQueryParams {
  from: string
  to: string
}

export const symptomCheckerService = {
  submitSession: async (data: Record<string, unknown>): Promise<ApiResponse<SymptomSession>> => {
    const response = await apiClient.post<ApiResponse<SymptomSession>>('/api/v1/telemedicine/symptom-checker/sessions', data)
    return response.data
  },

  getSessionById: async (sessionId: string): Promise<ApiResponse<SymptomSession>> => {
    const response = await apiClient.get<ApiResponse<SymptomSession>>(`/api/v1/telemedicine/symptom-checker/sessions/${sessionId}`)
    return response.data
  },

  abandonSession: async (sessionId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/symptom-checker/sessions/${sessionId}/abandon`)
    return response.data
  },

  markSessionConverted: async (sessionId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.put<ApiResponse<null>>(`/api/v1/telemedicine/symptom-checker/sessions/${sessionId}/convert`)
    return response.data
  },

  getPatientSessions: async (params: { limit?: number; offset?: number } = {}): Promise<ApiResponse<SymptomSession[]>> => {
    const queryParams = new URLSearchParams()
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))
    const response = await apiClient.get<ApiResponse<SymptomSession[]>>(`/api/v1/telemedicine/symptom-checker/patients/me/sessions?${queryParams.toString()}`)
    return response.data
  },

  getLatestEligibleSession: async (): Promise<ApiResponse<SymptomSession>> => {
    const response = await apiClient.get<ApiResponse<SymptomSession>>('/api/v1/telemedicine/symptom-checker/patients/me/eligible-session')
    return response.data
  },

  getDependentSessions: async (dependentId: string): Promise<ApiResponse<SymptomSession[]>> => {
    const response = await apiClient.get<ApiResponse<SymptomSession[]>>(`/api/v1/telemedicine/symptom-checker/patients/me/dependents/${dependentId}/sessions`)
    return response.data
  },

  getSessionWithPatientContext: async (sessionId: string): Promise<ApiResponse<SymptomSession>> => {
    const response = await apiClient.get<ApiResponse<SymptomSession>>(`/api/v1/telemedicine/symptom-checker/sessions/${sessionId}/patient-context`)
    return response.data
  },

  getSessionsByTriageLevel: async (params: TriageQueryParams): Promise<ApiResponse<SymptomSession[]>> => {
    const queryParams = new URLSearchParams()
    queryParams.append('triage_level', params.triage_level)
    queryParams.append('from', params.from)
    queryParams.append('to', params.to)
    if (params.limit) queryParams.append('limit', String(params.limit))
    if (params.offset) queryParams.append('offset', String(params.offset))
    const response = await apiClient.get<ApiResponse<SymptomSession[]>>(`/api/v1/telemedicine/symptom-checker/admin/sessions/triage?${queryParams.toString()}`)
    return response.data
  },

  countSessionsByOutcome: async (params: OutcomeQueryParams): Promise<ApiResponse<Record<string, number>>> => {
    const queryParams = new URLSearchParams()
    queryParams.append('from', params.from)
    queryParams.append('to', params.to)
    const response = await apiClient.get<ApiResponse<Record<string, number>>>(`/api/v1/telemedicine/symptom-checker/admin/sessions/outcome-counts?${queryParams.toString()}`)
    return response.data
  },
}
