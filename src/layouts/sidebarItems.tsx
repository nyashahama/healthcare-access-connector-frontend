import React from 'react'
import {
  MdHome,
  MdLocationOn,
  MdChat,
  MdRestaurant,
  MdPerson,
  MdCalendarToday,
  MdGroups,
  MdBusiness,
  MdDashboard,
  MdVerifiedUser,
  MdPeople,
  MdLibraryBooks,
  MdAnalytics,
  MdLock,
  MdListAlt,
  MdLocalPharmacy,
  MdScience,
  MdHealthAndSafety,
  MdNotifications,
  MdForum,
} from 'react-icons/md'
import { FaStethoscope, FaHospital } from 'react-icons/fa'

export interface SidebarItem {
  name: string
  layout: string
  path: string
  icon: React.ReactNode
  sidebar?: boolean
  secondary?: boolean
  roles?: string[]
}

export const patientSidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    layout: '/patient',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
  },
  {
    name: 'Book Appointment',
    layout: '/patient',
    path: 'book-appointment',
    icon: <MdCalendarToday className="h-6 w-6" />,
  },
  {
    name: 'My Appointments',
    layout: '/patient',
    path: 'appointments',
    icon: <MdListAlt className="h-6 w-6" />,
  },
  {
    name: 'Find Clinic',
    layout: '/patient',
    path: 'find-clinic',
    icon: <MdLocationOn className="h-6 w-6" />,
  },
  {
    name: 'Symptom Checker',
    layout: '/patient',
    path: 'symptom-checker',
    icon: <FaStethoscope className="h-6 w-6" />,
  },
  {
    name: 'Telemedicine',
    layout: '/patient',
    path: 'telemedicine',
    icon: <MdChat className="h-6 w-6" />,
  },
  {
    name: 'Nutrition',
    layout: '/patient',
    path: 'nutrition',
    icon: <MdRestaurant className="h-6 w-6" />,
  },
  {
    name: 'Prescriptions',
    layout: '/patient',
    path: 'prescriptions',
    icon: <MdLocalPharmacy className="h-6 w-6" />,
  },
  {
    name: 'Lab Results',
    layout: '/patient',
    path: 'lab-results',
    icon: <MdScience className="h-6 w-6" />,
  },
  {
    name: 'Health Records',
    layout: '/patient',
    path: 'health-records',
    icon: <MdHealthAndSafety className="h-6 w-6" />,
  },
  {
    name: 'Medication Reminders',
    layout: '/patient',
    path: 'medication-reminders',
    icon: <MdNotifications className="h-6 w-6" />,
  },
  {
    name: 'Community Forum',
    layout: '/patient',
    path: 'community',
    icon: <MdForum className="h-6 w-6" />,
  },
  {
    name: 'View Post',
    layout: '/patient',
    path: 'community/post/:id',
    icon: <MdForum className="h-6 w-6" />,
    sidebar: false,
  },
  {
    name: 'Create Post',
    layout: '/patient',
    path: 'community/new',
    icon: <MdForum className="h-6 w-6" />,
    sidebar: false,
  },
  {
    name: 'Profile',
    layout: '/patient',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
  },
  {
    name: 'Change Password',
    layout: '/patient',
    path: 'change-password',
    icon: <MdLock className="h-6 w-6" />,
    sidebar: false,
  },
  {
    name: 'Consent Settings',
    layout: '/patient',
    path: 'consent-settings',
    icon: <MdHealthAndSafety className="h-6 w-6" />,
    sidebar: false,
  },
]

export const providerSidebarItems: SidebarItem[] = [
  {
    name: 'Dashboard',
    layout: '/provider',
    path: 'dashboard',
    icon: <MdHome className="h-6 w-6" />,
    roles: ['clinic_admin', 'provider_staff', 'caregiver'],
  },
  {
    name: 'Appointments',
    layout: '/provider',
    path: 'appointments',
    icon: <MdCalendarToday className="h-6 w-6" />,
    roles: ['clinic_admin', 'provider_staff'],
  },
  {
    name: 'Patient Queue',
    layout: '/provider',
    path: 'queue',
    icon: <MdGroups className="h-6 w-6" />,
    secondary: true,
    roles: ['clinic_admin', 'provider_staff'],
  },
  {
    name: 'Clinic Management',
    layout: '/provider',
    path: 'clinic-management',
    icon: <MdBusiness className="h-6 w-6" />,
    roles: ['clinic_admin'],
  },
  {
    name: 'Telemedicine',
    layout: '/provider',
    path: 'telemedicine',
    icon: <MdChat className="h-6 w-6" />,
    roles: ['clinic_admin', 'provider_staff', 'caregiver'],
  },
  {
    name: 'Staff Management',
    layout: '/provider',
    path: 'staff',
    icon: <MdPeople className="h-6 w-6" />,
    roles: ['clinic_admin'],
  },
  {
    name: 'Professional Forum',
    layout: '/provider',
    path: 'community',
    icon: <MdForum className="h-6 w-6" />,
    roles: ['clinic_admin', 'provider_staff', 'caregiver'],
  },
  {
    name: 'View Post',
    layout: '/provider',
    path: 'community/post/:id',
    icon: <MdForum className="h-6 w-6" />,
    sidebar: false,
  },
  {
    name: 'Create Post',
    layout: '/provider',
    path: 'community/new',
    icon: <MdForum className="h-6 w-6" />,
    sidebar: false,
  },
  {
    name: 'Profile',
    layout: '/provider',
    path: 'profile',
    icon: <MdPerson className="h-6 w-6" />,
    roles: ['clinic_admin', 'provider_staff', 'caregiver'],
  },
  {
    name: 'Clinic Registration',
    layout: '/provider',
    path: 'clinic-registration',
    icon: <FaHospital className="h-6 w-6" />,
    sidebar: false,
    roles: ['clinic_admin'],
  },
  {
    name: 'Change Password',
    layout: '/provider',
    path: 'change-password',
    icon: <MdLock className="h-6 w-6" />,
    sidebar: false,
  },
]

export const adminSidebarItems: SidebarItem[] = [
  {
    name: 'System Dashboard',
    layout: '/admin',
    path: 'dashboard',
    icon: <MdDashboard className="h-6 w-6" />,
  },
  {
    name: 'Clinic Verification',
    layout: '/admin',
    path: 'clinic-verification',
    icon: <MdVerifiedUser className="h-6 w-6" />,
  },
  {
    name: 'User Management',
    layout: '/admin',
    path: 'user-management',
    icon: <MdPeople className="h-6 w-6" />,
  },
  {
    name: 'Content Management',
    layout: '/admin',
    path: 'content-management',
    icon: <MdLibraryBooks className="h-6 w-6" />,
  },
  {
    name: 'Analytics & Reports',
    layout: '/admin',
    path: 'analytics',
    icon: <MdAnalytics className="h-6 w-6" />,
  },
]

export function getActiveRouteName(
  items: SidebarItem[],
  pathname: string,
  defaultValue: string
): string {
  for (const item of items) {
    const fullPath = `${item.layout}/${item.path}`
    if (pathname.includes(fullPath)) {
      return item.name
    }
  }
  return defaultValue
}
