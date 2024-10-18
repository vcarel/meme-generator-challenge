import { useMutation, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  type GetMemeCommentsResponse,
  type GetMemesResponse,
  type GetUserByIdResponse,
  createMemeComment,
  getMemeComments,
  getMemePage,
} from "../api";
import { useAuthToken } from "../helpers/authentication";
import { getCachedUser } from "./user";

export const usePaginatedMemeList = () => {
  // To understand how getNextPageParam and getPreviousPageParam work, please read:
  // https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries#what-if-my-api-doesnt-return-a-cursor

  const token = useAuthToken();

  return useSuspenseInfiniteQuery({
    queryKey: ["memes"],
    queryFn: async ({ pageParam }) => {
      const rawPage = await getMemePage(token, pageParam);
      return {
        ...rawPage,
        results: await Promise.all(
          rawPage.results.map(async (meme) => {
            const author = await getCachedUser(token, meme.authorId);

            const comments: GetMemeCommentsResponse["results"] = [];
            const firstCommentPage = await getMemeComments(token, meme.id, 1);
            comments.push(...firstCommentPage.results);

            const commentPageCount = Math.ceil(firstCommentPage.total / firstCommentPage.pageSize);

            for (let i = 2; i <= commentPageCount; i++) {
              const page = await getMemeComments(token, meme.id, i);
              comments.push(...page.results);
            }

            const commentsWithAuthor: (GetMemeCommentsResponse["results"][0] & {
              author: GetUserByIdResponse;
            })[] = [];

            for (const comment of comments) {
              const author = await getCachedUser(token, comment.authorId);
              commentsWithAuthor.push({ ...comment, author });
            }

            return { ...meme, author, comments: commentsWithAuthor };
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
