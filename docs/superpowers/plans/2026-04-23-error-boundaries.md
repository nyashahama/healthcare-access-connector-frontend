# Plan: Wave D — Error Boundaries and Crash Resilience

**Date:** 2026-04-23  
**Spec:** `docs/superpowers/specs/2026-04-23-error-boundaries.md`

---

## Task 1: Create Error Logging Hook

**Goal:** Create `useErrorLogger` for structured error logging.

**Steps:**
1. Create `src/hooks/useErrorLogger.js`
2. Export a hook that returns a log function accepting `(error, errorInfo, context)`
3. In dev mode: `console.error` with context label
4. In production: silently swallow (future integration point for Sentry/etc.)

**Verification:** Unit test that the hook logs in dev mode.

---

## Task 2: Create Fallback UI Components

**Goal:** Build reusable fallback components for error boundaries.

**Steps:**
1. Create `src/components/error-boundaries/GenericErrorFallback.jsx`
   - Title: "Something went wrong"
   - Message: "We're sorry, but an unexpected error occurred."
   - Retry button: calls `onReset` prop
   - Link to dashboard
2. Create `src/components/error-boundaries/AuthErrorFallback.jsx`
   - Title: "Authentication unavailable"
   - Retry button + link to landing page
3. Create `src/components/error-boundaries/CriticalFeatureFallback.jsx`
   - Title: "Feature temporarily unavailable"
   - Message includes feature name prop
   - Retry button + link to role dashboard
4. Create `src/components/error-boundaries/MinimalErrorFallback.jsx`
   - Small inline error for sidebar/widget areas
   - Just shows text and retry button

**Verification:** Render each fallback in isolation and assert UI elements present.

---

## Task 3: Create ErrorBoundary Component

**Goal:** Build a reusable class-based ErrorBoundary.

**Steps:**
1. Create `src/components/error-boundaries/ErrorBoundary.jsx`
   - Class component (required for React error boundaries)
   - Props: `fallback`, `onError`, `context`
   - State: `hasError`, `error`, `errorInfo`
   - `componentDidCatch`: calls `onError`, sets state
   - `resetErrorBoundary`: resets state to re-render children
   - Render: if `hasError`, render `fallback` with `onReset` and error details; else render children

**Verification:** Unit test that throws inside child renders fallback, and reset re-renders children.

---

## Task 4: Add Global Error Boundary

**Goal:** Wrap the entire app.

**Steps:**
1. Import `ErrorBoundary` and `GenericErrorFallback` in `src/index.js`
2. Wrap the `<BrowserRouter>` with `<ErrorBoundary context="global">`
3. Use `GenericErrorFallback` as fallback

**Verification:** App still renders. Build passes.

---

## Task 5: Add Route-Level Error Boundaries

**Goal:** Wrap each major route layout.

**Steps:**
1. Wrap `PatientLayout` routes with `<ErrorBoundary context="patient">` using `CriticalFeatureFallback`
2. Wrap `ProviderLayout` routes with `<ErrorBoundary context="provider">` using `CriticalFeatureFallback`
3. Wrap `AdminLayout` routes with `<ErrorBoundary context="admin">` using `CriticalFeatureFallback`
4. Wrap `AuthLayout` routes with `<ErrorBoundary context="auth">` using `AuthErrorFallback`
5. Wrap `LandingLayout` routes with `<ErrorBoundary context="landing">` using `GenericErrorFallback`

This is done by wrapping the layout component export or adding a wrapper component in `App.jsx` routes.

**Verification:** Existing integration tests still pass. Build passes.

---

## Task 6: Add Feature-Level Error Boundaries

**Goal:** Wrap the highest-risk features.

**Steps:**
1. Wrap `TelemedicineChat` (patient and provider views) with `<ErrorBoundary context="telemedicine">`
2. Wrap `Appointments` views with `<ErrorBoundary context="appointments">`
3. Wrap `ClinicManagement` with `<ErrorBoundary context="clinic-management">`

**Verification:** Existing tests pass.

---

## Task 7: Full Suite Gate

**Steps:**
1. Run `npm test -- --watchAll=false`
2. Run `npm run build`
3. Confirm both pass

**Verification:** All green.
