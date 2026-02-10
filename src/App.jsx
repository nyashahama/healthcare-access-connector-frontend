import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import { ToastProvider } from "hooks/useToast";
import LandingLayout from "layouts/landing";
import LandingPage from "views/landing";
import PatientLayout from "layouts/patient";
import ProviderLayout from "layouts/provider";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ToastContainer from "components/toast/ToastContainer";
import ProfileCompletionGuard from "components/guards/ProfileCompletionGuard";
import ProtectedRoute from "components/guards/ProtectedRoute";
import PublicRoute from "components/guards/PublicRoute";

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastContainer />
        <Routes>
          {/* Landing Page Route - Publicly accessible */}
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<LandingPage />} />
          </Route>

          {/* Auth Routes - Only accessible when NOT authenticated */}
          <Route
            path="auth/*"
            element={
              <PublicRoute>
                <AuthLayout />
              </PublicRoute>
            }
          />

          {/* Patient Routes - Protected, requires patient role */}
          <Route
            path="patient/*"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ProfileCompletionGuard minCompletion={50}>
                  <PatientLayout />
                </ProfileCompletionGuard>
              </ProtectedRoute>
            }
          />

          {/* Provider Routes - Protected, requires provider roles */}
          <Route
            path="provider/*"
            element={
              <ProtectedRoute
                allowedRoles={["clinic_admin", "doctor", "nurse"]}
              >
                <ProviderLayout />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Protected, requires admin role */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* Redirect any other route to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
