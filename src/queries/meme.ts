import { useMutation, useSuspenseInfiniteQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createMemeComment, getMemeComments, getMemePage } from "../api";
import { useAuthToken } from "../helpers/authentication";
import { queryClient } from "./client";

// ----------------------------------------------------------------------------
// Queries
// ----------------------------------------------------------------------------

export const usePaginatedMemeList = () => {
  // To understand how getNextPageParam and getPreviousPageParam work, please read:
  // https://tanstack.com/query/v5/docs/framework/react/guides/infinite-queries#what-if-my-api-doesnt-return-a-cursor

  const token = useAuthToken();

  return useSuspenseInfiniteQuery({
    queryKey: ["memes"],
    queryFn: async ({ pageParam }) => await getMemePage(token, pageParam),
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

export const useComments = (memeId: string) => {
  const token = useAuthToken();

  return useSuspenseQuery({
    queryKey: ["memes", memeId, "comments"],
    queryFn: async () => {
      const firstPage = await getMemeComments(token, memeId, 1);
      const pageCount = Math.ceil(firstPage.total / firstPage.pageSize);
      const nextPages = await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, i) => 2 + i).map((i) =>
          getMemeComments(token, memeId, i),
        ),
      );
      return [firstPage, ...nextPages].flatMap((page) => page.results);
    },
  });
};

// ----------------------------------------------------------------------------
// Mutations
// ----------------------------------------------------------------------------

export const useCreateMemeComment = (memeId: string) => {
  const token = useAuthToken();

  return useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      await createMemeComment(token, data.memeId, data.content);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["memes", memeId, "comments"] });
    },
  });
};
