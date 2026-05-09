/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { socket } from "@/src/lib/socket";
import { useEffect, useState } from "react";
 

interface Props {
  selectedUser: any;
}

export default function MessengerChat({
  selectedUser,
}: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  // receive realtime
  useEffect(() => {
    socket.on("receive-message", (msg:any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      receiverId: selectedUser._id,
      text: message,
    };

    socket.emit("send-message", msgData);

    setMessages((prev) => [
      ...prev,
      {
        text: message,
        self: true,
      },
    ]);

    setMessage("");
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">

      {/* HEADER */}
      <div className="p-4 border-b font-semibold">
        {selectedUser.firstName}{" "}
        {selectedUser.lastName}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs px-3 py-2 rounded-2xl text-sm ${
              msg.self
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100"
            }`}
          >
            {msg.text}
          </div>
        ))}

      </div>

      {/* INPUT */}
      <div className="p-3 border-t flex gap-2">

        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Type message..."
          className="flex-1 border rounded-full px-4 py-2 text-sm outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded-full"
        >
          Send
        </button>

      </div>
    </div>
  );
}