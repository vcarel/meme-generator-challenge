import {
  type ListenerFn,
  Outlet,
  type RouterEvents,
  RouterProvider,
  createMemoryHistory,
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import React, { type PropsWithChildren, type FC } from "react";
import type { routeTree } from "../routeTree.gen";
import type { RouterContext } from "../routes/__root";

function createTestRouter(component: FC, currentUrl: string) {
  const rootRoute = createRootRouteWithContext<RouterContext>()({
    component: Outlet,
  });

  const componentRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: currentUrl.split("?")[0],
    component,
  });

  const router = createRouter({
    context: { authState: { isAuthenticated: false } },
    routeTree: rootRoute.addChildren([componentRoute]) as unknown as typeof routeTree, // See https://github.com/TanStack/router/issues/1745
    history: createMemoryHistory({ initialEntries: [currentUrl] }),
  });

  return router;
}

type RenderWithRouterParams = {
  component: FC;
  Wrapper?: React.ComponentType<PropsWithChildren>;
  onNavigate?: ListenerFn<RouterEvents["onBeforeNavigate"]>;
  currentUrl?: string;
};

export function renderWithRouter({
  component,
  Wrapper = React.Fragment,
  onNavigate = () => {},
  currentUrl = "/",
}: RenderWithRouterParams) {
  const router = createTestRouter(component, currentUrl);
  router.subscribe("onBeforeNavigate", onNavigate);
  const renderResult = render(
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>,
  );

  return {
    router,
    renderResult,
  };
}
