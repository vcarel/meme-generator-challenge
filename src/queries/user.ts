import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { getUserById, login } from "../api";
import { useAuthToken, useAuthentication } from "../helpers/authentication";

export const useUser = () => {
  const token = useAuthToken();

  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: async () => await getUserById(token, jwtDecode<{ id: string }>(token).id),
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
