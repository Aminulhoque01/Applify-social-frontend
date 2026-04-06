"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/src/redux/services/authApi";

import { FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/src/redux/authSlice";

import Editor from "../Editor";

export default function CreatePost() {
  const { data: userProfile, refetch } = useGetProfileQuery({});
  const [updateProfile, { isLoading: updating }] =
    useUpdateProfileMutation();

  const profileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ Logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // ✅ Trigger file input click
  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  // ✅ Handle file upload
  const handleProfileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await updateProfile(formData).unwrap();
      refetch(); // refresh profile after update
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {/* PROFILE HEADER */}
      <div className="bg-white p-4 rounded-2xl shadow border">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Profile Image */}
            <div
              onClick={handleProfileClick}
              className="cursor-pointer relative"
            >
              <Image
                src={
                  userProfile?.data?.profileImage ||
                  "/default-avatar.png"
                }
                width={56}
                height={56}
                alt="profile"
                className="rounded-full object-cover w-14 h-14 border"
              />

              {/* Edit Icon */}
              <span className="absolute bottom-0 right-0 bg-gray-600 text-white text-xs px-1 rounded-full">
                <FaEdit className="text-[14px]" />
              </span>
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {userProfile?.data?.firstName}{" "}
                {userProfile?.data?.lastName}
              </h2>

              <p className="text-sm text-gray-500">
                Welcome to{" "}
                <span className="font-semibold text-blue-600">
                  Applify Social
                </span>{" "}
                👋
              </p>

              {updating && (
                <p className="text-xs text-gray-400">
                  Updating photo...
                </p>
              )}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={profileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleProfileChange}
        />

        {/* Post Box */}
        <div className="pt-4">
          <Editor />
        </div>
      </div>
    </div>
  );
}