/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useOnlineUsers } from "@/src/hooks/useOnlineUsers";
import { useGetAllUserQuery } from "@/src/redux/services/authApi";
 

interface Props {
  onSelectUser: (user: any) => void;
}

export default function ActiveUsersSidebar({
  onSelectUser,
}: Props) {
  const onlineUsers = useOnlineUsers();

  const { data } = useGetAllUserQuery("");

  return (
    <div className="w-[320px] bg-white border-l h-screen overflow-y-auto p-4">

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Active Users
        </h2>
      </div>

      {/* USERS */}
      <div className="space-y-3">

        {data?.data?.map((user: any) => {
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100 cursor-pointer transition"
            >

              {/* Avatar */}
              <div className="relative w-12 h-12">

                <Image
                  src={
                    user.profileImage ||
                    "/default-avatar.png"
                  }
                  alt=""
                  fill
                  className="rounded-full object-cover"
                />

                {/* ONLINE DOT */}
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              {/* INFO */}
              <div>
                <h3 className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </h3>

                <p className="text-xs text-gray-500">
                  {isOnline
                    ? "Active now"
                    : "Offline"}
                </p>
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}