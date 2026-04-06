/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from "@/src/redux/services/commentApi";
import { useToggleLikeMutation } from "@/src/redux/services/likeApi";
import { useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function CommentSection({ postId }: any) {
  const { data, isLoading } = useGetCommentsQuery(postId);
  const [createComment] = useCreateCommentMutation();
  const [toggleLike] = useToggleLikeMutation();

  const [text, setText] = useState("");

  // ✅ Time Ago Function
  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // ✅ Create Comment
  const handleComment = async () => {
    if (!text.trim()) return;
    await createComment({ postId, text });
    setText("");
  };

  // ✅ Toggle Like (comment / reply)
  const handleLike = async (id: string, type: "comment" | "reply") => {
    try {
      await toggleLike({
        targetId: id,
        targetType: type,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-8 bg-white p-5 rounded-2xl">
      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Comments
      </h2>

      {/* Input */}
      <div className="flex items-center gap-3 mb-6">
        <input
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleComment}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition"
        >
          Post
        </button>
      </div>

      {/* Loading */}
      {isLoading && <p className="text-gray-500">Loading...</p>}

      {/* Comments */}
      <div className="space-y-5">
        {data?.data?.map((c: any) => (
          <div key={c._id} className="flex gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
               <Image
                src={c.user?.profileImage }
                width={45}
                height={45}
                alt="profile"
                className="rounded-full object-cover w-11 h-11"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <p className="text-sm font-semibold text-gray-800">
                  {c.user?.firstName } {c.user?.lastName }
                </p>
                <p className="text-gray-700 text-sm">{c.text}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1 ml-2">
                {/* Left */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleLike(c._id, "comment")}
                    className="hover:text-blue-500"
                  >
                    Like
                  </button>
                  <button className="hover:text-blue-500">Reply</button>
                  <span>{formatTime(c.createdAt)}</span>
                </div>

                {/* Right (Like Count) */}
                <div className="flex items-center gap-1">
                  {c.likesCount > 0 && (
                    <>
                      <span>{c.likesCount}</span>
                      <Heart
                        size={14}
                        className={
                          c.isLiked
                            ? "text-red-500 fill-red-500"
                            : ""
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Replies */}
              <div className="mt-3 ml-4 space-y-3">
                {c.replies?.map((r: any) => (
                  <div key={r._id} className="flex gap-2">
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">
                      {r.author?.name?.charAt(0) || "U"}
                    </div>

                    <div className="flex-1">
                      <div className="bg-gray-50 p-2 rounded-xl">
                        <p className="text-xs font-semibold">
                          {r.author?.name || "User"}
                        </p>
                        <p className="text-sm">{r.text}</p>
                      </div>

                      {/* Reply Actions */}
                      <div className="flex justify-between items-center text-xs text-gray-400 mt-1 ml-1">
                        {/* Left */}
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleLike(r._id, "reply")
                            }
                            className="hover:text-blue-400"
                          >
                            Like
                          </button>
                          <button className="hover:text-blue-400">
                            Reply
                          </button>
                          <span>{formatTime(r.createdAt)}</span>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-1">
                          {r.likesCount > 0 && (
                            <>
                              <span>{r.likesCount}</span>
                              <Heart
                                size={12}
                                className={
                                  r.isLiked
                                    ? "text-red-500 fill-red-500"
                                    : ""
                                }
                              />
                            </>
                          )}
                        </div>
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