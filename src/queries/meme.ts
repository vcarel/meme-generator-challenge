import { useMutation, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { createMemeComment, getMemeComments, getMemePage } from "../api";
import { useAuthToken } from "../helpers/authentication";
import { cachedGetUser } from "./user";

const getCommentsWithAuthors = async (token: string, memeId: string) => {
  // First, load raw comments using paralleled fetches
  const firstPage = await getMemeComments(token, memeId, 1);
  const pageCount = Math.ceil(firstPage.total / firstPage.pageSize);
  const nextPages = await Promise.all(
    Array.from({ length: pageCount - 1 }, (_, i) => 2 + i).map((i) =>
      getMemeComments(token, memeId, i),
    ),
  );

  const comments = [firstPage, ...nextPages].flatMap((page) => page.results);

  // Load all authors in react-query cache
  const authorIds = Array.from(new Set(comments.map((comment) => comment.authorId)));
  await Promise.all(authorIds.map((id) => cachedGetUser(token, id)));

  // Then map authors in comments
  return Promise.all(
    comments.map(async (comment) => ({
      ...comment,
      author: await cachedGetUser(token, comment.authorId),
    })),
  );
};

export const usePaginatedMemeList = () => {
  // To understand how getNextPageParam and getPreviousPageParam work, please read:
  // https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries#what-if-my-api-doesnt-return-a-cursor

  const token = useAuthToken();

  return useSuspenseInfiniteQuery({
    queryKey: ["memes"],
    queryFn: async ({ pageParam }) => {
      const page = await getMemePage(token, pageParam);

      return {
        ...page,
        results: await Promise.all(
          page.results.map(async (meme) => {
            const author = await cachedGetUser(token, meme.authorId);
            const comments = await getCommentsWithAuthors(token, meme.id);
            return { ...meme, author, comments };
          }),
        ),
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.pageSize === 0) {
        return undefined;
      }
      return lastPageParam + 1;
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined;
      }
      return firstPageParam - 1;
    },
  });
};

export const useCreateMemeComment = () => {
  const token = useAuthToken();

  return useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      await createMemeComment(token, data.memeId, data.content);
    },
  });
};
