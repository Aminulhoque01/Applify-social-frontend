/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import Feed from "@/src/components/Feed/Feed";
import ActiveUsersSidebar from "../components/ActiveUsersSidebar/ActiveUsersSidebar";
import MessengerChat from "../components/MessengerChat/MessengerChat";

export default function Home() {
  const [selectedUser, setSelectedUser] =
    useState<any>(null);

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-100">

      {/* MAIN CONTAINER */}
      <div className="w-full max-w-[1400px] flex">

        {/* CENTER FEED */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-[700px]">
            <Feed />
          </div>
        </div>

        {/* RIGHT SIDE CHAT */}
        <div className="w-[380px] flex border-l bg-white">

          {/* ACTIVE USERS */}
          <ActiveUsersSidebar
            onSelectUser={setSelectedUser}
          />

          {/* CHAT BOX */}
          <div className="flex-1">
            <MessengerChat
              selectedUser={selectedUser}
            />
          </div>

        </div>
      </div>
    </div>
  );
}