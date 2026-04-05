import { baseApi } from "../api/baseApi";

 

export const commentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: ({ postId, text }) => ({
        url: `/comment/${postId}`,
        method: "POST",
        body: { text },
      }),
      invalidatesTags: ["comment"],
    }),

    getComments: builder.query({
      query: (postId) => `/comment/${postId}`,
      providesTags: ["comment"],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetCommentsQuery,
} = commentApi;