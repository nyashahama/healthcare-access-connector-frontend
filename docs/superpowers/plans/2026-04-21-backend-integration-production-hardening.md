# Backend Integration Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the app's ad hoc backend integration patterns with a centralized, tested, production-safe platform layer while keeping current routes and user-visible features working.

**Architecture:** Introduce shared platform modules for runtime config, HTTP, session/auth, query state, and realtime transport. Migrate the highest-risk flows first: auth, guards, provider/patient onboarding, and telemedicine. Keep existing hooks as compatibility facades until all views have been moved onto the new platform layer.

**Tech Stack:** React 19, `react-scripts`, React Router 6, Axios, React Testing Library/Jest, MSW, `@tanstack/react-query`

---

## File Structure Map

### Create

- `.env.example`
- `src/setupTests.js`
- `src/test/server.js`
- `src/test/handlers/index.js`
- `src/platform/config/runtime.js`
- `src/platform/config/runtime.test.js`
- `src/platform/http/httpError.js`
- `src/platform/http/httpClient.js`
- `src/platform/http/httpClient.test.js`
- `src/platform/auth/sessionStore.js`
- `src/platform/auth/sessionManager.js`
- `src/platform/auth/sessionManager.test.js`
- `src/platform/query/queryClient.js`
- `src/platform/query/queryKeys.js`
- `src/platform/realtime/consultationSocket.js`
- `src/platform/realtime/messageMappers.js`
- `src/platform/realtime/consultationSocket.test.js`
- `src/components/guards/__tests__/routeGuards.test.jsx`
- `src/hooks/__tests__/usePatient.test.jsx`
- `src/hooks/__tests__/useProvider.test.jsx`
- `src/hooks/__tests__/useConsultationMessages.test.jsx`
- `.github/workflows/ci.yml`

### Modify

- `package.json`
- `README.md`
- `src/index.js`
- `src/App.jsx`
- `src/context/AuthContext.jsx`
- `src/api/apiClient.js`
- `src/api/services/authService.js`
- `src/api/services/patientService.js`
- `src/api/services/providerService.js`
- `src/api/services/adminService.js`
- `src/api/services/staffService.js`
- `src/api/services/appointmentService.js`
- `src/api/services/consultationService.js`
- `src/api/services/consultationMessagesService.js`
- `src/components/guards/PublicRoute.jsx`
- `src/components/guards/ProtectedRoute.jsx`
- `src/components/guards/ProfileCompletionGuard.jsx`
- `src/components/guards/ClinicRegistrationGuard.jsx`
- `src/hooks/usePatient.js`
- `src/hooks/useProvider.js`
- `src/hooks/useAdmin.js`
- `src/hooks/useAppointment.js`
- `src/hooks/useConsultation.js`
- `src/hooks/useConsultationMessages.js`
- `src/hooks/useLogoutHandler.js`
- `src/utils/roleUtils.js`
- `src/views/patient/telemedicine-chat/index.jsx`
- `src/views/provider/telemedicine/index.jsx`

## Scope Notes

- Do not start Task 4 before Tasks 1-3 are merged. Query migration depends on the new config, auth, and HTTP layers.
- Do not start Task 5 before Task 4 is merged. Realtime logic should update the new shared data layer, not the legacy state shape.
- Keep the public `useAuth`, `usePatient`, `useProvider`, `useAdmin`, `useAppointment`, `useConsultation`, and `useConsultationMessages` interfaces stable unless a specific view migration is in the same task.

### Task 1: Add Test Harness, Runtime Config, and Accurate Runtime Docs

**Files:**
- Create: `.env.example`
- Create: `src/setupTests.js`
- Create: `src/test/server.js`
- Create: `src/test/handlers/index.js`
- Create: `src/platform/config/runtime.js`
- Create: `src/platform/config/runtime.test.js`
- Modify: `package.json`
- Modify: `README.md`
- Test: `src/platform/config/runtime.test.js`

- [ ] **Step 1: Write the failing runtime config test**

```js
describe("getRuntimeConfig", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("throws when REACT_APP_API_URL is missing outside tests", () => {
    process.env.NODE_ENV = "development";
    delete process.env.REACT_APP_API_URL;

    expect(() => require("./runtime").getRuntimeConfig()).toThrow(
      /REACT_APP_API_URL/
    );
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- --watchAll=false src/platform/config/runtime.test.js`
Expected: FAIL with `Cannot find module './runtime'`

- [ ] **Step 3: Implement runtime config and test harness**

```js
// src/platform/config/runtime.js
const requiredKeys = ["REACT_APP_API_URL"];

export const getRuntimeConfig = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const wsUrl =
    process.env.REACT_APP_WS_URL ||
    (apiUrl ? apiUrl.replace(/^http/, "ws") : "ws://localhost:8080");

  if (process.env.NODE_ENV !== "test") {
    requiredKeys.forEach((key) => {
      if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    });
  }

  return {
    apiUrl: apiUrl || "http://localhost:8080",
    wsUrl,
    environment:
      process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development",
  };
};
```

```js
// src/setupTests.js
import "@testing-library/jest-dom";
import { server } from "./test/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

```js
// src/test/server.js
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

```js
// src/test/handlers/index.js
export const handlers = [];
```

```json
// package.json
{
  "dependencies": {
    "axios-mock-adapter": "^2.1.0",
    "msw": "^2.11.2"
  },
  "scripts": {
    "test:ci": "react-scripts test --watchAll=false"
  }
}
```

```env
# .env.example
REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_ENVIRONMENT=development
```

- [ ] **Step 4: Update README so it matches the real toolchain**

```md
## Technology Stack

- Frontend Framework: React 19
- Build Tool: react-scripts (Create React App)
- HTTP Client: Axios
- Routing: React Router 6

## Environment Variables

Copy `.env.example` and set:

REACT_APP_API_URL=http://localhost:8080
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_ENVIRONMENT=development
```

- [ ] **Step 5: Run the test again**

Run: `npm test -- --watchAll=false src/platform/config/runtime.test.js`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add .env.example package.json README.md src/setupTests.js src/test/server.js src/test/handlers/index.js src/platform/config/runtime.js src/platform/config/runtime.test.js
git commit -m "test: add config and msw test foundation"
```

### Task 2: Centralize Session Ownership and Harden the HTTP Layer

**Files:**
- Create: `src/platform/http/httpError.js`
- Create: `src/platform/http/httpClient.js`
- Create: `src/platform/http/httpClient.test.js`
- Create: `src/platform/auth/sessionStore.js`
- Create: `src/platform/auth/sessionManager.js`
- Create: `src/platform/auth/sessionManager.test.js`
- Modify: `src/index.js`
- Modify: `src/App.jsx`
- Modify: `src/context/AuthContext.jsx`
- Modify: `src/api/apiClient.js`
- Modify: `src/api/services/authService.js`
- Test: `src/platform/auth/sessionManager.test.js`
- Test: `src/platform/http/httpClient.test.js`

- [ ] **Step 1: Write failing tests for session expiry and unauthorized handling**

```js
// src/platform/auth/sessionManager.test.js
import { createSessionManager } from "./sessionManager";

describe("session manager", () => {
  it("clears session and emits an event when unauthorized", () => {
    const events = [];
    const manager = createSessionManager({
      storage: {
        read: () => ({
          token: "abc",
          user: { id: "u1", role: "patient" },
          expiresAt: "2099-01-01T00:00:00Z",
        }),
        write: jest.fn(),
        clear: jest.fn(),
      },
      onEvent: (event) => events.push(event.type),
    });

    manager.handleUnauthorized();

    expect(events).toContain("session-expired");
  });
});
```

```js
// src/platform/http/httpClient.test.js
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { createHttpClient } from "./httpClient";

describe("http client", () => {
  it("returns normalized auth errors instead of redirecting the browser", async () => {
    const client = createHttpClient({
      baseURL: "http://localhost:8080",
      getToken: () => "expired-token",
      onUnauthorized: jest.fn(),
    });

    const mock = new MockAdapter(client);
    mock.onGet("/protected").reply(401, { error: "unauthorized" });

    await expect(client.get("/protected")).rejects.toMatchObject({
      kind: "auth",
      status: 401,
    });
  });
});
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `npm test -- --watchAll=false src/platform/auth/sessionManager.test.js src/platform/http/httpClient.test.js`
Expected: FAIL with missing modules

- [ ] **Step 3: Implement session storage, session manager, and normalized HTTP errors**

```js
// src/platform/auth/sessionStore.js
const KEYS = {
  token: "token",
  user: "user",
  expiresAt: "tokenExpiry",
};

export const sessionStore = {
  read() {
    const token = localStorage.getItem(KEYS.token);
    const user = localStorage.getItem(KEYS.user);
    const expiresAt = localStorage.getItem(KEYS.expiresAt);

    return {
      token,
      user: user ? JSON.parse(user) : null,
      expiresAt,
    };
  },
  write({ token, user, expiresAt }) {
    if (token) localStorage.setItem(KEYS.token, token);
    if (user) localStorage.setItem(KEYS.user, JSON.stringify(user));
    if (expiresAt) localStorage.setItem(KEYS.expiresAt, expiresAt);
  },
  clear() {
    Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
  },
};
```

```js
// src/platform/http/httpError.js
export const normalizeHttpError = (error) => {
  if (!error.response) {
    return {
      kind: "network",
      status: 0,
      message: "Unable to reach the server",
      cause: error,
    };
  }

  const status = error.response.status;
  const message = error.response.data?.error || error.message;

  if (status === 401) return { kind: "auth", status, message, cause: error };
  if (status === 403) return { kind: "forbidden", status, message, cause: error };
  if (status === 404) return { kind: "not_found", status, message, cause: error };
  if (status === 409) return { kind: "conflict", status, message, cause: error };
  if (status === 422) return { kind: "validation", status, message, cause: error };

  return { kind: "server", status, message, cause: error };
};
```

```js
// src/platform/auth/sessionManager.js
import { sessionStore } from "./sessionStore";

export const createSessionManager = ({
  storage = sessionStore,
  onEvent = () => {},
} = {}) => ({
  hydrate() {
    return storage.read();
  },
  saveSession(session) {
    storage.write(session);
    onEvent({ type: "session-saved", payload: session });
  },
  clearSession(reason = "manual") {
    storage.clear();
    onEvent({ type: "session-expired", payload: { reason } });
  },
  handleUnauthorized() {
    storage.clear();
    onEvent({ type: "session-expired", payload: { reason: "unauthorized" } });
  },
});

export const sessionManager = createSessionManager();
```

- [ ] **Step 4: Replace direct transport-side redirects with platform-managed auth events**

```js
// src/platform/http/httpClient.js
import axios from "axios";
import { normalizeHttpError } from "./httpError";

export const createHttpClient = ({ baseURL, getToken, onUnauthorized }) => {
  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const normalized = normalizeHttpError(error);
      if (normalized.kind === "auth") {
        onUnauthorized?.(normalized);
      }
      return Promise.reject(normalized);
    }
  );

  return client;
};
```

```js
// src/api/apiClient.js
import { getRuntimeConfig } from "platform/config/runtime";
import { createHttpClient } from "platform/http/httpClient";
import { sessionManager } from "platform/auth/sessionManager";

const { apiUrl } = getRuntimeConfig();

const apiClient = createHttpClient({
  baseURL: apiUrl,
  getToken: () => sessionManager.hydrate().token,
  onUnauthorized: () => sessionManager.handleUnauthorized(),
});

export default apiClient;
```

```js
// src/index.js
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```jsx
// src/App.jsx
import { AuthProvider } from "context/AuthContext";

const App = () => (
  <AuthProvider>
    {/* existing routes */}
  </AuthProvider>
);
```

- [ ] **Step 5: Refactor auth context to use the session manager as the single owner**

```jsx
// src/context/AuthContext.jsx
useEffect(() => {
  const { token, user, expiresAt } = sessionManager.hydrate();
  const isValid = Boolean(token && expiresAt && new Date(expiresAt) > new Date());

  if (isValid && user) {
    setUser(user);
    setIsAuthenticated(true);
  } else {
    sessionManager.clearSession("hydrate-invalid");
    setUser(null);
    setIsAuthenticated(false);
  }

  setLoading(false);
}, []);

const login = useCallback(async (credentials) => {
  setLoading(true);
  try {
    const response = await authService.login(credentials);
    sessionManager.saveSession({
      token: response.token,
      user: response.user,
      expiresAt: response.expires_at,
    });
    setUser(response.user);
    setIsAuthenticated(true);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error.message || "Login failed" };
  } finally {
    setLoading(false);
  }
}, []);
```

- [ ] **Step 6: Run the targeted tests to verify they pass**

Run: `npm test -- --watchAll=false src/platform/auth/sessionManager.test.js src/platform/http/httpClient.test.js`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/index.js src/App.jsx src/context/AuthContext.jsx src/api/apiClient.js src/api/services/authService.js src/platform/auth/sessionStore.js src/platform/auth/sessionManager.js src/platform/auth/sessionManager.test.js src/platform/http/httpError.js src/platform/http/httpClient.js src/platform/http/httpClient.test.js
git commit -m "refactor: centralize session ownership and http errors"
```

### Task 3: Refactor Guards and Role Routing to Consume Shared Session State

**Files:**
- Create: `src/components/guards/__tests__/routeGuards.test.jsx`
- Modify: `src/components/guards/PublicRoute.jsx`
- Modify: `src/components/guards/ProtectedRoute.jsx`
- Modify: `src/components/guards/ProfileCompletionGuard.jsx`
- Modify: `src/components/guards/ClinicRegistrationGuard.jsx`
- Modify: `src/utils/roleUtils.js`
- Modify: `src/hooks/useLogoutHandler.js`
- Test: `src/components/guards/__tests__/routeGuards.test.jsx`

- [ ] **Step 1: Write the failing guard tests**

```jsx
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "../ProtectedRoute";

jest.mock("context/AuthContext", () => ({
  useAuth: () => ({
    loading: false,
    isAuthenticated: false,
    user: null,
  }),
}));

describe("ProtectedRoute", () => {
  it("renders the sign-in recovery UI for anonymous users", () => {
    render(
      <MemoryRouter initialEntries={["/patient/dashboard"]}>
        <Routes>
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <div>secret</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm test -- --watchAll=false src/components/guards/__tests__/routeGuards.test.jsx`
Expected: FAIL with missing test file or mismatched guard behavior

- [ ] **Step 3: Consolidate dashboard and role rules into one utility**

```js
// src/utils/roleUtils.js
export const ROLE_GROUPS = {
  patient: ["patient"],
  provider: ["clinic_admin", "provider_staff", "doctor", "nurse", "caregiver"],
  admin: ["admin", "system_admin"],
};

export const getDashboardPath = (role) => {
  if (ROLE_GROUPS.patient.includes(role)) return "/patient/dashboard";
  if (ROLE_GROUPS.provider.includes(role)) return "/provider/dashboard";
  if (ROLE_GROUPS.admin.includes(role)) return "/admin/dashboard";
  return "/auth/sign-in";
};

export const hasRouteAccess = (role, allowedRoles = []) =>
  allowedRoles.length === 0 || allowedRoles.includes(role);
```

- [ ] **Step 4: Remove direct storage reads from guards and route helpers**

```jsx
// src/components/guards/PublicRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "context/AuthContext";
import { getDashboardPath } from "utils/roleUtils";

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading</div>;
  if (location.pathname === "/auth/complete-patient-profile") return children;

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};
```

```jsx
// src/components/guards/ProtectedRoute.jsx
import { useAuth } from "context/AuthContext";
import { hasRouteAccess } from "utils/roleUtils";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <div>Verifying Access</div>;
  if (!isAuthenticated || !user) return <a href="/auth/sign-in">Go to Sign In</a>;
  if (!hasRouteAccess(user.role, allowedRoles)) return <div>Access Denied</div>;

  return children;
};
```

- [ ] **Step 5: Replace guard-local storage caches with hook/session-backed checks**

```jsx
// src/components/guards/ProfileCompletionGuard.jsx
import { useEffect } from "react";
import { useAuth } from "context/AuthContext";
import { usePatient } from "hooks/usePatient";

const ProfileCompletionGuard = ({ children, minCompletion = 50 }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const {
    patient,
    profileCompletion,
    loading: profileLoading,
    getCurrentPatientProfile,
  } = usePatient();

  useEffect(() => {
    if (isAuthenticated && user?.role === "patient") {
      getCurrentPatientProfile();
    }
  }, [getCurrentPatientProfile, isAuthenticated, user?.role]);

  if (authLoading || profileLoading) return <div>Loading Your Profile</div>;
  if (!isAuthenticated || user?.role !== "patient") return children;

  const completion = patient ? profileCompletion : 0;

  return (
    <>
      {children}
      {completion < minCompletion ? <button>Complete Profile Now</button> : null}
    </>
  );
};
```

```jsx
// src/components/guards/ClinicRegistrationGuard.jsx
import { useEffect } from "react";
import { useAuth } from "context/AuthContext";
import { useProvider } from "hooks/useProvider";

const ClinicRegistrationGuard = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { clinic, loading: clinicLoading, getMyClinic } = useProvider();

  useEffect(() => {
    if (user?.role === "clinic_admin") {
      getMyClinic();
    }
  }, [getMyClinic, user?.role]);

  if (authLoading || clinicLoading) return <div>Checking Clinic Status</div>;
  if (user?.role !== "clinic_admin" || clinic) return children;

  return (
    <>
      {children}
      <button>Register Clinic Now</button>
    </>
  );
};
```

```js
// src/hooks/useLogoutHandler.js
const handleLogout = async () => {
  await logout();
  navigate("/auth/sign-in", { replace: true });
};
```

- [ ] **Step 6: Run the guard test again**

Run: `npm test -- --watchAll=false src/components/guards/__tests__/routeGuards.test.jsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/guards/__tests__/routeGuards.test.jsx src/components/guards/PublicRoute.jsx src/components/guards/ProtectedRoute.jsx src/components/guards/ProfileCompletionGuard.jsx src/components/guards/ClinicRegistrationGuard.jsx src/utils/roleUtils.js src/hooks/useLogoutHandler.js
git commit -m "refactor: unify role routing and guard state"
```

### Task 4: Introduce Shared Query State and Migrate Core Domain Hooks

**Files:**
- Create: `src/platform/query/queryClient.js`
- Create: `src/platform/query/queryKeys.js`
- Create: `src/hooks/__tests__/usePatient.test.jsx`
- Create: `src/hooks/__tests__/useProvider.test.jsx`
- Modify: `package.json`
- Modify: `src/index.js`
- Modify: `src/hooks/usePatient.js`
- Modify: `src/hooks/useProvider.js`
- Modify: `src/hooks/useAdmin.js`
- Modify: `src/hooks/useAppointment.js`
- Modify: `src/hooks/useConsultation.js`
- Test: `src/hooks/__tests__/usePatient.test.jsx`
- Test: `src/hooks/__tests__/useProvider.test.jsx`

- [ ] **Step 1: Write the failing hook tests**

```jsx
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { usePatient } from "../usePatient";

jest.mock("api/services/patientService", () => ({
  getCurrentPatientProfile: jest.fn().mockResolvedValue({
    id: "p1",
    first_name: "Amina",
    last_name: "Dube",
  }),
  calculateProfileCompletion: jest.fn().mockReturnValue(80),
}));

describe("usePatient", () => {
  it("hydrates patient state from a shared query", async () => {
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatient(), { wrapper });
    result.current.getCurrentPatientProfile();

    await waitFor(() => {
      expect(result.current.patient?.id).toBe("p1");
    });
  });
});
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `npm test -- --watchAll=false src/hooks/__tests__/usePatient.test.jsx src/hooks/__tests__/useProvider.test.jsx`
Expected: FAIL with missing query client modules

- [ ] **Step 3: Add React Query and the shared provider**

```json
// package.json
{
  "dependencies": {
    "@tanstack/react-query": "^5.90.2"
  }
}
```

```js
// src/platform/query/queryClient.js
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => error?.kind === "network" && count < 2,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});
```

```js
// src/platform/query/queryKeys.js
export const queryKeys = {
  patient: {
    current: ["patient", "current"],
  },
  provider: {
    clinic: ["provider", "clinic"],
  },
  admin: {
    current: ["admin", "current"],
  },
};
```

```js
// src/index.js
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";

root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>
);
```

- [ ] **Step 4: Rewrite core hooks as query-backed facades**

```js
// src/hooks/usePatient.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import patientService from "api/services/patientService";
import { queryKeys } from "platform/query/queryKeys";

export const usePatient = () => {
  const client = useQueryClient();
  const profileQuery = useQuery({
    queryKey: queryKeys.patient.current,
    queryFn: patientService.getCurrentPatientProfile,
    enabled: false,
  });

  const upsertMutation = useMutation({
    mutationFn: patientService.upsertPatientProfile,
    onSuccess: (data) => {
      client.setQueryData(queryKeys.patient.current, data);
    },
  });

  return {
    getCurrentPatientProfile: () => profileQuery.refetch(),
    upsertPatientProfile: upsertMutation.mutateAsync,
    patient: profileQuery.data ?? null,
    profileCompletion: patientService.calculateProfileCompletion(profileQuery.data),
    loading: profileQuery.isFetching || upsertMutation.isPending,
    error: profileQuery.error?.message || upsertMutation.error?.message || null,
    hasPatient: Boolean(profileQuery.data),
  };
};
```

```js
// src/hooks/useProvider.js
import { useQuery } from "@tanstack/react-query";
import providerService from "api/services/providerService";
import { queryKeys } from "platform/query/queryKeys";

export const useProvider = () => {
  const clinicQuery = useQuery({
    queryKey: queryKeys.provider.clinic,
    queryFn: providerService.getMyClinic,
    enabled: false,
  });

  return {
    getMyClinic: () => clinicQuery.refetch(),
    clinic: clinicQuery.data?.clinic || clinicQuery.data || null,
    loading: clinicQuery.isFetching,
    error: clinicQuery.error?.message || null,
  };
};
```

- [ ] **Step 5: Run the query hook tests**

Run: `npm test -- --watchAll=false src/hooks/__tests__/usePatient.test.jsx src/hooks/__tests__/useProvider.test.jsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add package.json src/index.js src/platform/query/queryClient.js src/platform/query/queryKeys.js src/hooks/usePatient.js src/hooks/useProvider.js src/hooks/useAdmin.js src/hooks/useAppointment.js src/hooks/useConsultation.js src/hooks/__tests__/usePatient.test.jsx src/hooks/__tests__/useProvider.test.jsx
git commit -m "refactor: migrate core domain hooks to shared query state"
```

### Task 5: Extract Telemedicine Realtime Transport and Shared Message Mapping

**Files:**
- Create: `src/platform/realtime/consultationSocket.js`
- Create: `src/platform/realtime/messageMappers.js`
- Create: `src/platform/realtime/consultationSocket.test.js`
- Create: `src/hooks/__tests__/useConsultationMessages.test.jsx`
- Modify: `src/hooks/useConsultationMessages.js`
- Modify: `src/views/patient/telemedicine-chat/index.jsx`
- Modify: `src/views/provider/telemedicine/index.jsx`
- Test: `src/platform/realtime/consultationSocket.test.js`
- Test: `src/hooks/__tests__/useConsultationMessages.test.jsx`

- [ ] **Step 1: Write the failing realtime tests**

```js
import { createConsultationSocket } from "./consultationSocket";

describe("consultation socket", () => {
  it("reconnects with backoff and emits parsed events", () => {
    const socket = createConsultationSocket({
      wsUrl: "ws://localhost:8080",
      consultationId: "c1",
      token: "abc",
      onEvent: jest.fn(),
    });

    expect(socket.connect).toBeDefined();
    expect(socket.disconnect).toBeDefined();
  });
});
```

- [ ] **Step 2: Run the targeted tests to verify they fail**

Run: `npm test -- --watchAll=false src/platform/realtime/consultationSocket.test.js src/hooks/__tests__/useConsultationMessages.test.jsx`
Expected: FAIL with missing realtime modules

- [ ] **Step 3: Implement the shared socket client and message mappers**

```js
// src/platform/realtime/consultationSocket.js
export const createConsultationSocket = ({
  wsUrl,
  consultationId,
  token,
  onEvent,
}) => {
  let socket = null;
  let heartbeat = null;
  let retryTimer = null;
  let attempts = 0;

  const connect = () => {
    const url = `${wsUrl}/api/v1/telemedicine/consultations/${consultationId}/ws?token=${token}`;
    socket = new WebSocket(url);

    socket.onopen = () => {
      attempts = 0;
      heartbeat = setInterval(() => {
        if (socket?.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 25000);
    };

    socket.onmessage = (event) => onEvent(JSON.parse(event.data));
    socket.onclose = () => {
      clearInterval(heartbeat);
      const delay = Math.min(1000 * 2 ** attempts, 10000);
      attempts += 1;
      retryTimer = setTimeout(connect, delay);
    };
  };

  const disconnect = () => {
    clearInterval(heartbeat);
    clearTimeout(retryTimer);
    socket?.close();
  };

  const send = (payload) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(payload));
    }
  };

  return { connect, disconnect, send };
};
```

```js
// src/platform/realtime/messageMappers.js
export const normalizeSenderRole = (role) => {
  if (role === "system") return "system";
  if (role === "patient") return "patient";
  return "provider";
};

export const mapRealtimeMessage = (payload, fallbackRole = "provider") => ({
  id: payload.message_id,
  text: payload.content ?? "",
  sender_role: normalizeSenderRole(payload.sender_role || fallbackRole),
  sent_at: payload.sent_at || new Date().toISOString(),
  message_type: payload.message_type || "text",
  is_read: Boolean(payload.is_read),
});
```

- [ ] **Step 4: Refactor telemedicine screens to consume the shared socket**

```jsx
// src/views/patient/telemedicine-chat/index.jsx
const socketRef = useRef(null);

useEffect(() => {
  if (!consultationId) return;

  socketRef.current = createConsultationSocket({
    wsUrl: getRuntimeConfig().wsUrl,
    consultationId,
    token: getToken(),
    onEvent: handleWsEvent,
  });

  socketRef.current.connect();
  return () => socketRef.current?.disconnect();
}, [consultationId, getToken, handleWsEvent]);
```

```jsx
// src/views/provider/telemedicine/index.jsx
useEffect(() => {
  if (!activeConsultationId) return;

  socketRef.current = createConsultationSocket({
    wsUrl: getRuntimeConfig().wsUrl,
    consultationId: activeConsultationId,
    token: getToken(),
    onEvent: handleWsEvent,
  });

  socketRef.current.connect();
  return () => socketRef.current?.disconnect();
}, [activeConsultationId, getToken, handleWsEvent]);
```

- [ ] **Step 5: Run the realtime tests**

Run: `npm test -- --watchAll=false src/platform/realtime/consultationSocket.test.js src/hooks/__tests__/useConsultationMessages.test.jsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/platform/realtime/consultationSocket.js src/platform/realtime/messageMappers.js src/platform/realtime/consultationSocket.test.js src/hooks/useConsultationMessages.js src/hooks/__tests__/useConsultationMessages.test.jsx src/views/patient/telemedicine-chat/index.jsx src/views/provider/telemedicine/index.jsx
git commit -m "refactor: extract telemedicine socket transport"
```

### Task 6: Normalize Remaining Service Modules and Add Release Gates

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `src/api/services/patientService.js`
- Modify: `src/api/services/providerService.js`
- Modify: `src/api/services/adminService.js`
- Modify: `src/api/services/staffService.js`
- Modify: `src/api/services/appointmentService.js`
- Modify: `src/api/services/consultationService.js`
- Modify: `src/api/services/consultationMessagesService.js`
- Test: full suite and build

- [ ] **Step 1: Add a failing CI definition expectation**

```yaml
name: ci
on:
  push:
  pull_request:
jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test -- --watchAll=false
      - run: npm run build
```

- [ ] **Step 2: Make service modules pure request wrappers with no storage access**

```js
// src/api/services/patientService.js
const patientService = {
  getCurrentPatientProfile: async () => {
    const response = await apiClient.get("/api/v1/patients/patients/me");
    return response.data;
  },
  upsertPatientProfile: async (data) => {
    const response = await apiClient.put("/api/v1/patients/patients/me", data);
    return response.data;
  },
  calculateProfileCompletion(profile) {
    if (!profile) return 0;
    const requiredFields = [
      "first_name",
      "last_name",
      "country",
      "preferred_communication_method",
      "timezone",
    ];

    const completed = requiredFields.filter((field) => profile[field]).length;
    return Math.round((completed / requiredFields.length) * 100);
  },
};
```

```js
// src/api/services/adminService.js
const adminService = {
  getCurrentSystemAdminProfile: async () => {
    const response = await apiClient.get("/api/v1/admin/system-admins/me");
    return response.data;
  },
  getAdminPermissions: async () => {
    const response = await apiClient.get("/api/v1/admin/system-admins/me/permissions");
    return response.data;
  },
};
```

- [ ] **Step 3: Add real release scripts and remove build-time eslint suppression**

```json
// package.json
{
  "scripts": {
    "build": "react-scripts build",
    "test:ci": "react-scripts test --watchAll=false",
    "verify": "npm run test:ci && npm run build"
  }
}
```

- [ ] **Step 4: Update README deployment and contract guidance**

```md
## Release Verification

Run the full verification gate before deployment:

`npm run verify`

## Backend Contract Rules

- The frontend never treats network failures as login success.
- Unauthorized responses are handled through the session manager.
- Service modules do not read browser storage directly.
- Telemedicine WebSocket behavior is owned by `src/platform/realtime`.
```

- [ ] **Step 5: Run full verification**

Run: `npm test -- --watchAll=false`
Expected: PASS

Run: `npm run build`
Expected: PASS and output in `build/`

- [ ] **Step 6: Commit**

```bash
git add .github/workflows/ci.yml package.json README.md src/api/services/patientService.js src/api/services/providerService.js src/api/services/adminService.js src/api/services/staffService.js src/api/services/appointmentService.js src/api/services/consultationService.js src/api/services/consultationMessagesService.js
git commit -m "chore: add release gates and simplify service contracts"
```
