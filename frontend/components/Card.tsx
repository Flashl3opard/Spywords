"use client";

import { motion } from "framer-motion";
import { Card as CardType } from "@/lib/types";
import { sfx } from "@/lib/sfx";

type CardProps = {
  card: CardType;
  isSpymaster: boolean;
  canGuess: boolean;
  onGuess: (id: number) => void;
};

const cardBgColor = {
  red: "bg-gradient-to-br from-red-400 to-red-600",
  blue: "bg-gradient-to-br from-blue-400 to-blue-600",
  neutral: "bg-gradient-to-br from-gray-400 to-gray-600",
  assassin: "bg-gradient-to-br from-black to-gray-900",
  hidden: "bg-white",
};

const cardRevealedText = {
  red: "text-white",
  blue: "text-white",
  neutral: "text-gray-200",
  assassin: "text-white",
  hidden: "text-gray-900",
};

const overlayColor = {
  red: "bg-red-500/40",
  blue: "bg-blue-500/40",
  neutral: "bg-gray-500/30",
  assassin: "bg-black/50",
  hidden: "bg-transparent",
};

const Card: React.FC<CardProps> = ({
  card,
  isSpymaster,
  canGuess,
  onGuess,
}) => {
  const showRealColor = card.revealed || isSpymaster;
  const displayedColor = showRealColor ? card.real_color : "hidden";
  const isClickable = canGuess && !card.revealed;

  const handleClick = () => {
    if (isClickable) {
      sfx.reveal();
      onGuess(card.id);
    }
  };

  return (
    <motion.div
      whileHover={isClickable ? { scale: 1.05, y: -4 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      className={`
        relative
        aspect-[3/2] rounded-2xl border-4 border-black
        overflow-hidden
        ${isClickable ? "cursor-pointer shadow-lg hover:shadow-glow" : "cursor-default shadow-md"}
        transition-all duration-200
      `}
      onClick={handleClick}
    >
      <div className={`absolute inset-0 ${cardBgColor[displayedColor]}`} />

      {isSpymaster && !card.revealed && (
        <div
          className={`absolute inset-0 ${overlayColor[card.real_color]} z-10`}
        />
      )}

      <div
        className={`
          absolute inset-0 z-20
          flex flex-col items-center justify-center
          p-2 text-center
          ${cardRevealedText[displayedColor]}
        `}
      >
        <span
          className="text-sm md:text-lg font-bold tracking-wide"
          style={{
            textShadow: card.revealed ? "1px 1px 2px rgba(0,0,0,0.5)" : "none",
          }}
        >
          {card.word.toUpperCase().replace("_", " ")}
        </span>

        {card.revealed && card.real_color === "assassin" && (
          <div className="text-4xl mt-1">💀</div>
        )}
      </div>
    </motion.div>
  );
};

export default Card;
