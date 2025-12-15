import React from "react";

// Patient Views
import PatientDashboard from "views/patient/dashboard";
import FindClinic from "views/patient/find-clinic";
import SymptomChecker from "views/patient/symptom-checker";
import TelemedicineChat from "views/patient/telemedicine-chat";
import NutritionLibrary from "views/patient/nutrition-library";
import PatientProfile from "views/patient/profile";
import BookAppointment from "views/patient/components/BookAppointment";

// Provider Views
import ProviderDashboard from "views/provider/dashboard";
import AppointmentCalendar from "views/provider/appointments";
import PatientQueue from "views/provider/queue";
import ClinicManagement from "views/provider/clinic-management";
import ProviderProfile from "views/provider/profile";
import StaffManagement from "views/provider/staff-management";
import ProviderTelemedicine from "views/provider/telemedicine";

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
import PatientAppointments from "views/patient/appointments";
import Prescriptions from "views/patient/prescriptions";
import LabResults from "views/patient/lab-results";

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
    component: <PatientAppointments />, // NEW
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
    name: "Prescriptions", // NEW
    layout: "/patient",
    path: "prescriptions",
    icon: <MdLocalPharmacy className="h-6 w-6" />,
    component: <Prescriptions />,
  },
  {
    name: "Lab Results", // NEW
    layout: "/patient",
    path: "lab-results",
    icon: <MdScience className="h-6 w-6" />,
    component: <LabResults />,
  },
  {
    name: "Health Records", // NEW
    layout: "/patient",
    path: "health-records",
    icon: <MdHealthAndSafety className="h-6 w-6" />,
    //component: <HealthRecords />,
  },
  {
    name: "Medication Reminders", // NEW
    layout: "/patient",
    path: "medication-reminders",
    icon: <MdNotifications className="h-6 w-6" />,
    //component: <MedicationReminders />,
  },
  {
    name: "Community Forum", // NEW
    layout: "/patient",
    path: "community",
    icon: <MdForum className="h-6 w-6" />,
    //component: <CommunityForum />,
  },
  {
    name: "Profile",
    layout: "/patient",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <PatientProfile />,
  },
];

// Provider Routes (Clinic Admin sees different dashboard than Doctor)
export const providerRoutes = [
  {
    name: "Dashboard",
    layout: "/provider",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <ProviderDashboard />, // Shows different dashboard based on role
    roles: ["clinic_admin", "doctor"], // Both can see but content differs
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
    roles: ["clinic_admin"], // Only clinic admin can see
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
    component: <StaffManagement />, // New component for managing staff
    roles: ["clinic_admin"], // Only clinic admin can see
  },
  {
    name: "Profile",
    layout: "/provider",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <ProviderProfile />,
    roles: ["clinic_admin", "doctor"],
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
];
