import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { AuthProvider } from "context/AuthContext";
import ProtectedRoute from "components/guards/ProtectedRoute";
import { patientHandlers } from "test/handlers";
import { sessionManager } from "platform/auth/sessionManager";
import apiClient from "api/apiClient";

const DummyPatientPage = () => <div data-testid="patient-page">Patient Page</div>;

describe("Session expiry integration", () => {
  beforeEach(() => {
    sessionManager.clearSession("test-setup");
  });

  afterEach(() => {
    sessionManager.clearSession("test-cleanup");
    patientHandlers.setReturn401(false);
  });

  it("clears session when a 401 is received", async () => {
    // Pre-seed a valid session
    sessionManager.saveSession({
      token: "expired-token",
      user: { id: "u1", role: "patient" },
      expiresAt: "2099-01-01T00:00:00Z",
    });

    // Force the patient endpoint to return 401
    patientHandlers.setReturn401(true);

    // Make a request that will trigger the 401 interceptor
    try {
      await apiClient.get("/api/v1/patients/patients/me");
    } catch {
      // Expected to fail
    }

    // Session should be cleared by the HTTP client's onUnauthorized handler
    const session = sessionManager.hydrate();
    expect(session.token).toBeNull();
  });

  it("shows recovery UI when the auth context detects an empty session", async () => {
    render(
      <MemoryRouter initialEntries={["/patient/dashboard"]}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Routes>
              <Route
                path="/patient/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["patient"]}>
                    <DummyPatientPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/access denied/i)).toBeInTheDocument();
    });
  });
});
