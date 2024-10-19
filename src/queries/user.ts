import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { getUserById, login } from "../api";
import { useAuthToken, useAuthentication } from "../helpers/authentication";

// ----------------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------------

export const useMe = () => {
  const { state } = useAuthentication();

  if (!state.isAuthenticated) {
    throw new Error("User is not authenticated");
  }

  return useUser(state.userId);
};

export const useUser = (userId: string) => {
  const token = useAuthToken();

  return useSuspenseQuery({
    queryKey: ["user", userId],
    queryFn: async () => await getUserById(token, userId),
  });
};

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export type UserCredentials = {
  username: string;
  password: string;
};

export const useLoginUser = () => {
  const { authenticate } = useAuthentication();

  return useMutation({
    mutationFn: (data: UserCredentials) => login(data.username, data.password),
    onSuccess: ({ jwt }) => authenticate(jwt),
  });
};
