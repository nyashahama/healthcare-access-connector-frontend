import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { AuthProvider } from "context/AuthContext";
import ProfileCompletionGuard from "components/guards/ProfileCompletionGuard";
import { patientHandlers } from "test/handlers";
import { sessionManager } from "platform/auth/sessionManager";
import patientService from "api/services/patientService";

const DummyPage = () => <div data-testid="patient-dashboard">Dashboard</div>;

describe("ProfileCompletionGuard integration", () => {
  beforeEach(() => {
    sessionManager.clearSession("test-setup");
    patientHandlers.setReturn401(false);
    queryClient.clear();
  });

  afterEach(() => {
    sessionManager.clearSession("test-cleanup");
    jest.restoreAllMocks();
  });

  const Wrapper = ({ children }) => (
    <MemoryRouter initialEntries={["/patient/dashboard"]}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  it("shows the completion modal for an incomplete profile", async () => {
    sessionManager.saveSession({
      token: "valid-token",
      user: { id: "u1", role: "patient" },
      expiresAt: "2099-01-01T00:00:00Z",
    });

    jest.spyOn(patientService, "calculateProfileCompletion").mockReturnValue(30);

    render(
      <Wrapper>
        <Routes>
          <Route
            path="/patient/dashboard"
            element={
              <ProfileCompletionGuard minCompletion={50}>
                <DummyPage />
              </ProfileCompletionGuard>
            }
          />
        </Routes>
      </Wrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /complete your profile/i })
      ).toBeInTheDocument();
    });
  });

  it("does not show the modal when the profile is complete", async () => {
    sessionManager.saveSession({
      token: "valid-token",
      user: { id: "u1", role: "patient" },
      expiresAt: "2099-01-01T00:00:00Z",
    });

    jest.spyOn(patientService, "calculateProfileCompletion").mockReturnValue(80);

    render(
      <Wrapper>
        <Routes>
          <Route
            path="/patient/dashboard"
            element={
              <ProfileCompletionGuard minCompletion={50}>
                <DummyPage />
              </ProfileCompletionGuard>
            }
          />
        </Routes>
      </Wrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("heading", { name: /complete your profile/i })
    ).not.toBeInTheDocument();
  });
});
