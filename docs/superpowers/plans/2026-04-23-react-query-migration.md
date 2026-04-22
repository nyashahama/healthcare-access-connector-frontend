# Plan: Wave C — Complete Domain Hook Migration to React Query

**Date:** 2026-04-23  
**Spec:** `docs/superpowers/specs/2026-04-23-react-query-migration.md`

---

## Task 1: Expand Query Keys

**Goal:** Add query keys for all remaining domains.

**Steps:**
1. Read `src/platform/query/queryKeys.js`
2. Add keys for: admin, appointment, consultation, staff, symptom

**Verification:** File exports all required keys with no syntax errors.

---

## Task 2: Migrate useAppointment

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useAppointment.js`
2. Replace `useState` data with `useQuery` for list and detail
3. Replace manual POST/PUT/DELETE with `useMutation`
4. Invalidate list on create/cancel/update
5. Preserve public API: `fetchAppointments`, `createAppointment`, `cancelAppointment`, `appointments`, `loading`, `error`

**Verification:** `npm test -- --watchAll=false src/hooks/__tests__/useAppointment.test.jsx` passes.

---

## Task 3: Migrate useConsultation

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useConsultation.js`
2. Replace `useState` for active/current consultations with `useQuery`
3. Replace request/cancel/complete/rate with `useMutation`
4. Invalidate on mutations
5. Preserve public API

**Verification:** Existing telemedicine integration tests still pass.

---

## Task 4: Migrate useConsultationMessages

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useConsultationMessages.js`
2. Replace messages state with `useQuery` keyed by consultation ID
3. Replace sendMessage with `useMutation`
4. Preserve `fetchMessages`, `sendMessage`, `messages`, `loading`, `error`, `clearMessages`

**Verification:** Existing telemedicine integration tests still pass.

---

## Task 5: Migrate useConsultationNotes

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useConsultationNotes.js`
2. Replace note state with `useQuery`
3. Replace create/update/finalise with `useMutation`
4. Preserve public API

**Verification:** Existing tests pass.

---

## Task 6: Migrate useAdmin

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useAdmin.js`
2. Replace profile, permissions, stats, lists with `useQuery`
3. Replace actions with `useMutation`
4. Preserve public API

**Verification:** Existing tests pass.

---

## Task 7: Migrate useStaff

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useStaff.js`
2. Replace staff list with `useQuery`
3. Replace invite/update/deactivate with `useMutation`
4. Preserve public API

**Verification:** Existing tests pass.

---

## Task 8: Migrate useSymptomChecker

**Goal:** Convert to query-backed facade.

**Steps:**
1. Read `src/hooks/useSymptomChecker.js`
2. Replace symptom data/history with `useQuery`
3. Replace check/submit with `useMutation`
4. Preserve public API

**Verification:** Existing tests pass.

---

## Task 9: Full Suite Gate

**Steps:**
1. Run `npm test -- --watchAll=false`
2. Run `npm run build`
3. Confirm both pass

**Verification:** All green.
