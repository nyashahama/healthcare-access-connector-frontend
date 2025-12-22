import React from "react";

// Patient Views
import PatientDashboard from "views/patient/dashboard";
import FindClinic from "views/patient/find-clinic";
import SymptomChecker from "views/patient/symptom-checker";
import TelemedicineChat from "views/patient/telemedicine-chat";
import NutritionLibrary from "views/patient/nutrition-library";
import PatientProfile from "views/patient/profile";
import BookAppointment from "views/patient/components/BookAppointment";
import PatientAppointments from "views/patient/appointments";
import Prescriptions from "views/patient/prescriptions";
import LabResults from "views/patient/lab-results";
import HealthRecords from "views/patient/health-records";
import MedicationReminders from "views/patient/medication-reminders";
import CommunityForum from "views/patient/community";
import CommunityPost from "views/patient/community/CommunityPost";
import CreateCommunityPost from "views/patient/community/CreateCommunityPost";

// Provider Views
import ProviderDashboard from "views/provider/dashboard";
import AppointmentCalendar from "views/provider/appointments";
import PatientQueue from "views/provider/queue";
import ClinicManagement from "views/provider/clinic-management";
import ProviderProfile from "views/provider/profile";
import StaffManagement from "views/provider/staff-management";
import ProviderTelemedicine from "views/provider/telemedicine";
import ProviderCommunityForum from "views/provider/community";
import CreateProviderCommunityPost from "views/provider/community/CreateCommunityPost";
import ProviderCommunityPost from "views/provider/community/CommunityPost";

// Admin Views
import SystemDashboard from "views/admin/dashboard";
import ClinicVerification from "views/admin/clinic-verification";
import UserManagement from "views/admin/user-management";
import ContentManagement from "views/admin/content-management";
import Analytics from "views/admin/analytics";

// Auth Views
import SignIn from "views/auth/SignIn";
import SignUp from "views/auth/SignUp";
import ForgotPassword from "views/auth/ForgotPassword";
import ResetPassword from "views/auth/ResetPassword";
import VerifyEmail from "views/auth/VerifyEmail";
import ChangePassword from "views/auth/ChangePassword";
import ConsentSettings from "views/auth/ConsentSettings";

// Icon Imports
import {
  MdHome,
  MdLocationOn,
  MdLocalHospital,
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
} from "react-icons/md";
import { FaStethoscope } from "react-icons/fa";

// Patient Routes
export const patientRoutes = [
  {
    name: "Dashboard",
    layout: "/patient",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <PatientDashboard />,
  },
  {
    name: "Book Appointment",
    layout: "/patient",
    path: "book-appointment",
    icon: <MdCalendarToday className="h-6 w-6" />,
    component: <BookAppointment />,
  },
  {
    name: "My Appointments",
    layout: "/patient",
    path: "appointments",
    icon: <MdListAlt className="h-6 w-6" />,
    component: <PatientAppointments />,
  },
  {
    name: "Find Clinic",
    layout: "/patient",
    path: "find-clinic",
    icon: <MdLocationOn className="h-6 w-6" />,
    component: <FindClinic />,
  },
  {
    name: "Symptom Checker",
    layout: "/patient",
    path: "symptom-checker",
    icon: <FaStethoscope className="h-6 w-6" />,
    component: <SymptomChecker />,
  },
  {
    name: "Telemedicine",
    layout: "/patient",
    path: "telemedicine",
    icon: <MdChat className="h-6 w-6" />,
    component: <TelemedicineChat />,
  },
  {
    name: "Nutrition",
    layout: "/patient",
    path: "nutrition",
    icon: <MdRestaurant className="h-6 w-6" />,
    component: <NutritionLibrary />,
  },
  {
    name: "Prescriptions",
    layout: "/patient",
    path: "prescriptions",
    icon: <MdLocalPharmacy className="h-6 w-6" />,
    component: <Prescriptions />,
  },
  {
    name: "Lab Results",
    layout: "/patient",
    path: "lab-results",
    icon: <MdScience className="h-6 w-6" />,
    component: <LabResults />,
  },
  {
    name: "Health Records",
    layout: "/patient",
    path: "health-records",
    icon: <MdHealthAndSafety className="h-6 w-6" />,
    component: <HealthRecords />,
  },
  {
    name: "Medication Reminders",
    layout: "/patient",
    path: "medication-reminders",
    icon: <MdNotifications className="h-6 w-6" />,
    component: <MedicationReminders />,
  },
  {
    name: "Community Forum",
    layout: "/patient",
    path: "community",
    icon: <MdForum className="h-6 w-6" />,
    component: <CommunityForum />,
  },
  {
    name: "View Post",
    layout: "/patient",
    path: "community/post/:id",
    icon: <MdForum className="h-6 w-6" />,
    component: <CommunityPost />,
    sidebar: false,
  },
  {
    name: "Create Post",
    layout: "/patient",
    path: "community/new",
    icon: <MdForum className="h-6 w-6" />,
    component: <CreateCommunityPost />,
    sidebar: false,
  },
  {
    name: "Profile",
    layout: "/patient",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PatientProfile />,
  },
  // Hidden routes (no sidebar entry)
  {
    name: "Change Password",
    layout: "/patient",
    path: "change-password",
    icon: <MdLock className="h-6 w-6" />,
    component: <ChangePassword />,
    sidebar: false,
  },
  {
    name: "Consent Settings",
    layout: "/patient",
    path: "consent-settings",
    icon: <MdHealthAndSafety className="h-6 w-6" />,
    component: <ConsentSettings />,
    sidebar: false,
  },
];

// Provider Routes
export const providerRoutes = [
  {
    name: "Dashboard",
    layout: "/provider",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <ProviderDashboard />,
    roles: ["clinic_admin", "doctor"],
  },
  {
    name: "Appointments",
    layout: "/provider",
    path: "appointments",
    icon: <MdCalendarToday className="h-6 w-6" />,
    component: <AppointmentCalendar />,
    roles: ["clinic_admin", "doctor"],
  },
  {
    name: "Patient Queue",
    layout: "/provider",
    path: "queue",
    icon: <MdGroups className="h-6 w-6" />,
    component: <PatientQueue />,
    secondary: true,
    roles: ["clinic_admin", "doctor"],
  },
  {
    name: "Clinic Management",
    layout: "/provider",
    path: "clinic-management",
    icon: <MdBusiness className="h-6 w-6" />,
    component: <ClinicManagement />,
    roles: ["clinic_admin"],
  },
  {
    name: "Telemedicine",
    layout: "/provider",
    path: "telemedicine",
    icon: <MdChat className="h-6 w-6" />,
    component: <ProviderTelemedicine />,
    roles: ["clinic_admin", "doctor", "nurse"],
  },
  {
    name: "Staff Management",
    layout: "/provider",
    path: "staff",
    icon: <MdPeople className="h-6 w-6" />,
    component: <StaffManagement />,
    roles: ["clinic_admin"],
  },
  {
    name: "Professional Forum",
    layout: "/provider",
    path: "community",
    icon: <MdForum className="h-6 w-6" />,
    component: <ProviderCommunityForum />,
    roles: ["clinic_admin", "doctor", "nurse"],
  },
  {
    name: "View Post",
    layout: "/provider",
    path: "community/post/:id",
    icon: <MdForum className="h-6 w-6" />,
    component: <ProviderCommunityPost />,
    sidebar: false,
  },
  {
    name: "Create Post",
    layout: "/provider",
    path: "community/new",
    icon: <MdForum className="h-6 w-6" />,
    component: <CreateProviderCommunityPost />,
    sidebar: false,
  },
  {
    name: "Profile",
    layout: "/provider",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProviderProfile />,
    roles: ["clinic_admin", "doctor"],
  },
  // Hidden routes
  {
    name: "Change Password",
    layout: "/provider",
    path: "change-password",
    icon: <MdLock className="h-6 w-6" />,
    component: <ChangePassword />,
    sidebar: false,
  },
];

// Admin Routes
export const adminRoutes = [
  {
    name: "System Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdDashboard className="h-6 w-6" />,
    component: <SystemDashboard />,
  },
  {
    name: "Clinic Verification",
    layout: "/admin",
    path: "clinic-verification",
    icon: <MdVerifiedUser className="h-6 w-6" />,
    component: <ClinicVerification />,
  },
  {
    name: "User Management",
    layout: "/admin",
    path: "user-management",
    icon: <MdPeople className="h-6 w-6" />,
    component: <UserManagement />,
  },
  {
    name: "Content Management",
    layout: "/admin",
    path: "content-management",
    icon: <MdLibraryBooks className="h-6 w-6" />,
    component: <ContentManagement />,
  },
  {
    name: "Analytics & Reports",
    layout: "/admin",
    path: "analytics",
    icon: <MdAnalytics className="h-6 w-6" />,
    component: <Analytics />,
  },
];

// Auth Routes
export const authRoutes = [
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
  {
    name: "Sign Up",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignUp />,
  },
  {
    name: "Forgot Password",
    layout: "/auth",
    path: "forgot-password",
    icon: <MdLock className="h-6 w-6" />,
    component: <ForgotPassword />,
  },
  {
    name: "Reset Password",
    layout: "/auth",
    path: "reset-password",
    icon: <MdLock className="h-6 w-6" />,
    component: <ResetPassword />,
  },
  {
    name: "Verify Email",
    layout: "/auth",
    path: "verify-email",
    icon: <MdLock className="h-6 w-6" />,
    component: <VerifyEmail />,
  },
];
