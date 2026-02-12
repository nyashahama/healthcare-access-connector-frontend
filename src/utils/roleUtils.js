/**
 * Utility functions for role-based routing and access control
 */

// Define role groups
export const ROLE_GROUPS = {
  PATIENT: ["patient"],
  PROVIDER: ["provider_staff", "doctor", "nurse", "caregiver", "clinic_admin"],
  ADMIN: ["system_admin", "admin"],
};

// All valid roles in the system
export const ALL_ROLES = [
  ...ROLE_GROUPS.PATIENT,
  ...ROLE_GROUPS.PROVIDER,
  ...ROLE_GROUPS.ADMIN,
];

/**
 * Check if a role is a provider role
 * @param {string} role - The role to check
 * @returns {boolean}
 */
export const isProviderRole = (role) => {
  return ROLE_GROUPS.PROVIDER.includes(role);
};

/**
 * Check if a role is a patient role
 * @param {string} role - The role to check
 * @returns {boolean}
 */
export const isPatientRole = (role) => {
  return ROLE_GROUPS.PATIENT.includes(role);
};

/**
 * Check if a role is an admin role
 * @param {string} role - The role to check
 * @returns {boolean}
 */
export const isAdminRole = (role) => {
  return ROLE_GROUPS.ADMIN.includes(role);
};

/**
 * Get the default dashboard path for a given role
 * @param {string} role - The user's role
 * @returns {string} - The dashboard path
 */
export const getDashboardPath = (role) => {
  if (isProviderRole(role)) {
    return "/provider/dashboard";
  } else if (isAdminRole(role)) {
    return "/admin/dashboard";
  } else if (isPatientRole(role)) {
    return "/patient/dashboard";
  }
  // Default fallback
  return "/";
};

/**
 * Get a user-friendly role display name
 * @param {string} role - The role to display
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    patient: "Patient",
    provider_staff: "Provider Staff",
    doctor: "Doctor",
    nurse: "Nurse",
    caregiver: "Caregiver",
    clinic_admin: "Clinic Administrator",
    system_admin: "System Administrator",
    admin: "Administrator",
  };

  return roleNames[role] || role;
};

/**
 * Check if a user has permission to access a specific role-protected route
 * @param {string} userRole - The user's current role
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @returns {boolean}
 */
export const hasRouteAccess = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) {
    // No restrictions, everyone has access
    return true;
  }
  return allowedRoles.includes(userRole);
};

/**
 * Get role-specific greeting
 * @param {string} role - The user's role
 * @param {string} name - The user's name
 * @returns {string}
 */
export const getRoleGreeting = (role, name) => {
  const greetings = {
    doctor: `Welcome back, Dr. ${name}! 👨‍⚕️`,
    nurse: `Welcome, Nurse ${name}! 👩‍⚕️`,
    clinic_admin: `Welcome back, ${name}!`,
    patient: `Welcome, ${name}!`,
    caregiver: `Welcome, ${name}!`,
  };

  return greetings[role] || `Welcome, ${name}!`;
};

/**
 * Determine the specific provider role from staff data
 * Used to differentiate between doctor, nurse, etc.
 * @param {Object} staffData - The staff data object
 * @param {string} fallbackRole - Fallback role if specific role not found
 * @returns {string}
 */
export const getSpecificProviderRole = (
  staffData,
  fallbackRole = "provider_staff"
) => {
  if (!staffData) return fallbackRole;

  // Check if staff data has a specific role field
  if (staffData.role) {
    return staffData.role;
  }

  // Check for role indicators in staff type or position
  if (staffData.staffType) {
    const staffType = staffData.staffType.toLowerCase();
    if (staffType.includes("doctor") || staffType.includes("physician")) {
      return "doctor";
    }
    if (staffType.includes("nurse")) {
      return "nurse";
    }
    if (staffType.includes("caregiver")) {
      return "caregiver";
    }
  }

  return fallbackRole;
};

export default {
  ROLE_GROUPS,
  ALL_ROLES,
  isProviderRole,
  isPatientRole,
  isAdminRole,
  getDashboardPath,
  getRoleDisplayName,
  hasRouteAccess,
  getRoleGreeting,
  getSpecificProviderRole,
};
