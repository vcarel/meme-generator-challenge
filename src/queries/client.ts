import { QueryClient } from "@tanstack/react-query";
import { NotFoundError, UnauthorizedError } from "../api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true,
      retry(failureCount, error) {
        if (error instanceof UnauthorizedError || error instanceof NotFoundError) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
