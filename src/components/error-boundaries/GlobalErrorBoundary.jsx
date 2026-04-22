import React from "react";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import GenericErrorFallback from "./GenericErrorFallback";

const GlobalErrorBoundary = ({ children }) => (
  <ErrorBoundaryWrapper fallback={GenericErrorFallback} context="global">
    {children}
  </ErrorBoundaryWrapper>
);

export default GlobalErrorBoundary;
