import { baseApi } from "../api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ CREATE CONVERSATION
    createConversation: builder.mutation({
      query: (receiverId) => ({
        url: "/chat/conversation",
        method: "POST",
        body: { receiverId },
      }),

      invalidatesTags: ["chat"],
    }),

    // ✅ GET ALL CONVERSATIONS
    getConversations: builder.query({
      query: () => ({
        url: "/chat/conversation",
        method: "GET",
      }),

      providesTags: ["chat"],
    }),

    // ✅ GET MESSAGES
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/chat/messages/${conversationId}`,
        method: "GET",
      }),

      providesTags: ["chat"],
    }),

    // ✅ SEND MESSAGE
    sendMessage: builder.mutation({
      query: (data) => ({
        url: "/chat/message",
        method: "POST",
        body: data,
      }),

      invalidatesTags: ["chat"],
    }),

  }),
});

export const {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
} = chatApi;