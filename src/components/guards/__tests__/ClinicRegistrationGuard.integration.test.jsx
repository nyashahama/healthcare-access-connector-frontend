import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { AuthProvider } from "context/AuthContext";
import ClinicRegistrationGuard from "components/guards/ClinicRegistrationGuard";
import { providerHandlers } from "test/handlers";
import { sessionManager } from "platform/auth/sessionManager";

const DummyPage = () => <div data-testid="provider-dashboard">Dashboard</div>;

describe("ClinicRegistrationGuard integration", () => {
  beforeEach(() => {
    sessionManager.clearSession("test-setup");
    providerHandlers.setHasClinic(false);
    queryClient.clear();
  });

  afterEach(() => {
    sessionManager.clearSession("test-cleanup");
  });

  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={["/provider/dashboard"]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  it("shows the registration modal when no clinic exists", async () => {
    sessionManager.saveSession({
      token: "valid-token",
      user: { id: "u1", role: "clinic_admin" },
      expiresAt: "2099-01-01T00:00:00Z",
    });

    render(
      <Wrapper>
        <Routes>
          <Route
            path="/provider/dashboard"
            element={
              <ClinicRegistrationGuard>
                <DummyPage />
              </ClinicRegistrationGuard>
            }
          />
        </Routes>
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /register your clinic/i })
      ).toBeInTheDocument();
    });
  });

  it("does not show the modal when a clinic exists", async () => {
    providerHandlers.setHasClinic(true);

    sessionManager.saveSession({
      token: "valid-token",
      user: { id: "u1", role: "clinic_admin" },
      expiresAt: "2099-01-01T00:00:00Z",
    });

    render(
      <Wrapper>
        <Routes>
          <Route
            path="/provider/dashboard"
            element={
              <ClinicRegistrationGuard>
                <DummyPage />
              </ClinicRegistrationGuard>
            }
          />
        </Routes>
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("provider-dashboard")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("heading", { name: /register your clinic/i })
    ).not.toBeInTheDocument();
  });
});
