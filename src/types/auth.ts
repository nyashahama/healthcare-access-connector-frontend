export type Role =
  | 'patient'
  | 'provider_staff'
  | 'caregiver'
  | 'clinic_admin'
  | 'system_admin'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roles: Role[]
  profileComplete: boolean
}

export interface SessionData {
  token: string
  user: User
  expiresAt: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  firstName: string
  lastName: string
  role: Role
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}
