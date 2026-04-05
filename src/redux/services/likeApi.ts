import { baseApi } from "../api/baseApi";

 

export const likeApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    toggleLike: builder.mutation({
      query: (data) => ({
        url: "/like",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["post", "comment", "Like"],
    }),

    getLikes: builder.query({
      query: ({ targetId, targetType }) =>
        `/likes?targetId=${targetId}&targetType=${targetType}`,
    }),
  }),
});

export const { useToggleLikeMutation, useGetLikesQuery } =
  likeApi;