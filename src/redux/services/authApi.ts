import { baseApi } from "../api/baseApi";

 

export const authApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // 👉 Get profile
    getProfile: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // 👉 Update profile
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: "/auth/",
        method: "PUT",
        body: formData, // ⚠️ FormData
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useGetProfileQuery, useUpdateProfileMutation } = authApi;