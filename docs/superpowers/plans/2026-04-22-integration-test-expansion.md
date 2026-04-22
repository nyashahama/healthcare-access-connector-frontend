# Plan: Wave B — Integration Test Expansion

**Date:** 2026-04-22  
**Spec:** `docs/superpowers/specs/2026-04-22-integration-test-expansion.md`

---

## Task 1: Add Domain MSW Handlers

**Goal:** Create reusable MSW request handlers so integration tests mock the backend at the network layer.

**Steps:**

1. Create `src/test/handlers/auth.js`:
   - Handler for `POST /api/v1/auth/login` → returns `{ token, user, expires_at }` on valid credentials; returns `{ error: "Invalid credentials" }` with status 401 on invalid credentials.
   - Handler for `POST /api/v1/auth/logout` → returns 204.
2. Create `src/test/handlers/patient.js`:
   - Handler for `GET /api/v1/patients/patients/me` → returns a complete or incomplete patient profile depending on a query param or header (use a mutable fixture).
3. Create `src/test/handlers/provider.js`:
   - Handler for `GET /api/v1/providers/clinics/my-clinic` → returns a clinic or 404 depending on a mutable fixture.
4. Create `src/test/handlers/consultation.js`:
   - Handler for `GET /api/v1/telemedicine/consultations/:id` → returns a consultation object.
   - Handler for `GET /api/v1/telemedicine/consultations/:id/messages` → returns a paginated message list.
5. Update `src/test/handlers/index.js` to import and export all domain handlers.

**Verification:**

- `npm test -- --watchAll=false src/test/handlers/` (or any test using the handlers) passes.
- No inline `jest.mock` for `apiClient` or service modules in integration tests — MSW intercepts at the fetch layer.

---

## Task 2: Sign-In Flow Integration Tests

**Goal:** Cover sign-in success and failure end-to-end.

**Steps:**

1. Create `src/views/auth/__tests__/SignIn.integration.test.jsx`.
2. Render `<SignIn />` wrapped in `MemoryRouter`, `AuthProvider`, and `QueryClientProvider`.
3. Use `msw` handler from Task 1 to mock login responses.
4. **Success case:**
   - Fill email and password inputs.
   - Click submit.
   - Assert `sessionManager` stored the token.
   - Assert navigation redirected to the patient dashboard.
5. **Failure case:**
   - Submit invalid credentials.
   - Assert error toast/message is visible.
   - Assert URL remains `/auth/sign-in`.

**Verification:**

- `npm test -- --watchAll=false src/views/auth/__tests__/SignIn.integration.test.jsx` passes.

---

## Task 3: Unauthorized Session Expiry Integration Test

**Goal:** Verify 401 responses clear the session and show recovery UI.

**Steps:**

1. Create `src/views/patient/__tests__/SessionExpiry.integration.test.jsx`.
2. Pre-seed `sessionManager` with a valid token and user.
3. Render a protected route (e.g., `<PatientDashboard />` or a minimal wrapper using `ProtectedRoute`).
4. Mock a backend endpoint (e.g., `GET /api/v1/patients/patients/me`) to return 401 via MSW.
5. Trigger the request (e.g., by mounting the component or calling a hook action).
6. Assert:
   - `sessionManager.hydrate()` returns empty session.
   - "Access Denied" or "Sign In" recovery UI is rendered.

**Verification:**

- `npm test -- --watchAll=false src/views/patient/__tests__/SessionExpiry.integration.test.jsx` passes.

---

## Task 4: Profile Completion Guard Integration Test

**Goal:** Verify the guard modal appears for patients with incomplete profiles.

**Steps:**

1. Create `src/components/guards/__tests__/ProfileCompletionGuard.integration.test.jsx`.
2. Pre-seed auth state as a `patient` role.
3. Mock `GET /api/v1/patients/patients/me` to return a profile with `profile_completion: 30`.
4. Render a route wrapped in `ProfileCompletionGuard`.
5. Assert the "Complete Your Profile" modal is visible.
6. Mock the same endpoint with `profile_completion: 80` and assert the modal is **not** visible.

**Verification:**

- `npm test -- --watchAll=false src/components/guards/__tests__/ProfileCompletionGuard.integration.test.jsx` passes.

---

## Task 5: Clinic Registration Guard Integration Test

**Goal:** Verify the guard modal appears for clinic admins without a clinic.

**Steps:**

1. Create `src/components/guards/__tests__/ClinicRegistrationGuard.integration.test.jsx`.
2. Pre-seed auth state as a `clinic_admin` role.
3. Mock `GET /api/v1/providers/clinics/my-clinic` to return 404.
4. Render a route wrapped in `ClinicRegistrationGuard`.
5. Assert the "Register Your Clinic" modal is visible.
6. Mock the same endpoint with a clinic object and assert the modal is **not** visible.

**Verification:**

- `npm test -- --watchAll=false src/components/guards/__tests__/ClinicRegistrationGuard.integration.test.jsx` passes.

---

## Task 6: Telemedicine Message Deduplication Integration Test

**Goal:** Verify duplicate broadcasts do not create duplicate messages.

**Steps:**

1. Create `src/views/patient/telemedicine-chat/__tests__/MessageDeduplication.integration.test.jsx`.
2. Mock `consultationSocket` or inject a mock WebSocket that can emit messages programmatically.
3. Render the chat view with an active consultation.
4. Emit the same message payload twice through the mock socket.
5. Assert only one message bubble appears in the DOM.

**Verification:**

- `npm test -- --watchAll=false src/views/patient/telemedicine-chat/__tests__/MessageDeduplication.integration.test.jsx` passes.

---

## Task 7: Telemedicine Reconnect Integration Test

**Goal:** Verify socket reconnect preserves message delivery.

**Steps:**

1. Create `src/views/patient/telemedicine-chat/__tests__/Reconnect.integration.test.jsx`.
2. Render the chat view with an active consultation.
3. Simulate a WebSocket close event followed by a reconnect.
4. Emit a new message after reconnect.
5. Assert the new message appears in the DOM.

**Verification:**

- `npm test -- --watchAll=false src/views/patient/telemedicine-chat/__tests__/Reconnect.integration.test.jsx` passes.

---

## Task 8: Full Suite Gate & CI Check

**Goal:** Ensure all integration tests run cleanly together and in CI.

**Steps:**

1. Run `npm test -- --watchAll=false` locally.
2. Confirm all tests pass and runtime is under 10 seconds.
3. Push the branch and verify the GitHub Actions workflow passes.

**Verification:**

- Local: `npm test -- --watchAll=false` → all green, < 10s.
- CI: GitHub Actions `ci.yml` run on the PR is green.

---

## Cross-Cutting Rules

1. **Use MSW, not `jest.mock`, for API calls.** The point of integration tests is to exercise the real HTTP client, service modules, and hooks.
2. **Pre-seed session state via `sessionManager.saveSession()`** instead of writing to `localStorage` directly.
3. **Wrap every render in `<QueryClientProvider client={queryClient}>`** so hooks using `react-query` work correctly.
4. **Keep test files co-located** with the component/view they test (in `__tests__` subdirectories).
5. **Do not add `DISABLE_ESLINT_PLUGIN=true`.**
