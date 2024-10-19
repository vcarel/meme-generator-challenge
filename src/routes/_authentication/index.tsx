import {
  Box,
  Button,
  Collapse,
  Flex,
  Icon,
  LinkBox,
  LinkOverlay,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "timeago.js";
import { Loader } from "../../components/Loader";
import MemeAuthor from "../../components/MemeAuthor";
import MemeCommentForm from "../../components/MemeCommentForm";
import MemeCommentList from "../../components/MemeCommentList";
import { MemePicture } from "../../components/MemePicture";
import { usePaginatedMemeList } from "../../queries/meme";

export const MemeFeedPage: React.FC = () => {
  const { data: paginatedMemeList, fetchNextPage, isFetchingNextPage } = usePaginatedMemeList();
  const memes = [...paginatedMemeList.pages.flatMap((page) => page.results)];
  const [openedCommentSection, setOpenedCommentSection] = useState<string | null>(null);

  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack p={4} width="full" maxWidth={800} divider={<StackDivider border="gray.200" />}>
        {memes?.map((meme) => {
          return (
            <VStack key={meme.id} p={4} width="full" align="stretch">
              <Flex justifyContent="space-between" alignItems="center">
                <MemeAuthor meme={meme} />
                <Text fontStyle="italic" color="gray.500" fontSize="small">
                  {format(meme.createdAt)}
                </Text>
              </Flex>
              <MemePicture
                pictureUrl={meme.pictureUrl}
                texts={meme.texts}
                dataTestId={`meme-picture-${meme.id}`}
              />
              <Box>
                <Text fontWeight="bold" fontSize="medium" mb={2}>
                  Description:{" "}
                </Text>
                <Box p={2} borderRadius={8} border="1px solid" borderColor="gray.100">
                  <Text
                    color="gray.500"
                    whiteSpace="pre-line"
                    data-testid={`meme-description-${meme.id}`}
                  >
                    {meme.description}
                  </Text>
                </Box>
              </Box>
              <LinkBox as={Box} py={2} borderBottom="1px solid black">
                <Flex justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center">
                    <LinkOverlay
                      data-testid={`meme-comments-section-${meme.id}`}
                      cursor="pointer"
                      onClick={() =>
                        setOpenedCommentSection(openedCommentSection === meme.id ? null : meme.id)
                      }
                    >
                      <Text data-testid={`meme-comments-count-${meme.id}`}>
                        {meme.commentsCount} comments
                      </Text>
                    </LinkOverlay>
                    <Icon
                      as={openedCommentSection !== meme.id ? CaretDown : CaretUp}
                      ml={2}
                      mt={1}
                    />
                  </Flex>
                  <Icon as={Chat} />
                </Flex>
              </LinkBox>
              <Collapse in={openedCommentSection === meme.id} animateOpacity>
                <Box mb={6}>
                  <MemeCommentForm memeId={meme.id} />
                </Box>
                <MemeCommentList meme={meme} />
              </Collapse>
            </VStack>
          );
        })}

        <Box mt={8} pb={16}>
          <Button isLoading={isFetchingNextPage} size="sm" onClick={() => fetchNextPage()}>
            Show more memes
          </Button>
        </Box>
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
  pendingComponent: Loader,
});
