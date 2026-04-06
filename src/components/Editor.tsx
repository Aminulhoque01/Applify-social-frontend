"use client";

import React, { useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useCreatePostMutation } from "../redux/services/postApi";
import Image from "next/image";

// SSR off for Quill
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading Editor...</p>,
});

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [createPost, { isLoading }] = useCreatePostMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handlePostImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Check editor empty
  const isEmpty =
    !content || content.replace(/<(.|\n)*?>/g, "").trim() === "";

  const handlePost = async () => {
    if (isEmpty && !image) return;

    try {
      const formData = new FormData();

      // Quill HTML content
      formData.append("text", content);
      formData.append("isPrivate", "false");

      if (image) {
        formData.append("image", image);
      }

      await createPost(formData).unwrap();

      // reset form
      setContent("");
      setImage(null);
      setPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Post create failed:", err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Editor */}
      <div className="border rounded-xl h-[300] ">
      <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder={`What's on your mind ?`}
          className=" h-[250] "
        />
      </div>

      {/* Image Preview */}
      {preview && (
        <div className="mt-16">
          <Image
            src={preview}
            alt="Preview"
            width={80}
            height={80}
            className="w-full h-64 object-cover rounded-xl border"
          />
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePostImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Buttons */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={handleImageClick}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
        >
          Add Photo
        </button>

        <button
          onClick={handlePost}
          disabled={isLoading || (isEmpty && !image)}
          className={`px-5 py-2 rounded-xl font-medium text-white transition
          ${
            isLoading || (isEmpty && !image)
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}