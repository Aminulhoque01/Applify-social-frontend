import { baseApi } from "../api/baseApi";


export const postApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/post",
      providesTags: ["post"],
    }),

    createPost: builder.mutation({
      query: (data) => ({
        url: "/post",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["post"],
    }),

    deletePost:builder.mutation({
       query: (id) => ({
        url: `/post/${id}`,
        method: "DELETE",
        
      }),
      invalidatesTags: ["post"]
    })
  }),
});

export const { useGetPostsQuery, useCreatePostMutation, useDeletePostMutation } = postApi;