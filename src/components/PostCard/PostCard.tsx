/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useToggleLikeMutation } from "@/src/redux/services/likeApi";
import CommentSection from "../CommentSection/CommentSection";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function PostCard({ post }: any) {
  const [toggleLike, { isLoading }] = useToggleLikeMutation();
  

  const [liked, setLiked] = useState(post.isLiked);  

  const handleLike = async () => {
    setLiked(!liked);

    try {
      await toggleLike({
        targetId: post._id,
        targetType: "post",
      });
    } catch (error) {
      console.error(error);
      setLiked(liked);  
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-5 max-w-2xl mx-auto">
      
      {/* Post Image */}
      {post.image && (
        <div className="w-full">
          <Image
            src={post.image}
            width={300}
            height={300}
            alt="Post"
            className="w-full h-[400px] object-cover"
          />
        </div>
      )}

      {/* Post Content */}
      <div className="p-4">
        <p className="text-gray-800 text-base leading-7">{post.text}</p>

        {/* Like + Comment Actions */}
        <div className="flex items-center gap-6 mt-4 border-t pt-3">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition duration-200"
          >
                <Heart
                    size={20}
                    className={`transition ${
                        liked ? "text-red-500 fill-red-500" : "text-gray-600"
                    }`}
                />
            <span className="font-medium">Like</span>
          </button>

          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition duration-200">
            <MessageCircle size={20} />
            <span className="font-medium">Comment</span>
          </button>
        </div>

        {/* Comment Section */}
        <div className="mt-4">
          <CommentSection postId={post._id} />
        </div>
      </div>
    </div>
  );
}