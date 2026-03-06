"use client";

import Card from "@/components/Card";
import { Card as CardType } from "@/lib/types";

type BoardProps = {
  cards: CardType[];
  isSpymaster: boolean;
  canGuess: boolean;
  onGuess: (id: number) => void;
};

const Board: React.FC<BoardProps> = ({
  cards,
  isSpymaster,
  canGuess,
  onGuess,
}) => {
  return (
    <div className="grid grid-cols-5 gap-3 md:gap-4 w-full max-w-6xl mx-auto">
      {cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          isSpymaster={isSpymaster}
          canGuess={canGuess}
          onGuess={onGuess}
        />
      ))}
    </div>
  );
};

export default Board;
