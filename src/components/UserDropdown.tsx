import { Avatar, Flex, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { CaretDown, CaretUp, SignOut } from "@phosphor-icons/react";
import { useAuthentication } from "../helpers/authentication";
import { useMe } from "../queries/user";

export const UserDropdown: React.FC = () => {
  const { signout } = useAuthentication();
  const { data: user } = useMe();

  return (
    <Menu>
      {({ isOpen }) => (
        <>
          <MenuButton>
            <Flex direction="row" alignItems="center">
              <Avatar
                size="xs"
                mr={2}
                name={user.username}
                src={user.pictureUrl}
                border="1px solid white"
              />
              <Text color="white">{user.username}</Text>
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
