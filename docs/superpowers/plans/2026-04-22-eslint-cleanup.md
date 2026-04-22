# Plan: Wave A — ESLint Cleanup

**Date:** 2026-04-22  
**Spec:** `docs/superpowers/specs/2026-04-22-eslint-cleanup.md`

---

## Task 1: Fix Shared / Utils

**Files:**
- `src/routes.js` — remove unused `MdLocalHospital`
- `src/utils/roleUtils.js` — fix anonymous default export
- `src/hooks/useAuth.js` — remove unused `data`

**Verification:** `npx eslint src/routes.js src/utils/roleUtils.js src/hooks/useAuth.js` shows no errors

---

## Task 2: Fix Admin Views

**Files:**
- `src/views/admin/clinic-verification/components/SearchAndFilter.jsx` — remove unused `MdFilterList`
- `src/views/admin/clinic-verification/components/ViewDetailsModal.jsx` — remove unused `MdCalendarToday`
- `src/views/admin/clinic-verification/components/clinicUtils.js` — remove unused `MdCheckCircle`
- `src/views/admin/clinic-verification/index.jsx` — remove unused vars (`createModalOpen`, `registerClinic`, `error`, `handleRejectClick`) and fix missing hook deps
- `src/views/admin/components/RegistrationQueue.jsx` — fix missing hook dep, remove unused `isProcessing`
- `src/views/admin/content-management/index.jsx` — remove many unused icon imports
- `src/views/admin/dashboard/index.jsx` — remove unused icon imports
- `src/views/admin/user-management/index.jsx` — remove unused `FaShieldAlt`

**Verification:** `npx eslint src/views/admin/` shows no errors

---

## Task 3: Fix Auth Views

**Files:**
- `src/views/auth/CompletePatientProfile.jsx` — remove unused imports (`Link`, `FaCalendarAlt`, `FaVenusMars`), remove unused functions (`handleArrayChange`, `calculateAge`), add default case to switch
- `src/views/auth/ConsentSettings.jsx` — fix missing hook dep
- `src/views/auth/ResetPassword.jsx` — fix missing hook dep
- `src/views/auth/VerifyEmail.jsx` — fix missing hook deps

**Verification:** `npx eslint src/views/auth/` shows no errors

---

## Task 4: Fix Patient Views

**Files:**
- `src/views/patient/appointments/components/AppointmentCard.jsx` — remove unused `MdPhone`, `MdEmail`
- `src/views/patient/appointments/components/AppointmentModals.jsx` — remove unused `MdDownload`
- `src/views/patient/appointments/index.jsx` — remove unused `patient`, fix missing hook deps
- `src/views/patient/community/CommunityPost.jsx` — remove unused icon imports and `confirmShare`
- `src/views/patient/community/CreateCommunityPost.jsx` — remove unused icon imports
- `src/views/patient/components/BookAppointment.jsx` — remove unused imports and vars
- `src/views/patient/components/BookingModal.jsx` — remove unused `MdPhone`
- `src/views/patient/components/ClinicSuggestions.jsx` — remove unused imports, fix hook deps
- `src/views/patient/components/HealthTipsCarousel.jsx` — add default case
- `src/views/patient/components/UpcomingAppointments.jsx` — remove unused imports, fix hook deps
- `src/views/patient/dashboard/index.jsx` — fix missing hook deps
- `src/views/patient/find-clinic/index.jsx` — remove unused vars, fix hook deps
- `src/views/patient/health-records/index.jsx` — remove unused `showToast`
- `src/views/patient/lab-results/components/DetailsModal.jsx` — remove unused imports
- `src/views/patient/lab-results/index.jsx` — remove unused imports and `handleFileUpload`
- `src/views/patient/medication-reminders/components/DetailsModal.jsx` — remove unused `MdClose`
- `src/views/patient/medication-reminders/components/RemindersList.jsx` — remove unused `Card`
- `src/views/patient/prescriptions/index.jsx` — remove unused `Card` and `handlePrint`
- `src/views/patient/profile/components/EmergencyContact.jsx` — remove unused imports
- `src/views/patient/profile/components/MedicalInformation.jsx` — remove unused `MdDelete`
- `src/views/patient/profile/components/PrivacyData.jsx` — remove unused `MdVisibility`
- `src/views/patient/profile/index.jsx` — remove unused `Card`
- `src/views/patient/symptom-checker/components/symptomData.js` — remove unused imports
- `src/views/patient/symptom-checker/index.jsx` — remove unused `action`
- `src/views/patient/telemedicine-chat/components/ChatModals.jsx` — remove unused `MdCameraAlt`
- `src/views/patient/telemedicine-chat/index.jsx` — remove unused `cancelConsultation`, fix hook dep

**Verification:** `npx eslint src/views/patient/` shows no errors

---

## Task 5: Fix Provider Views

**Files:**
- `src/views/provider/ClinicRegistration.jsx` — remove unused `getCurrentUser`
- `src/views/provider/appointments/index.jsx` — remove unused vars, fix hook deps
- `src/views/provider/clinic-management/index.jsx` — remove unused vars
- `src/views/provider/community/CommunityPost.jsx` — remove unused imports
- `src/views/provider/community/CreateCommunityPost.jsx` — remove unused imports and vars
- `src/views/provider/community/index.jsx` — remove unused imports
- `src/views/provider/components/QuickActions.jsx` — remove unused imports
- `src/views/provider/components/RecentConsultations.jsx` — remove unused `MdPerson`
- `src/views/provider/dashboard/components/ClinicAdminDashboard.jsx` — remove unused vars, fix hook deps
- `src/views/provider/dashboard/components/DoctorDashboard.jsx` — remove unused imports, fix hook deps
- `src/views/provider/dashboard/components/ManagerDashboard.jsx` — remove unused vars, fix hook deps
- `src/views/provider/dashboard/components/NurseDashboard.jsx` — remove unused imports, fix hook deps
- `src/views/provider/dashboard/components/ReceptionistDashboard.jsx` — remove unused imports, fix hook deps
- `src/views/provider/profile/components/AppointmentSettings.jsx` — remove unused imports and vars
- `src/views/provider/profile/components/ClinicBanner.jsx` — remove unused imports
- `src/views/provider/profile/components/ClinicInformation.jsx` — remove unused imports and vars
- `src/views/provider/profile/components/Credentials.jsx` — remove unused `setCredentials`

**Verification:** `npx eslint src/views/provider/` shows no errors

---

## Task 6: Fix Landing / Layouts / Components

**Files:**
- `src/views/landing/LandingPage.jsx` — remove unused `setActiveFaq`
- `src/layouts/landing/index.jsx` — remove unused `showToast`
- `src/components/guards/PublicRoute.jsx` — remove unused `useEffect`
- `src/components/navbar/PatientNavbar.jsx` — remove unused `avatar`
- `src/components/sidebar/AdminSidebar.jsx` — remove unused `SidebarCard`
- `src/components/sidebar/PatientSidebar.jsx` — remove unused `SidebarCard`
- `src/components/sidebar/ProviderSidebar.jsx` — remove unused `SidebarCard`

**Verification:** `npx eslint src/views/landing/ src/layouts/ src/components/` shows no errors

---

## Task 7: Build Gate

**Steps:**
1. Remove `DISABLE_ESLINT_PLUGIN=true` from `package.json` build script
2. Run `npm run build`
3. Confirm zero errors
4. Run `npm test -- --watchAll=false`
5. Confirm all 18 tests still pass

**Verification:**
- `npm run build` completes with no ESLint errors
- `npm test -- --watchAll=false` → all green
