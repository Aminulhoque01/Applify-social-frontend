"use client";

import { useEffect, useState } from "react";
import { socket } from "../lib/socket";
 

export const useNotification = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.on("notification-count", setCount);

    socket.on("new-notification", () => {
      setCount((prev) => prev + 1);
    });

    return () => {
      socket.off("notification-count");
      socket.off("new-notification");
    };
  }, []);

  return { count };
};