export type Team = "red" | "blue" | "spectator";
export type Role = "spymaster" | "operative";

export type Player = {
  id: number;
  name: string;
  team: Team;
  role: Role;
  room: number;
};

export type CardColor = "red" | "blue" | "neutral" | "assassin" | "hidden";

export type Card = {
  id: number;
  word: string;
  color: CardColor;
  real_color: "red" | "blue" | "neutral" | "assassin";
  revealed: boolean;
  position: number;
};

export type RoomState = {
  room: {
    id: number;
    code: string;
    host: string;
    turn: "red" | "blue";
    status: "lobby" | "active" | "finished";
    game_state: {
      clue?: { word: string; number: number; team: "red" | "blue"; by: string } | null;
      guesses_left?: number;
      winner?: "red" | "blue" | null;
    };
  };
  players: Player[];
  cards: Card[];
  remaining: { red: number; blue: number };
  clue: { word: string; number: number; team: "red" | "blue"; by: string } | null;
  guesses_left: number;
  winner: "red" | "blue" | null;
  chat: { by: string; message: string }[];
  reactions: { by: string; emoji: string }[];
};

export type StoredPlayer = {
  id: number;
  name: string;
  roomCode: string;
};
