import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { type GetUserByIdResponse, getUserById, login } from "../api";
import { useAuthentication } from "../helpers/authentication";
import { queryClient } from "./client";

export const cachedGetUser = async (token: string, userId: string) => {
  let user = queryClient.getQueryData<GetUserByIdResponse>(["user", userId]);

  if (!user) {
    user = await getUserById(token, userId);
    queryClient.setQueryData(["user", userId], user);
  }

  return user;
};

export const useUser = () => {
  const { state } = useAuthentication();

  if (!state.isAuthenticated) {
    throw new Error("User is not authenticated");
  }

  return useSuspenseQuery({
    queryKey: ["user", state.userId],
    queryFn: async () => await getUserById(state.token, jwtDecode<{ id: string }>(state.token).id),
  });
};

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
