import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => error?.kind === "network" && count < 2,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});
