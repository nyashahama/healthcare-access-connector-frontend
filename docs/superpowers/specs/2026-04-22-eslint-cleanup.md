# Wave A — ESLint Cleanup

## Context

The build currently requires `DISABLE_ESLINT_PLUGIN=true` to compile because the codebase contains ~100+ pre-existing ESLint warnings across legacy views and components. These warnings are entirely in code that was not touched by Waves 0–5 (backend integration hardening and integration test expansion). They fall into three categories:

1. **Unused imports and variables** (`no-unused-vars`)
2. **Missing React Hook dependencies** (`react-hooks/exhaustive-deps`)
3. **Anonymous default exports** (`import/no-anonymous-default-export`)

This wave systematically cleans up those warnings so the production build can enforce linting again.

## Goals

1. Remove `DISABLE_ESLINT_PLUGIN=true` from the build script and have `npm run build` pass cleanly.
2. Fix all ESLint errors without changing any runtime logic or UI behavior.
3. Keep the diff minimal and reviewable — only delete unused code or add missing hook dependencies.

## Scope

### In Scope

- Remove unused imports (React icons, Material Design icons, internal components)
- Remove unused variables and functions assigned but never used
- Add missing dependencies to `useEffect` and `useCallback` dependency arrays where safe
- Fix anonymous default exports by assigning to a variable first

### Out of Scope

- Refactoring hooks or components (beyond dependency array fixes)
- Adding new features
- Changing any UI text, styling, or behavior
- Fixing warnings in files that are part of the `platform/` layer (those are already clean)

## Strategy

The warnings cluster by domain. We'll clean them in batches:

1. **Shared / utils** (`routes.js`, `roleUtils.js`, `useAuth.js`)
2. **Admin views** (`admin/dashboard`, `admin/clinic-verification`, `admin/content-management`, `admin/user-management`)
3. **Auth views** (`auth/CompletePatientProfile`, `auth/ConsentSettings`, `auth/ResetPassword`, `auth/VerifyEmail`)
4. **Patient views** (`patient/appointments`, `patient/community`, `patient/dashboard`, `patient/find-clinic`, `patient/health-records`, `patient/lab-results`, `patient/medication-reminders`, `patient/prescriptions`, `patient/profile`, `patient/symptom-checker`, `patient/telemedicine-chat`)
5. **Provider views** (`provider/ClinicRegistration`, `provider/appointments`, `provider/clinic-management`, `provider/community`, `provider/components`, `provider/dashboard`, `provider/profile`)
6. **Landing / layouts**
7. **Build gate verification**

## Definition of Done

- [ ] `npm run build` passes without `DISABLE_ESLINT_PLUGIN=true`
- [ ] `npm test -- --watchAll=false` still passes (all 18 tests)
- [ ] No functional changes — only deletions of unused code and safe dependency array additions
