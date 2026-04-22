import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "platform/query/queryClient";
import { AuthProvider } from "context/AuthContext";
import { ToastProvider } from "hooks/useToast";
import ToastContainer from "components/toast/ToastContainer";
import SignIn from "../SignIn";
import { authHandlers } from "test/handlers";
import { sessionManager } from "platform/auth/sessionManager";

describe("SignIn integration", () => {
  beforeEach(() => {
    sessionManager.clearSession("test-setup");
    authHandlers.setLoginSuccess(true);
  });

  afterEach(() => {
    sessionManager.clearSession("test-cleanup");
  });

  const Wrapper = ({ children, initialEntries = ["/auth/sign-in"] }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );

  it("redirects to the role dashboard after successful login", async () => {
    render(
      <Wrapper>
        <Routes>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route
            path="/patient/dashboard"
            element={<div data-testid="patient-dashboard">Dashboard</div>}
          />
        </Routes>
      </Wrapper>
    );

    fireEvent.change(screen.getByPlaceholderText(/your.email@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByTestId("patient-dashboard")).toBeInTheDocument();
    });

    const session = sessionManager.hydrate();
    expect(session.token).toBe("test-token-abc123");
    expect(session.user?.role).toBe("patient");
  });

  it("shows an error and stays on the page after failed login", async () => {
    authHandlers.setLoginSuccess(false);

    render(
      <Wrapper>
        <Routes>
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route
            path="/patient/dashboard"
            element={<div data-testid="patient-dashboard">Dashboard</div>}
          />
        </Routes>
      </Wrapper>
    );

    fireEvent.change(screen.getByPlaceholderText(/your.email@example.com/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/min. 8 characters/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(screen.queryByTestId("patient-dashboard")).not.toBeInTheDocument();
  });
});
