import { useContext } from "react";
import { AuthenticationContext } from "../contexts/authentication";

export function useAuthentication() {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error("useAuthentication must be used within an AuthenticationProvider");
  }
  return context;
}

export function useAuthToken() {
  const { state } = useAuthentication();
  if (!state.isAuthenticated) {
    throw new Error("User is not authenticated");
  }
  return state.token;
}
