import { baseApi } from "../api/baseApi";

 

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📩 Get all notifications
    getNotifications: builder.query({
      query: () => "/notifications",
      providesTags: ["notification"],
    }),

    // 🔢 Unread count
    getUnreadCount: builder.query({
      query: () => "/notifications/unread-count",
      providesTags: ["notification"],
    }),

    // ✔ Mark single as read
    markAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),

    // ✔ Mark all as read
    markAllAsRead: builder.mutation({
      query: () => ({
        url: `/notifications/read-all`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;