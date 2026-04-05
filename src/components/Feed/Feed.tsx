/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/src/hooks/useAuth";
import { useGetPostsQuery } from "@/src/redux/services/postApi";
import CreatePost from "../CreatePost/CreatePost";
import PostCard from "../PostCard/PostCard";

 

export default function Feed() {
  useAuth();

  const { data } = useGetPostsQuery("");

  return (
    <div className="max-w-xl mx-auto">
      <CreatePost />
      {data?.data?.map((post: any) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}