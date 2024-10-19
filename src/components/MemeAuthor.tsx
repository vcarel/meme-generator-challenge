import { Avatar, Flex, Text } from "@chakra-ui/react";
import type { GetMemesResponse } from "../api";
import { useUser } from "../queries/user";

interface Props {
  meme: GetMemesResponse["results"][number];
}

const MemeAuthor: React.FC<Props> = ({ meme }) => {
  const { data: author } = useUser(meme.authorId);

  return (
    <Flex>
      <Avatar
        borderWidth="1px"
        borderColor="gray.300"
        size="xs"
        name={author.username}
        src={author.pictureUrl}
      />
      <Text ml={2} data-testid={`meme-author-${meme.id}`}>
        {author.username}
      </Text>
    </Flex>
  );
};

export default MemeAuthor;
