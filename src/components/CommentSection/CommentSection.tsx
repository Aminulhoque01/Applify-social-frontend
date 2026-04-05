/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from "@/src/redux/services/commentApi";
import { useState } from "react";

export default function CommentSection({ postId }: any) {
  const { data, isLoading } = useGetCommentsQuery(postId);
  const [createComment] = useCreateCommentMutation();
  const [text, setText] = useState("");

  const handleComment = async () => {
    if (!text.trim()) return;
    await createComment({ postId, text });
    setText("");
  };

  return (
    <div className="mt-8 bg-white p-5 rounded-2xl shadow-md">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Comments
      </h2>

      {/* Input Section */}
      <div className="flex items-center gap-3 mb-6">
         

        {/* Input */}
        <input
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={handleComment}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
        >
          Post
        </button>
      </div>

      {/* Comments List */}
      {isLoading && <p className="text-gray-500">Loading...</p>}

      <div className="space-y-5">
        {data?.data?.map((c: any) => (
          <div key={c._id} className="flex gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
              {c.author?.name?.charAt(0) || "U"}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <p className="text-sm font-semibold text-gray-800">
                  {c.author?.name || "Unknown User"}
                </p>
                <p className="text-gray-700 text-sm">{c.text}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 text-xs text-gray-500 mt-1 ml-2">
                <button className="hover:text-blue-500">Like</button>
                <button className="hover:text-blue-500">Reply</button>
                <span>2h</span>
              </div>

              {/* Replies */}
              <div className="mt-3 ml-4 space-y-3">
                {c.replies?.map((r: any) => (
                  <div key={r._id} className="flex gap-2">
                    {/* Reply Avatar */}
                    <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">
                      {r.author?.name?.charAt(0) || "U"}
                    </div>

                    <div>
                      <div className="bg-gray-50 p-2 rounded-xl">
                        <p className="text-xs font-semibold">
                          {r.author?.name || "User"}
                        </p>
                        <p className="text-sm">{r.text}</p>
                      </div>

                      <div className="flex gap-3 text-xs text-gray-400 mt-1 ml-1">
                        <button className="hover:text-blue-400">
                          Like
                        </button>
                        <button className="hover:text-blue-400">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}