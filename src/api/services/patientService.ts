import apiClient from '@/api/apiClient'
import { sessionManager } from '@/platform/auth/sessionManager'
import type { ApiResponse } from '@/types/api'

const getCurrentUserId = (): string => {
  const userId = sessionManager.hydrate()?.user?.id
  if (!userId) {
    throw new Error('Current user is not available')
  }
  return userId
}

export interface PatientProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  preferred_name?: string
  date_of_birth?: string
  gender?: string
  preferred_gender_pronouns?: string
  country: string
  primary_address?: string
  city?: string
  province?: string
  preferred_communication_method: string
  timezone: string
  language_preferences?: string[]
  home_language?: string
  national_id_number?: string
  has_medical_aid?: boolean
  medical_aid_number?: string
  medical_aid_provider?: string
  employment_status?: string
  education_level?: string
  household_income_range?: string
  profile_picture_url?: string
  accepts_marketing_emails?: boolean
  requires_interpreter?: boolean
  created_at: string
  updated_at: string
}

export interface PatientSearchParams {
  query?: string
  province?: string
  city?: string
  has_medical_aid?: boolean
  gender?: string
  communication_method?: string
  employment_status?: string
  medical_aid_provider?: string
  requires_interpreter?: boolean
  accepts_marketing_emails?: boolean
  limit?: number
  offset?: number
}

export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

export const patientService = {
  createPatientProfile: async (data: Record<string, unknown>): Promise<ApiResponse<PatientProfile>> => {
    const response = await apiClient.post<ApiResponse<PatientProfile>>('/api/v1/patients', data)
    return response.data
  },

  getPatientProfile: async (patientId: string): Promise<ApiResponse<PatientProfile>> => {
    const response = await apiClient.get<ApiResponse<PatientProfile>>(`/api/v1/patients/${patientId}`)
    return response.data
  },

  getPatientProfileByUserId: async (userId: string): Promise<ApiResponse<PatientProfile>> => {
    const response = await apiClient.get<ApiResponse<PatientProfile>>(`/api/v1/patients/user/${userId}`)
    return response.data
  },

  getPatientByNationalId: async (nationalId: string): Promise<ApiResponse<PatientProfile>> => {
    const response = await apiClient.get<ApiResponse<PatientProfile>>(`/api/v1/patients/national-id/${nationalId}`)
    return response.data
  },

  updatePatientProfile: async (patientId: string, data: Record<string, unknown>): Promise<ApiResponse<PatientProfile>> => {
    const response = await apiClient.put<ApiResponse<PatientProfile>>(`/api/v1/patients/${patientId}`, data)
    return response.data
  },

  deletePatientProfile: async (patientId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/patients/${patientId}`)
    return response.data
  },

  deletePatientProfileByUserId: async (userId: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.delete<ApiResponse<null>>(`/api/v1/patients/user/${userId}`)
    return response.data
  },

  searchPatients: async (params: PatientSearchParams = {}): Promise<ApiResponse<PatientProfile[]>> => {
    const queryParams = new URLSearchParams()

    Object.keys(params).forEach((key) => {
      const value = params[key as keyof PatientSearchParams]
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value))
      }
    })

    const response = await apiClient.get<ApiResponse<PatientProfile[]>>(`/api/v1/patients/search?${queryParams.toString()}`)
    return response.data
  },

  getDemographicsSummary: async (): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>('/api/v1/patients/demographics')
    return response.data
  },

  getCurrentPatientProfile: async (): Promise<ApiResponse<PatientProfile>> => {
    return patientService.getPatientProfileByUserId(getCurrentUserId())
  },

  upsertPatientProfile: async (data: Record<string, unknown>): Promise<ApiResponse<PatientProfile>> => {
    return patientService.createPatientProfile(data)
  },

  calculateProfileCompletion: (profile: PatientProfile | null): number => {
    if (!profile) return 0

    const requiredFields = [
      'first_name',
      'last_name',
      'country',
      'preferred_communication_method',
      'timezone',
    ]

    const optionalFields = [
      'preferred_name',
      'date_of_birth',
      'gender',
      'preferred_gender_pronouns',
      'primary_address',
      'city',
      'province',
      'language_preferences',
      'home_language',
      'medical_aid_number',
      'medical_aid_provider',
      'national_id_number',
      'employment_status',
      'education_level',
      'household_income_range',
      'profile_picture_url',
    ]

    let completed = 0
    const total = requiredFields.length + optionalFields.length * 0.5

    requiredFields.forEach((field) => {
      const value = profile[field as keyof PatientProfile]
      if (value && (typeof value === 'string' ? (value as string).trim() : true)) {
        completed += 1
      }
    })

    optionalFields.forEach((field) => {
      const value = profile[field as keyof PatientProfile]
      if (value && (typeof value === 'string' ? (value as string).trim() : true)) {
        completed += 0.5
      }
    })

    if (profile.has_medical_aid) {
      if (profile.medical_aid_number && profile.medical_aid_number.trim()) completed += 0.5
      if (profile.medical_aid_provider && profile.medical_aid_provider.trim()) completed += 0.5
    }

    if (profile.language_preferences && profile.language_preferences.length > 0) {
      completed += 0.5
    }

    return Math.min(Math.round((completed / total) * 100), 100)
  },

  validatePatientProfile: (data: Record<string, unknown>): ValidationResult => {
    const errors: Record<string, string> = {}

    if (!(data.first_name as string)?.trim()) {
      errors.first_name = 'First name is required'
    }

    if (!(data.last_name as string)?.trim()) {
      errors.last_name = 'Last name is required'
    }

    if (!(data.country as string)?.trim()) {
      errors.country = 'Country is required'
    }

    if (!(data.preferred_communication_method as string)?.trim()) {
      errors.preferred_communication_method = 'Preferred communication method is required'
    }

    if (!(data.timezone as string)?.trim()) {
      errors.timezone = 'Timezone is required'
    }

    if ((data.national_id_number as string) && (data.national_id_number as string).length < 13) {
      errors.national_id_number = 'National ID must be at least 13 characters'
    }

    if (data.has_medical_aid) {
      if (!(data.medical_aid_number as string)?.trim()) {
        errors.medical_aid_number = 'Medical aid number is required when has medical aid is selected'
      }
      if (!(data.medical_aid_provider as string)?.trim()) {
        errors.medical_aid_provider = 'Medical aid provider is required when has medical aid is selected'
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    }
  },

  getAllergies: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/allergies/patient/${patientId}`)
    return response.data
  },
  getActiveAllergies: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/allergies/patient/${patientId}/active`)
    return response.data
  },

  getConditions: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/conditions/patient/${patientId}`)
    return response.data
  },
  getActiveConditions: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/conditions/patient/${patientId}/active`)
    return response.data
  },

  getMedications: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/medications/patient/${patientId}`)
    return response.data
  },
  getActiveMedications: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/medications/patient/${patientId}/active`)
    return response.data
  },

  getSurgeries: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/surgeries/patient/${patientId}`)
    return response.data
  },

  getMedicalInfo: async (patientId: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/api/v1/patients/medical-info/patient/${patientId}`)
    return response.data
  },

  getEmergencyContacts: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/emergency-contacts/patient/${patientId}`)
    return response.data
  },

  getDependents: async (patientId: string): Promise<ApiResponse<unknown[]>> => {
    const response = await apiClient.get<ApiResponse<unknown[]>>(`/api/v1/patients/dependents/patient/${patientId}`)
    return response.data
  },

  getNotificationPreferences: async (userId: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/api/v1/notifications/users/${userId}/preferences`)
    return response.data
  },
  updateNotificationPreferences: async (userId: string, data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.put<ApiResponse<Record<string, unknown>>>(`/api/v1/notifications/users/${userId}/preferences`, data)
    return response.data
  },

  getConsent: async (userId: string): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/api/v1/consent/users/${userId}/privacy`)
    return response.data
  },
  updateConsent: async (userId: string, data: Record<string, unknown>): Promise<ApiResponse<Record<string, unknown>>> => {
    const response = await apiClient.put<ApiResponse<Record<string, unknown>>>(`/api/v1/consent/users/${userId}/privacy`, data)
    return response.data
  },
}
