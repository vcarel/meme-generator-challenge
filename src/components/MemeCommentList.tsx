import { VStack } from "@chakra-ui/react";
import {} from "@phosphor-icons/react";
import type { GetMemesResponse } from "../api";
import { useComments } from "../queries/meme";
import MemeComment from "./MemeComment";

interface Props {
  meme: GetMemesResponse["results"][number];
}

const MemeCommentList: React.FC<Props> = ({ meme }) => {
  const { data: comments } = useComments(meme.id);

  return (
    <VStack align="stretch" spacing={4}>
      {comments.map((comment) => (
        <MemeComment key={comment.id} comment={comment} memeId={meme.id} />
      ))}
    </VStack>
  );
};

export default MemeCommentList;
