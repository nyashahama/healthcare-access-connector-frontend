# Wave B — Integration Test Expansion

## Context

Wave A (Backend Integration Production Hardening) centralized session ownership, hardened the HTTP layer, extracted telemedicine realtime transport, and added a platform-level unit test harness. All those changes touch the most backend-dependent, highest-risk parts of the application — but they are currently only covered by isolated unit tests for the platform modules themselves.

This wave closes the gap by adding integration tests for the actual user-facing auth and telemedicine flows, so regressions in session handling, guard behavior, or message reconciliation are caught before they reach a pull request.

## Goals

1. Provide automated coverage for every high-risk backend-dependent flow listed in the production-readiness design.
2. Create reusable MSW request handlers so future tests can mock backend contracts without duplicating inline fetch mocks.
3. Keep the test suite fast — all integration tests must run in under 10 seconds total.
4. Leave the door open for Wave C (full hook migration to `react-query`) by validating those hooks through their public API rather than implementation details.

## Scope

### In Scope

- **Auth flows**
  - Sign-in success: valid credentials → token saved → redirected to role dashboard
  - Sign-in failure: invalid credentials → error shown → no redirect
  - Session expiry: HTTP 401 from any endpoint → session cleared → recovery UI shown
- **Guard flows**
  - Profile completion guard: authenticated patient with incomplete profile → modal shown
  - Clinic registration guard: authenticated clinic_admin without clinic → modal shown
- **Telemedicine flows**
  - Message deduplication: same message broadcast twice → only one rendered
  - Reconnect behavior: socket disconnects and reconnects → messages still arrive

### Out of Scope

- Visual regression or pixel-perfect UI testing
- End-to-end browser automation (Playwright, Cypress) — this wave stays inside Jest + React Testing Library
- Testing legacy views that were not touched in Wave A
- Performance benchmarking

## Testing Strategy

### Stack

- **Jest** (already configured via `react-scripts`)
- **React Testing Library** (`render`, `screen`, `waitFor`, `fireEvent`, `act`)
- **MSW v1** (already configured in `src/test/server.js`)
- **Mock Service Worker handlers** in `src/test/handlers/` organized by domain

### Architecture

Tests render real components inside `MemoryRouter` and real `AuthProvider` / `QueryClientProvider`. MSW intercepts API calls at the network layer, so tests exercise the full hook → service → HTTP client → response path without mocking implementation details.

The socket integration test uses a mock `WebSocket` implementation because real WebSockets are unreliable in Jest/jsdom.

### Handler Organization

```
src/test/handlers/
├── index.js          # exports all handlers
├── auth.js           # /api/v1/auth/*
├── patient.js        # /api/v1/patients/*
├── provider.js       # /api/v1/providers/*
├── consultation.js   # /api/v1/telemedicine/*
└── admin.js          # /api/v1/admin/*
```

## Integration Test Scenarios

### 1. Sign-In Success

**Given** a user on the sign-in page
**When** they enter valid credentials and submit
**Then** the token is stored, the user is hydrated, and they are redirected to their role dashboard.

### 2. Sign-In Failure

**Given** a user on the sign-in page
**When** they enter invalid credentials and submit
**Then** an error message is shown and the URL remains on `/auth/sign-in`.

### 3. Unauthorized Session Expiry

**Given** an authenticated user on a protected route
**When** the backend returns HTTP 401 on any request
**Then** the session is cleared and the recovery UI ("Access Denied") is shown.

### 4. Profile Completion Guard

**Given** an authenticated patient with an incomplete profile (< 50%)
**When** they navigate to a patient dashboard
**Then** the profile completion modal is displayed.

### 5. Clinic Registration Guard

**Given** an authenticated clinic_admin without a registered clinic
**When** they navigate to a provider dashboard
**Then** the clinic registration modal is displayed.

### 6. Telemedicine Message Deduplication

**Given** an active consultation with a connected WebSocket
**When** the server broadcasts the same message twice
**Then** only one message appears in the thread.

### 7. Telemedicine Reconnect

**Given** an active consultation with a connected WebSocket
**When** the socket closes unexpectedly and reconnects
**Then** subsequent messages are still received and rendered.

## Non-Goals

- Replacing existing unit tests in `src/platform/`
- Adding tests for SMS flows, community features, or landing page
- Migrating remaining hooks to `react-query` (that is Wave C)

## Definition of Done

- [ ] `src/test/handlers/` contains reusable MSW handlers for auth, patient, provider, and consultation endpoints.
- [ ] All 7 integration scenarios above have passing tests.
- [ ] `npm test -- --watchAll=false` passes locally and in CI.
- [ ] Total test suite runtime does not exceed 10 seconds.
- [ ] No new `DISABLE_ESLINT_PLUGIN=true` introduced.
