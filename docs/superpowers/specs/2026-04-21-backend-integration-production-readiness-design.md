# Backend Integration Production Readiness Design

## Summary

This repository is the frontend client for the healthcare platform. The useful "backend" work that can be done here is not a database or service rewrite; it is to harden the frontend-owned backend integration layer so authentication, API access, realtime messaging, guards, and release behavior become deterministic, testable, and safe to ship.

The recommended direction is an incremental platform hardening program:

1. Add a shared platform layer for runtime config, HTTP, auth/session, query state, and realtime transport.
2. Preserve the current product surface and routes while migrating high-risk flows first.
3. Add tests and release gates before attempting broader refactors.

This is the best fit for the current codebase because it removes the biggest production risks without forcing a full UI rewrite or requiring an immediate backend-for-frontend project.

## Current State Assessment

### Confirmed strengths

- The app already has clear role-separated route groups for patient, provider, and admin surfaces.
- Domain-specific API modules exist under `src/api/services`, which gives us a starting point for migration.
- Telemedicine is clearly an active product area; recent commits show that behavior is being repaired rather than abandoned.
- The production build produces output artifacts in `build/`, so the application can be bundled today.

### Confirmed blockers to production readiness

- The repo documentation is inaccurate. `README.md` says the app uses Vite and simulated auth, but the code uses `react-scripts` and real API endpoints.
- There are currently zero automated tests. `npm test -- --watchAll=false` exits with "No tests found".
- The build script disables the eslint plugin: `DISABLE_ESLINT_PLUGIN=true react-scripts build`.
- `AuthProvider` is mounted twice: once in `src/index.js` and again in `src/App.jsx`. That makes session state ownership ambiguous.
- `src/api/apiClient.js` mixes transport concerns with application behavior:
  - it logs runtime configuration to the console;
  - it treats some login network/CORS failures as success if local storage contains a token;
  - it clears auth state and hard redirects on `401` inside the transport layer.
- `localStorage` and `sessionStorage` are accessed directly from many places:
  - auth context;
  - services;
  - guards;
  - auth views;
  - logout helper.
- Each domain hook reimplements its own request lifecycle (`loading`, `error`, local cache mutation, response shape assumptions), so behavior is inconsistent and not centrally testable.
- Realtime WebSocket logic is duplicated in both telemedicine screens, including connection lifecycle, heartbeat, message mapping, deduplication, and reconnect behavior.
- Role/redirect logic is duplicated across `routes.js`, `roleUtils.js`, `ProtectedRoute.jsx`, `PublicRoute.jsx`, and `RoleBasedRoute.jsx`.

### What appears to be working now

- Role-based navigation structure is present and broadly understandable.
- Core domain surfaces exist for auth, patients, providers, appointments, staff, admin, and telemedicine.
- Recent telemedicine fixes suggest the current team can ship targeted bug fixes in critical flows.
- The bundle can be generated.

### What should not be trusted yet

- Session correctness across tabs, expiry, logout, and unauthorized responses.
- Guard correctness for profile completion and clinic registration.
- API contract consistency across services and hooks.
- Realtime message delivery, deduplication, and read-state reconciliation under reconnect scenarios.
- Release quality, because there is no test suite and no CI gate in the repository.

## Approaches Considered

### Option 1: Minimal patching of the existing structure

Keep the current services/hooks/guards, fix the worst bugs in place, and add a few tests.

Benefits:

- Lowest immediate migration cost.
- Smallest amount of code movement.

Costs:

- The core architectural problem remains: session, transport, storage, and routing stay entangled.
- Realtime duplication remains expensive to maintain.
- New features will keep extending the same unstable patterns.

### Option 2: Incremental platform hardening inside the current app

Introduce a small set of shared platform modules, then migrate the highest-risk flows onto them while preserving public hook interfaces where possible.

Benefits:

- Removes the biggest production risks first.
- Lets the team migrate feature areas in phases.
- Keeps existing UI routes and screens mostly intact.
- Creates a stable base for tests, observability, and CI.

Costs:

- Requires several cross-cutting refactors before visible product work.
- Temporarily introduces a mixed architecture while migration is in progress.

### Option 3: Full backend-for-frontend or full frontend rewrite

Push all session/contract shaping into a new BFF or rebuild the frontend state layer wholesale.

Benefits:

- Cleanest long-term architecture.
- Strongest backend/frontend contract separation.

Costs:

- Too expensive for the current repository state.
- Requires a second project boundary, extra infrastructure, and likely backend coordination.
- Delays the immediate stability work this app needs right now.

## Decision

Choose Option 2: incremental platform hardening.

It delivers the best risk reduction per unit of effort. It is also the only option that fits the current codebase reality: the repo already has product breadth, active telemedicine work, and many backend-dependent screens. A disciplined migration path is safer than either cosmetic patching or a rewrite.

## Recommended Target Architecture

### Layering

Add a shared platform layer and migrate feature code onto it:

```text
src/
  platform/
    config/
      runtime.js
    http/
      httpClient.js
      httpError.js
    auth/
      sessionStore.js
      sessionManager.js
      AuthSessionProvider.jsx
    query/
      queryClient.js
      queryKeys.js
    realtime/
      consultationSocket.js
      messageMappers.js
  api/
    services/
      ...existing service modules, gradually simplified
  hooks/
    ...existing public hooks, gradually rewritten as thin adapters
  views/
    ...screens consume hooks, not storage or raw WebSocket logic
```

### Component responsibilities

- `platform/config`: validate runtime inputs once, expose a typed config object, remove hidden fallbacks from feature code.
- `platform/http`: own axios setup, request IDs, auth header injection, error normalization, refresh handling, and retry policy.
- `platform/auth`: own token/user persistence, expiry checks, session events, and logout behavior.
- `platform/query`: own server-state caching and invalidation. React Query is the recommended choice here because the app has many read-heavy, mutation-heavy flows with repeated stale-state problems.
- `platform/realtime`: own WebSocket connect/disconnect/retry/heartbeat logic and shared message mapping for telemedicine.
- `api/services`: become small request wrappers only. No local storage access, no navigation, no browser globals.
- `hooks`: become screen-friendly adapters around platform/query logic so view components can stay simple.

### Session and request flow

1. App boot loads runtime config once.
2. Session provider hydrates stored session state from one storage adapter.
3. HTTP client reads the current access token from the session manager.
4. Failed authenticated requests go through a single unauthorized path:
   - attempt refresh once if refresh is supported;
   - if refresh fails, emit a session-expired event;
   - auth/session layer clears state;
   - UI decides how to notify and where to navigate.
5. Guards consume session state and domain queries. They do not read browser storage directly.

### Domain data flow

- Read models should be loaded through a shared query layer with stable keys and retry rules.
- Mutations should invalidate or update the relevant query keys instead of rewriting ad hoc local state in each screen.
- Existing public hooks can stay as facades during migration so view churn stays limited.

### Realtime flow

- Telemedicine should use one reusable consultation socket client.
- Patient and provider screens should share message/event mapping utilities.
- Socket events should update shared query state or a single message store, not duplicate custom reconciliation logic in each screen.

## Error Handling Strategy

Introduce a normalized application error model:

- `network`
- `auth`
- `validation`
- `forbidden`
- `not_found`
- `conflict`
- `server`
- `unknown`

Rules:

- The transport layer never performs browser navigation.
- Network failures are never treated as successful logins.
- Only idempotent reads may be retried automatically.
- Unauthorized handling is centralized and observable.
- User-facing toasts come from action layers or screen adapters, not from axios interceptors.

## Testing Strategy

The first production-readiness gate is a real test harness.

Recommended stack:

- Jest / React Testing Library
- MSW for API mocking
- Focused unit tests for config, session store, error normalization, and socket lifecycle
- Integration tests for:
  - sign-in success and failure;
  - unauthorized session expiry;
  - patient profile completion guard;
  - clinic registration guard;
  - telemedicine message reconciliation and reconnect behavior.

Minimum CI gate:

1. `npm ci`
2. `npm test -- --watchAll=false`
3. `npm run build`

## Observability and Operations

Add basic but meaningful release visibility:

- structured development logging only in non-production environments;
- request IDs attached to failed API errors;
- consistent error objects for toast/reporting;
- `.env.example` with every required variable;
- README updated to match the real toolchain and runtime requirements;
- CI workflow enforcing tests and build.

## Migration Strategy

### Phase 1: Foundation

- Add test harness.
- Add runtime config module.
- Add `.env.example`.
- Remove README inaccuracies.

### Phase 2: Session/Auth/HTTP Core

- Add session store and session manager.
- Rewrite `apiClient` around normalized errors and centralized auth handling.
- Remove duplicate `AuthProvider`.
- Preserve the current `useAuth` API where possible.

### Phase 3: Guard and Domain Stabilization

- Refactor auth/profile/clinic guards to stop reading browser storage directly.
- Introduce shared query state.
- Migrate patient, provider, admin, and appointment hooks first.

### Phase 4: Telemedicine Realtime Extraction

- Move WebSocket logic into `platform/realtime`.
- Unify patient/provider message mapping and reconnect behavior.
- Add tests for deduplication, read receipts, and reconnects.

### Phase 5: Long-Tail Migration and Release Gates

- Simplify the remaining service modules.
- Add CI workflow.
- Remove eslint suppression from the build.
- Finalize docs and deployment guidance.

## Non-Goals

- Rebuilding the backend service itself inside this repository.
- Replacing all UI components or redesigning the product.
- Changing endpoint semantics unless the existing contract is actively broken.
- Migrating away from `react-scripts` as part of the first hardening wave.

## Definition of Done

The frontend integration layer is production ready when all of the following are true:

- Session state has exactly one owner and one storage adapter.
- No service, guard, or screen reads auth state directly from browser storage.
- The HTTP layer normalizes errors and never hard redirects.
- Runtime configuration is validated at startup and documented in `.env.example`.
- High-risk backend-dependent flows have automated tests.
- Telemedicine uses a shared socket client instead of duplicated inline WebSocket logic.
- The build passes without `DISABLE_ESLINT_PLUGIN=true`.
- README and deployment documentation match the actual repository.

