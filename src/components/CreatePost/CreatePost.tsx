"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { FaEdit, FaBell } from "react-icons/fa";
import Link from "next/link";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/src/redux/services/authApi";

import { useNotification } from "@/src/hooks/useNotification";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/src/redux/authSlice";

import Editor from "../Editor";

export default function CreatePost() {
  const { data: userProfile, refetch } = useGetProfileQuery({});
  const [updateProfile, { isLoading: updating }] =
    useUpdateProfileMutation();

  const { count } = useNotification();

  const [openNotif, setOpenNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const router = useRouter();

  const user = userProfile?.data?.user;
  const followersCount = userProfile?.data?.followersCount || 0;
  const followingCount = userProfile?.data?.followingCount || 0;

  // 🔴 CLOSE DROPDOWN ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setOpenNotif(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // logout
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // profile click
  const handleProfileClick = () => {
    profileInputRef.current?.click();
  };

  // update profile image
  const handleProfileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    await updateProfile(formData).unwrap();
    refetch();
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">

      {/* HEADER */}
      <div className="bg-white p-4 rounded-2xl shadow border">

        <div className="flex items-center justify-between">

          {/* LEFT → PROFILE */}
          <div className="flex items-center gap-4">

            {/* Avatar */}
            <div
              onClick={handleProfileClick}
              className="relative w-12 h-12 cursor-pointer"
            >
              <Image
                src={user?.profileImage || "/default-avatar.png"}
                alt="profile"
                fill
                className="rounded-full object-cover border"
              />

              <span className="absolute bottom-0 right-0 bg-gray-600 text-white text-[10px] p-1 rounded-full">
                <FaEdit />
              </span>
            </div>

            {/* NAME + STATS */}
            <div className="flex flex-col">

              <h2 className="text-sm font-semibold text-gray-800">
                {user?.firstName} {user?.lastName}
              </h2>

              <p className="text-xs text-gray-500">
                Welcome back 👋
              </p>

              <div className="flex items-center gap-2 mt-1">

                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  <b>{followersCount}</b> Followers
                </span>

                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                  <b>{followingCount}</b> Following
                </span>

              </div>

              {updating && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Updating profile...
                </p>
              )}

            </div>
          </div>

          {/* RIGHT → NOTIFICATION + LOGOUT */}
          <div className="flex items-center gap-3">

            {/* 🔔 NOTIFICATION DROPDOWN */}
            <div className="relative" ref={notifRef}>

              {/* ICON */}
              <div
                onClick={() => setOpenNotif(!openNotif)}
                className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <FaBell className="text-xl text-gray-700" />

                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                    {count}
                  </span>
                )}
              </div>

              {/* DROPDOWN */}
              {openNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white border shadow-xl rounded-xl z-50">

                  {/* HEADER */}
                  <div className="p-3 border-b font-semibold text-sm">
                    Notifications
                  </div>

                  {/* LIST */}
                  <div className="max-h-80 overflow-y-auto">

                    <div className="p-3 text-sm hover:bg-gray-50 border-b">
                      🔔 Someone followed you
                    </div>

                    <div className="p-3 text-sm hover:bg-gray-50 border-b">
                      ❤️ Someone liked your post
                    </div>

                    <div className="p-3 text-sm hover:bg-gray-50 border-b">
                      💬 New comment on your post
                    </div>

                  </div>

                  {/* FOOTER */}
                  <Link href="/notifications">
                    <div
                      onClick={() => setOpenNotif(false)}
                      className="text-center py-2 text-blue-500 hover:bg-gray-100 text-sm cursor-pointer"
                    >
                      View all notifications
                    </div>
                  </Link>

                </div>
              )}

            </div>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
            >
              Logout
            </button>

          </div>
        </div>

        {/* hidden input */}
        <input
          type="file"
          ref={profileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleProfileChange}
        />

        {/* POST EDITOR */}
        <div className="pt-4">
          <Editor />
        </div>

      </div>
    </div>
  );
}