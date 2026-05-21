import type { Role } from '@/types/auth'

export const ROLE_GROUPS: Record<string, Role[]> = {
  PATIENT: ['patient'],
  PROVIDER: ['provider_staff', 'caregiver', 'clinic_admin'],
  ADMIN: ['system_admin'],
}

export const ALL_ROLES: Role[] = [
  ...ROLE_GROUPS.PATIENT,
  ...ROLE_GROUPS.PROVIDER,
  ...ROLE_GROUPS.ADMIN,
]

export const isProviderRole = (role: string): boolean =>
  ROLE_GROUPS.PROVIDER.includes(role as Role)

export const isPatientRole = (role: string): boolean =>
  ROLE_GROUPS.PATIENT.includes(role as Role)

export const isAdminRole = (role: string): boolean =>
  ROLE_GROUPS.ADMIN.includes(role as Role)

export const getDashboardPath = (role: string): string => {
  if (isProviderRole(role)) return '/provider/dashboard'
  if (isAdminRole(role)) return '/admin/dashboard'
  if (isPatientRole(role)) return '/patient/dashboard'
  return '/'
}

const roleNames: Record<string, string> = {
  patient: 'Patient',
  provider_staff: 'Provider Staff',
  doctor: 'Doctor',
  nurse: 'Nurse',
  caregiver: 'Caregiver',
  clinic_admin: 'Clinic Administrator',
  system_admin: 'System Administrator',
  admin: 'Administrator',
}

export const getRoleDisplayName = (role: string): string =>
  roleNames[role] || role

export const hasRouteAccess = (userRole: string | null, allowedRoles: string[]): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true
  if (!userRole) return false
  return allowedRoles.includes(userRole)
}

const greetings: Record<string, string> = {
  doctor: 'Welcome back, Dr. {name}! 👨‍⚕️',
  nurse: 'Welcome, Nurse {name}! 👩‍⚕️',
  clinic_admin: 'Welcome back, {name}!',
  patient: 'Welcome, {name}!',
  caregiver: 'Welcome, {name}!',
}

export const getRoleGreeting = (role: string, name: string): string => {
  const template = greetings[role] || 'Welcome, {name}!'
  return template.replace('{name}', name)
}

interface StaffData {
  role?: string
  staffType?: string
}

export const getSpecificProviderRole = (
  staffData: StaffData | null,
  fallbackRole = 'provider_staff',
): string => {
  if (!staffData) return fallbackRole
  if (staffData.role) return staffData.role
  if (staffData.staffType) {
    const staffType = staffData.staffType.toLowerCase()
    if (staffType.includes('doctor') || staffType.includes('physician')) return 'doctor'
    if (staffType.includes('nurse')) return 'nurse'
    if (staffType.includes('caregiver')) return 'caregiver'
  }
  return fallbackRole
}
