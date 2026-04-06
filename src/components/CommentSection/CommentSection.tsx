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
  const { data, isLoading, refetch } = useGetCommentsQuery(postId);
  const [createComment] = useCreateCommentMutation();
  const [toggleLike] = useToggleLikeMutation();

  const [text, setText] = useState(""); // main comment input
  const [replyText, setReplyText] = useState<any>({}); // replies per comment

  // Time ago function
  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  // Create Comment
  const handleComment = async () => {
    if (!text.trim()) return;
    try {
      await createComment({ postId, text }).unwrap();
      setText("");
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  // Create Reply
 const handleReply = async (parentCommentId: string) => {
  const reply = replyText[parentCommentId];
  if (!reply?.trim()) return;

  try {
    // Include parent comment user name in text (optional)
    const parentComment = data?.data?.find((c: any) => c._id === parentCommentId);
    const parentUserName = parentComment ? parentComment.user.firstName : "";

    await createComment({
      postId,
      text: `@${parentUserName} ${reply}`, // mention original commenter
      parentComment: parentCommentId,
    }).unwrap();

    setReplyText({ ...replyText, [parentCommentId]: "" });
    refetch();
  } catch (err) {
    console.error(err);
  }
};

  // Toggle Like
  const handleLike = async (id: string, type: "comment" | "reply") => {
    try {
      await toggleLike({
        targetId: id,
        targetType: type,
      }).unwrap();
      refetch();
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

      {/* Input for main comment */}
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

      {isLoading && <p className="text-gray-500">Loading...</p>}

      {/* Comments */}
      <div className="space-y-5">
        {data?.data?.map((c: any) => (
          <div key={c._id} className="flex gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
              <Image
                src={c.user?.profileImage || "/default.png"}
                width={36}
                height={36}
                alt="profile"
                className="rounded-full object-cover w-9 h-9"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <p className="text-sm font-semibold text-gray-800">
                  {c.user?.firstName} {c.user?.lastName}
                </p>
                <p className="text-gray-700 text-sm">{c.text}</p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-1 ml-2">
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

                <div className="flex items-center gap-1">
                  {c.totalLikes > 0 && (
                    <>
                      <span>{c.totalLikes}</span>
                      <Heart
                        size={14}
                        className={
                          c.likedByMe
                            ? "text-red-500 fill-red-500"
                            : ""
                        }
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Reply Input */}
              <div className="ml-4 mt-2 flex gap-2">
                <input
                  className="flex-1 bg-gray-200 px-3 py-1 rounded-full outline-none"
                  placeholder="Write a reply..."
                  value={replyText[c._id] || ""}
                  onChange={(e) =>
                    setReplyText({
                      ...replyText,
                      [c._id]: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() => handleReply(c._id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs"
                >
                  Reply
                </button>
              </div>

              {/* Replies */}
              <div className="mt-3 ml-4 space-y-3">
                {c.replies?.map((r: any) => (
                  <div key={r._id} className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-green-400 flex items-center justify-center text-white text-xs font-bold">
                      {r.user?.firstName?.charAt(0) || "U"}
                    </div>

                    <div className="flex-1">
                      <div className="bg-gray-50 p-2 rounded-xl">
                        <p className="text-xs font-semibold">
                          {r.user?.firstName} {r.user?.lastName}
                        </p>
                        <p className="text-sm">{r.text}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-400 mt-1 ml-1">
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              handleLike(r._id, "reply")
                            }
                            className="hover:text-blue-400"
                          >
                            Like
                          </button>
                          <span>{formatTime(r.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {r.totalLikes > 0 && (
                            <>
                              <span>{r.totalLikes}</span>
                              <Heart
                                size={12}
                                className={
                                  r.likedByMe
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