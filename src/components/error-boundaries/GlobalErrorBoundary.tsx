import React from "react";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import GenericErrorFallback from "./GenericErrorFallback";

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({ children }) => (
  <ErrorBoundaryWrapper fallback={GenericErrorFallback} context="global">
    {children}
  </ErrorBoundaryWrapper>
);

export default GlobalErrorBoundary;
