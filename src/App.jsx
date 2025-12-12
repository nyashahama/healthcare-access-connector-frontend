import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

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
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="patient/*" element={<PatientLayout />} />
        <Route path="provider/*" element={<ProviderLayout />} />
        <Route path="admin/*" element={<AdminLayout />} />
        <Route path="/" element={<Navigate to="/auth/sign-in" replace />} />
      </Routes>
    </ToastProvider>
  );
};

export default App;
