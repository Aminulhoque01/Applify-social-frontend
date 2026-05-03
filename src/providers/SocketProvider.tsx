/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { socket } from "../lib/socket";
import { useAppSelector } from "../redux/hooks";
 
 

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token) return;

    // 👉 token decode করে userId বের করো
    const payload: any = JSON.parse(atob(token.split(".")[1]));
    const userId = payload.id;

    // 🔌 connect
    socket.connect();

    // 🟢 online
    socket.emit("user-online", userId);

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return <>{children}</>;
}