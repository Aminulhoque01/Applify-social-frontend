/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
 
import { socket } from "@/src/lib/socket";
import { useGetNotificationsQuery } from "@/src/redux/services/notificationApi";
 
interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ open, onClose }: Props) {
  const { data, refetch } = useGetNotificationsQuery("");

  //  নতুন notification এলে list refresh
  useEffect(() => {
    const handler = () => refetch();

    socket.on("new-notification", handler);

    return () => {
      socket.off("new-notification", handler);
    };
  }, [refetch]);

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl rounded-xl border z-50">
      <div className="p-3 font-semibold border-b">Notifications</div>

      <div className="max-h-80 overflow-y-auto">
        {data?.data?.length === 0 && (
          <p className="p-3 text-sm text-gray-500">
            No notifications
          </p>
        )}

        {data?.data?.map((n: any) => (
          <div
            key={n._id}
            className="p-3 border-b hover:bg-gray-50 text-sm cursor-pointer"
          >
            {n.message}
          </div>
        ))}
      </div>

      <button
        onClick={onClose}
        className="w-full text-sm text-blue-500 py-2 hover:bg-gray-100"
      >
        Close
      </button>
    </div>
  );
}