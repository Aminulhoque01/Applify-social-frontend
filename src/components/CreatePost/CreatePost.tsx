"use client";

import { useCreatePostMutation } from "@/src/redux/services/postApi";
import { useRef, useState } from "react";

export default function CreatePost() {
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = async () => {
    if (!text.trim() && !image) return;

    try {
      const formData = new FormData();
      formData.append("text", text);
      formData.append("isPrivate", "false");

      if (image) {
        formData.append("image", image);
      }

      await createPost(formData).unwrap();

      setText("");
      setImage(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded-2xl shadow-md border border-gray-100">
      <h2 className="font-semibold text-gray-800 mb-3">
        Create Post
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full h-28 p-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setImage(e.target.files[0]);
          }
        }}
      />

      {/* Upload button */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={handleImageClick}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
        >
          Upload Image
        </button>

        <button
          onClick={handlePost}
          disabled={isLoading || (!text.trim() && !image)}
          className={`px-5 py-2 rounded-xl font-medium text-white transition
            ${
              isLoading || (!text.trim() && !image)
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Show selected image name */}
      {image && (
        <p className="text-sm text-gray-600 mt-2">
          Selected: {image.name}
        </p>
      )}
    </div>
  );
}