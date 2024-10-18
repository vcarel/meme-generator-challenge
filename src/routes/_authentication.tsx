import { Navigate, Outlet, createFileRoute, useLocation } from "@tanstack/react-router";
import { useAuthentication } from "../helpers/authentication";

export const Route = createFileRoute("/_authentication")({
  component: Authentication,
});

function Authentication() {
  const { state } = useAuthentication();
  const { pathname } = useLocation();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" search={{ redirect: pathname }} replace />;
  }

  return <Outlet />;
}
