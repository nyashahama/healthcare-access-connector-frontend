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
import ClinicRegistrationGuard from "components/guards/ClinicRegistrationGuard";
import ProtectedRoute from "components/guards/ProtectedRoute";
import PublicRoute from "components/guards/PublicRoute";
import ErrorBoundaryWrapper from "components/error-boundaries/ErrorBoundaryWrapper";
import GenericErrorFallback from "components/error-boundaries/GenericErrorFallback";
import AuthErrorFallback from "components/error-boundaries/AuthErrorFallback";
import CriticalFeatureFallback from "components/error-boundaries/CriticalFeatureFallback";

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ToastContainer />
        <Routes>
          {/* Landing Page Route - Publicly accessible */}
          <Route
            path="/"
            element={
              <ErrorBoundaryWrapper
                fallback={GenericErrorFallback}
                context="landing"
              >
                <LandingLayout />
              </ErrorBoundaryWrapper>
            }
          >
            <Route index element={<LandingPage />} />
          </Route>

          {/* Auth Routes - Only accessible when NOT authenticated */}
          <Route
            path="auth/*"
            element={
              <PublicRoute>
                <ErrorBoundaryWrapper
                  fallback={AuthErrorFallback}
                  context="auth"
                >
                  <AuthLayout />
                </ErrorBoundaryWrapper>
              </PublicRoute>
            }
          />

          {/* Patient Routes - Protected, requires patient role */}
          <Route
            path="patient/*"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ProfileCompletionGuard minCompletion={50}>
                  <ErrorBoundaryWrapper
                    fallback={(props) => (
                      <CriticalFeatureFallback
                        feature="Patient Portal"
                        {...props}
                      />
                    )}
                    context="patient"
                  >
                    <PatientLayout />
                  </ErrorBoundaryWrapper>
                </ProfileCompletionGuard>
              </ProtectedRoute>
            }
          />

          {/* Provider Routes - Protected, requires provider roles */}
          <Route
            path="provider/*"
            element={
              <ProtectedRoute
                allowedRoles={["clinic_admin", "provider_staff", "caregiver"]}
              >
                <ClinicRegistrationGuard>
                  <ErrorBoundaryWrapper
                    fallback={(props) => (
                      <CriticalFeatureFallback
                        feature="Provider Portal"
                        {...props}
                      />
                    )}
                    context="provider"
                  >
                    <ProviderLayout />
                  </ErrorBoundaryWrapper>
                </ClinicRegistrationGuard>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Protected, requires admin role */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute allowedRoles={["admin", "system_admin"]}>
                <ErrorBoundaryWrapper
                  fallback={(props) => (
                    <CriticalFeatureFallback
                      feature="Admin Portal"
                      {...props}
                    />
                  )}
                  context="admin"
                >
                  <AdminLayout />
                </ErrorBoundaryWrapper>
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
