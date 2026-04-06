/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToggleLikeMutation } from "@/src/redux/services/likeApi";
import CommentSection from "../CommentSection/CommentSection";
import { Heart, MessageCircle, Clock3 } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/src/redux/services/authApi";

export default function PostCard({ post }: any) {
  const { data: userProfile } = useGetProfileQuery({});
  const [updateProfile, { isLoading: updating }] =useUpdateProfileMutation();
 
 

  const [toggleLike, { isLoading }] = useToggleLikeMutation();
  const [liked, setLiked] = useState(post.isLiked);

  // 👉 file input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 👉 image click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 👉 image change (upload)
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

  // 👉 like handler
  const handleLike = async () => {
    setLiked(!liked);

    try {
      await toggleLike({
        targetId: post?._id,
        targetType: "post",
      }).unwrap();
       
    } catch (error) {
      console.error(error);
      setLiked(!liked);
    }
  };

  // 👉 time ago function
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

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
        return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "Just now";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-5 max-w-2xl mx-auto">
      
      {/* Header User Info */}
      <div className="flex items-center gap-3 p-4">

        {/* 👉 CLICKABLE PROFILE IMAGE */}
        <div onClick={handleImageClick} className="cursor-pointer">
          <Image
            src={
              post.user?.profileImage }
            width={45}
            height={45}
            alt="profile"
            className="rounded-full object-cover w-11 h-11"
          />
        </div>

        {/* 👉 hidden file input */}
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
      </div>

      {/* 👉 uploading status */}
      {updating && (
        <p className="text-xs text-gray-500 px-4 pb-2">
          Uploading profile image...
        </p>
      )}

      {/* Post Text */}
    <div className="px-4 pb-3">
      <div className="">
        <p
          className="text-gray-800 text-base leading-7 whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ __html: post.text }}
        />
      </div>
    </div>
      {/* Post Image */}
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

      {/* Like + Comment */}
      <div className="flex items-center gap-6 px-4 py-3 border-t">
        <button
          onClick={handleLike}
          disabled={isLoading}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
        >
          <Heart
            size={20}
            className={`transition ${
              liked ? "text-red-500 fill-red-500" : "text-gray-600"
            }`}
          />
          <span className="font-medium">Like</span>
        </button>

        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition">
          <MessageCircle size={20} />
          <span className="font-medium">Comment</span>
        </button>
      </div>

      {/* Comments */}
      <div className="px-4 pb-4">
        <CommentSection postId={post._id} />
      </div>
    </div>
  );
}