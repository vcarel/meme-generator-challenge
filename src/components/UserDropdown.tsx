import { Avatar, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { CaretDown, CaretUp, SignOut } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../api";
import { useAuthentication } from "../helpers/authentication";

export const UserDropdown: React.FC = () => {
  const { state, signout } = useAuthentication();
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", state.isAuthenticated ? state.userId : "anon"],
    queryFn: () => {
      if (state.isAuthenticated) {
        return getUserById(state.token, state.userId);
      }
      return null;
    },
    enabled: state.isAuthenticated,
  });

  if (!state.isAuthenticated || isLoading) {
    return null;
  }

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton>
            <Flex direction="row" alignItems="center">
              <Avatar
                size="xs"
                mr={2}
                name={user?.username}
                src={user?.pictureUrl}
                border="1px solid white"
              />
              <Text color="white">{user?.username}</Text>
              <Icon color="white" ml={2} as={isOpen ? CaretUp : CaretDown} mt={1} />
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<Icon as={SignOut} />} onClick={signout}>
              Sign Out
            </MenuItem>
          </MenuList>
        </>
      )}
    </Menu>
  );
};
