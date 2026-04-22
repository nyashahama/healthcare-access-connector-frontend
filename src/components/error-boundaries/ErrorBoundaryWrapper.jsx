import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { useErrorLogger } from "hooks/useErrorLogger";

const ErrorBoundaryWrapper = ({ children, fallback, context }) => {
  const logError = useErrorLogger();
  return (
    <ErrorBoundary fallback={fallback} onError={logError} context={context}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
