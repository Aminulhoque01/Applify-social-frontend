import { baseApi } from "../api/baseApi";

 

export const likeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    toggleLike: builder.mutation({
      query: (data) => ({
        url: "/likes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Post", "Comment", "Like"],
    }),

    getLikes: builder.query({
      query: ({ targetId, targetType }) =>
        `/likes?targetId=${targetId}&targetType=${targetType}`,
    }),
  }),
});

export const { useToggleLikeMutation, useGetLikesQuery } =
  likeApi;