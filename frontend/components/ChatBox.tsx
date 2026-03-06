"use client";

import { useState } from "react";
import Button from "@/components/Button";

type ChatBoxProps = {
  messages: { by: string; message: string }[];
  onSend: (message: string) => void;
};

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSend }) => {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    const trimmed = msg.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setMsg("");
  };

  return (
    <div className="flex flex-col bg-white/20 backdrop-blur-md border-3 border-black rounded-xl p-4 gap-3 h-64">
      <h3 className="text-lg font-bold text-white">Chat</h3>
      <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-sm text-white">
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.by}:</strong> {m.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-3 py-1 rounded-lg border-2 border-black text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          onClick={handleSend}
          className="px-4 py-1 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 border-2 border-black"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
