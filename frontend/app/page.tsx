"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import SpyWordsLogo from "@/components/SpyWordsLogo";
import Button from "@/components/Button";
import { sfx } from "@/lib/sfx";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-aurora opacity-50 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 flex flex-col items-center gap-12"
      >
        <SpyWordsLogo size="lg" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-white text-xl md:text-2xl font-semibold text-center max-w-2xl"
        >
          A real-time multiplayer word-guessing party game. <br />
          Give clues, guess words, win as a team!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Button
            text="CREATE ROOM"
            onClick={() => {
              sfx.click();
              router.push("/create");
            }}
          />
          <Button
            text="JOIN ROOM"
            onClick={() => {
              sfx.click();
              router.push("/join");
            }}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 text-white/60 text-sm"
      >
        Powered by Next.js + Django + WebSockets
      </motion.div>
    </div>
  );
}
