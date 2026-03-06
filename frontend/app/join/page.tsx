"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SpyWordsLogo from "@/components/SpyWordsLogo";
import Button from "@/components/Button";
import { api } from "@/lib/api";
import { savePlayer } from "@/lib/storage";
import { sfx } from "@/lib/sfx";

export default function JoinRoomPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async () => {
    const trimmedName = name.trim();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedName || !trimmedCode) {
      setError("Please enter both name and room code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { room, player } = await api.joinRoom(trimmedCode, trimmedName);
      savePlayer({ id: player.id, name: player.name, roomCode: room.code });
      sfx.click();
      router.push(`/room/${room.code}`);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to join room");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 flex flex-col items-center gap-8 bg-white/10 backdrop-blur-lg border-4 border-white/30 rounded-3xl p-10 shadow-2xl max-w-md w-full"
      >
        <SpyWordsLogo size="md" />

        <h2 className="text-3xl font-bold text-white">Join Room</h2>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-3 text-lg font-semibold text-gray-900 border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400"
        />

        <input
          type="text"
          placeholder="Room Code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          className="w-full px-5 py-3 text-lg font-semibold text-gray-900 border-3 border-black rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-400 uppercase"
        />

        {error && <p className="text-red-400 font-semibold">{error}</p>}

        <Button
          text={loading ? "JOINING..." : "JOIN"}
          onClick={handleJoin}
          disabled={loading}
        />

        <button
          onClick={() => router.push("/")}
          className="text-white/80 hover:text-white underline"
        >
          ← Back
        </button>
      </motion.div>
    </div>
  );
}
