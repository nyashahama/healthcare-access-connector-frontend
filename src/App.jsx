import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LandingLayout from "layouts/landing";
import LandingPage from "views/landing";
import PatientLayout from "layouts/patient";
import ProviderLayout from "layouts/provider";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ToastContainer from "components/toast/ToastContainer";

import { ToastProvider } from "./hooks/useToast";

const App = () => {
  return (
    <ToastProvider>
      <ToastContainer />
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<LandingPage />} />
        </Route>

        {/* Auth Routes */}
        <Route path="auth/*" element={<AuthLayout />} />

        {/* Protected Routes */}
        <Route path="patient/*" element={<PatientLayout />} />
        <Route path="provider/*" element={<ProviderLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />

        {/* Redirect any other route to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;
