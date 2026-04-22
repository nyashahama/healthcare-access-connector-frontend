# Wave D — Error Boundaries and Crash Resilience

## Context

All prior waves have centralized state, hardened the HTTP layer, added tests, and cleaned up ESLint. The app now has a solid architectural foundation. However, if any React component throws an unhandled error, the entire app crashes with a white screen. In a healthcare application, this is unacceptable — a patient in the middle of a telemedicine consultation or booking an urgent appointment cannot afford to lose their session because some UI component threw.

This wave adds React Error Boundaries at strategic layers so errors are contained, users see meaningful recovery UI, and critical flows remain accessible.

## Goals

1. Prevent any single component crash from taking down the entire application.
2. Provide graceful fallback UIs for all critical user paths (auth, telemedicine, appointments, dashboards).
3. Log errors in a structured way for debugging.
4. Preserve session state through crashes so users can retry without re-authenticating.

## Scope

### In Scope

- **Global Error Boundary** — wraps the entire app, catches anything not handled lower down
- **Route-Level Error Boundaries** — each major route (patient, provider, admin, auth, landing) has its own boundary
- **Feature-Level Error Boundaries** — telemedicine chat, appointment booking, clinic management have dedicated boundaries
- **Fallback UI components** — generic error fallback, auth error fallback, critical feature fallback
- **Error logging** — console logging in dev, structured logging hook for future production error reporting service
- **Retry mechanisms** — reset error boundary and retry button on fallbacks

### Out of Scope

- Actual error reporting service (Sentry, LogRocket) — we only prepare the hook/interface
- Fixing existing bugs that cause crashes — boundaries catch errors; fixing root causes is ongoing work
- Performance monitoring

## Architecture

### Error Boundary Hierarchy

```
<GlobalErrorBoundary>
  <AuthProvider>
    <QueryClientProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Each layout has its own boundary */}
            <Route element={<PatientLayout />}>
              <Route element={<FeatureErrorBoundary feature="telemedicine" />}>
                <Route path="/patient/telemedicine-chat" element={<TelemedicineChat />} />
              </Route>
              <Route element={<FeatureErrorBoundary feature="appointments" />}>
                <Route path="/patient/appointments" element={<Appointments />} />
              </Route>
              {/* Other patient routes */}
            </Route>
            <Route element={<ProviderLayout />}>
              {/* Provider routes with boundaries */}
            </Route>
            <Route element={<AdminLayout />}>
              {/* Admin routes with boundaries */}
            </Route>
            <Route element={<AuthLayout />}>
              {/* Auth routes */}
            </Route>
            <Route element={<LandingLayout />}>
              {/* Landing routes */}
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </QueryClientProvider>
  </AuthProvider>
</GlobalErrorBoundary>
```

### Fallback UIs

- **GenericErrorFallback** — "Something went wrong" with retry button and link to dashboard
- **AuthErrorFallback** — "Sign-in unavailable" with option to retry or contact support
- **CriticalFeatureFallback** — "This feature is temporarily unavailable" with session preserved
- **MinimalErrorFallback** — small inline error for sidebar/widget areas

### Error Logging Hook

```js
const useErrorLogger = () => {
  return (error, errorInfo, context) => {
    if (process.env.NODE_ENV === "development") {
      console.error("[Error Boundary]", context, error, errorInfo);
    }
    // Future: send to error reporting service
  };
};
```

## Testing Strategy

- Unit tests for each Error Boundary component (simulate child throw, assert fallback renders)
- Test that retry button resets boundary and re-renders children
- Test that session state survives through an error boundary catch
- Ensure existing integration tests still pass

## Definition of Done

- [ ] `GlobalErrorBoundary` wraps the app in `src/index.js`
- [ ] Route-level boundaries wrap patient, provider, admin, auth, and landing layouts
- [ ] Feature-level boundaries wrap telemedicine and appointments
- [ ] Fallback UI components are implemented and styled consistently with the app
- [ ] Retry mechanism works on all boundaries
- [ ] `useErrorLogger` hook exists and logs in dev mode
- [ ] `npm test -- --watchAll=false` passes
- [ ] `npm run build` passes
