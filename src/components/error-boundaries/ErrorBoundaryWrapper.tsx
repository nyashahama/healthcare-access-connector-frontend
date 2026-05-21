import React from "react";
import ErrorBoundary from "./ErrorBoundary";
import { useErrorLogger } from "hooks/useErrorLogger";

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  fallback: React.ComponentType<{ onReset: () => void; error?: Error | null; errorInfo?: React.ErrorInfo | null }>;
  context?: string;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children, fallback, context }) => {
  const logError = useErrorLogger();
  return (
    <ErrorBoundary fallback={fallback} onError={logError} context={context}>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
