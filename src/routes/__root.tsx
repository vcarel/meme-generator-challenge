import { Button, Flex, HStack, Heading, Icon, StackDivider } from "@chakra-ui/react";
import { Plus } from "@phosphor-icons/react";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { UserDropdown } from "../components/UserDropdown";
import type { AuthenticationState } from "../contexts/authentication";
import { useAuthentication } from "../helpers/authentication";

function Root() {
  const { state } = useAuthentication();
  return (
    <Flex width="full" height="full" direction="column">
      {/* Header */}
      <Flex bgColor="cyan.600" p={2} justifyContent="space-between" boxShadow="md">
        {/* Title */}
        <Heading size="lg" color="white">
          MemeFactory
        </Heading>
        {state.isAuthenticated && (
          <HStack alignItems="center" divider={<StackDivider border="white" />}>
            <Button as={Link} size="sm" leftIcon={<Icon as={Plus} />} to="/create">
              Create a meme
            </Button>
            <UserDropdown />
          </HStack>
        )}
      </Flex>
      <Flex flexGrow={1} height={0}>
        <Outlet />
      </Flex>
    </Flex>
  );
}

export type RouterContext = {
  authState: AuthenticationState;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: Root,
});
