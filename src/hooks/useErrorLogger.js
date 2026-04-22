import { useCallback } from "react";

export const useErrorLogger = () => {
  return useCallback((error, errorInfo, context = "unknown") => {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error(
        `[Error Boundary: ${context}]`,
        error,
        errorInfo?.componentStack || ""
      );
    }
    // Future: send to error reporting service (Sentry, LogRocket, etc.)
  }, []);
};
