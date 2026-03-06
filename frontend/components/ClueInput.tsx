"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button";

type ClueInputProps = {
  onSubmit: (word: string, number: number) => void;
};

const ClueInput: React.FC<ClueInputProps> = ({ onSubmit }) => {
  const [word, setWord] = useState("");
  const [number, setNumber] = useState(1);

  const handleSubmit = () => {
    const trimmed = word.trim();
    if (!trimmed || number < 1) return;
    onSubmit(trimmed, number);
    setWord("");
    setNumber(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col sm:flex-row gap-3 items-center bg-gradient-to-br from-purple-600/80 to-pink-600/80 backdrop-blur-lg border-4 border-black rounded-2xl p-5 shadow-xl"
    >
      <input
        type="text"
        placeholder="Clue Word"
        value={word}
        onChange={(e) =>
          setWord(e.target.value.replace(/[^a-zA-Z]/g, "").toLowerCase())
        }
        className="px-4 py-2 rounded-xl border-3 border-black text-xl font-bold bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-400"
      />
      <input
        type="number"
        min="1"
        max="9"
        value={number}
        onChange={(e) => setNumber(parseInt(e.target.value, 10) || 1)}
        className="w-20 px-4 py-2 rounded-xl border-3 border-black text-xl font-bold bg-white text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-400 text-center"
      />
      <Button text="SEND" onClick={handleSubmit} />
    </motion.div>
  );
};

export default ClueInput;
