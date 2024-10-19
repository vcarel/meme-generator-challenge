import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import {} from "@phosphor-icons/react";
import { format } from "timeago.js";
import type { GetMemeCommentsResponse } from "../api";
import { useUser } from "../queries/user";

interface Props {
  comment: GetMemeCommentsResponse["results"][number];
  memeId: string;
}

const MemeComment: React.FC<Props> = ({ comment, memeId }) => {
  const { data: author } = useUser(comment.authorId);

  return (
    <Flex>
      <Avatar
        borderWidth="1px"
        borderColor="gray.300"
        size="sm"
        name={author.username}
        src={author.pictureUrl}
        mr={2}
      />
      <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex>
            <Text data-testid={`meme-comment-author-${memeId}-${comment.id}`}>
              {author.username}
            </Text>
          </Flex>
          <Text fontStyle="italic" color="gray.500" fontSize="small">
            {format(comment.createdAt)}
          </Text>
        </Flex>
        <Text
          color="gray.500"
          whiteSpace="pre-line"
          data-testid={`meme-comment-content-${memeId}-${comment.id}`}
        >
          {comment.content}
        </Text>
      </Box>
    </Flex>
  );
};

export default MemeComment;
