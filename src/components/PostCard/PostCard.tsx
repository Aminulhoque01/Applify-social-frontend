/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetLikesQuery, useToggleLikeMutation } from "@/src/redux/services/likeApi";
import CommentSection from "../CommentSection/CommentSection";
import { Heart, MessageCircle, Clock3, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/src/redux/services/authApi";
import { useDeletePostMutation } from "@/src/redux/services/postApi";

export default function PostCard({ post }: any) {
  const { data: userProfile } = useGetProfileQuery({});
  const currentUser = userProfile?.data;
   
  const [updateProfile, { isLoading: updating }] =
    useUpdateProfileMutation();

  const [deletePost, { isLoading: deleting }] =
    useDeletePostMutation();
   
  const [toggleLike, { isLoading }] = useToggleLikeMutation();

  const [liked, setLiked] = useState(post.likedByMe || false);
  
  const [likeCount, setLikeCount] = useState(post.totalLikes || 0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOwnPost = currentUser?._id === post.user?._id;

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await updateProfile(formData).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async () => {
    const previousLiked = liked;
    const previousCount = likeCount;

    // Optimistic UI
    setLiked(!previousLiked);
    setLikeCount(
      previousLiked ? previousCount - 1 : previousCount + 1
    );

    try {
      const res = await toggleLike({
        targetId: post._id,
        targetType: "post",
      }).unwrap();

      setLiked(res.data.liked);
      setLikeCount(res.data.totalLikes);
    } catch (error) {
      console.error(error);

      // rollback
      setLiked(previousLiked);
      setLikeCount(previousCount);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(post._id).unwrap();
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const timeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000
    );

    const intervals = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count > 0) {
        return `${count} ${interval.label}${
          count > 1 ? "s" : ""
        } ago`;
      }
    }

    return "Just now";
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-5 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <div onClick={handleImageClick} className="cursor-pointer">
            <Image
              src={post.user?.profileImage}
              width={45}
              height={45}
              alt="profile"
              className="rounded-full object-cover w-11 h-11"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">
              {post.user?.firstName} {post.user?.lastName}
            </h3>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock3 size={14} />
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>

          {isOwnPost && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        {updating && (
          <p className="text-xs text-gray-500 px-4 pb-2">
            Uploading profile image...
          </p>
        )}

        {/* Text */}
        <div className="px-4 pb-3">
          <div
            className="text-gray-800 text-base leading-7 whitespace-pre-wrap break-words"
            dangerouslySetInnerHTML={{ __html: post.text }}
          />
        </div>

        {/* Image */}
        {post.image && (
          <div className="w-full">
            <Image
              src={post.image}
              width={800}
              height={500}
              alt="Post"
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Like Count Text */}
        {likeCount > 0 && (
          <p className="px-4 py-2 text-sm text-gray-500">
           {likeCount.user?.firstName} {likeCount} people liked this post
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 px-4 py-3 border-t">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
          >
            <Heart
              size={20}
              className={`transition ${
                liked
                  ? "text-red-500 fill-red-500"
                  : "text-gray-600"
              }`}
            />
            <span className="font-medium">
              Like {likeCount > 0 && `(${likeCount})`}
            </span>
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
            <MessageCircle size={20} />
            <span className="font-medium">Comment</span>
          </button>
        </div>

        <div className="px-4 pb-4">
          <CommentSection postId={post._id} />
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Delete Post</h2>
              <button onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}