import type { Role } from './auth'

export interface PatientProfile {
  id: string
  userId: string
  dateOfBirth?: string
  phone?: string
  address?: string
  medicalHistory?: string
  completionPercentage: number
}

export interface ProviderProfile {
  id: string
  userId: string
  clinicId?: string
  specialization?: string
  licenseNumber?: string
}

export interface Staff {
  id: string
  userId: string
  clinicId: string
  role: Role
  staffType?: string
}

export interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  isVerified: boolean
  services?: string[]
}
