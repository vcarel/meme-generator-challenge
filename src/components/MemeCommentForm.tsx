import { Avatar, Flex, Input, Spinner } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useCreateMemeComment } from "../queries/meme";
import { useMe } from "../queries/user";

interface Props {
  memeId: string;
}

interface Form {
  comment: string;
}

const MemeCommentForm: React.FC<Props> = ({ memeId }) => {
  const { data: user } = useMe();
  const form = useForm<Form>();
  const { mutateAsync: createMemeComment, isPending } = useCreateMemeComment(memeId);

  const onSubmit = form.handleSubmit(async (data) => {
    // FIXME: Handle errors
    const comment = data.comment.trim();
    if (comment) {
      await createMemeComment({ memeId, content: data.comment });
      form.reset();
    }
  });

  return (
    <form onSubmit={onSubmit} aria-label="Add a comment">
      <Flex alignItems="center" position="relative">
        <Avatar
          borderWidth="1px"
          borderColor="gray.300"
          name={user.username}
          src={user.pictureUrl}
          size="sm"
          mr={2}
        />
        <Input
          {...form.register("comment")}
          disabled={isPending}
          placeholder="Type your comment here..."
        />
        {isPending && <Spinner color="gray.400" position="absolute" right={3} size="sm" />}
      </Flex>
    </form>
  );
};

export default MemeCommentForm;
