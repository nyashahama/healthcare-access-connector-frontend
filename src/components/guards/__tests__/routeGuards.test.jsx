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
  const routerFuture = {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  };

  it("renders the sign-in recovery UI for anonymous users", () => {
    render(
      <MemoryRouter
        future={routerFuture}
        initialEntries={["/patient/dashboard"]}
      >
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
