import { RoomState } from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const wsFromApi = API_BASE.replace(/^http:\/\//i, "ws://").replace(/^https:\/\//i, "wss://");

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  createRoom: (name: string) => request<{ room: RoomState["room"]; player: { id: number; name: string } }>("/create-room", { method: "POST", body: JSON.stringify({ name }) }),
  joinRoom: (code: string, name: string) => request<{ room: RoomState["room"]; player: { id: number; name: string } }>("/join-room", { method: "POST", body: JSON.stringify({ code, name }) }),
  roomState: (code: string, playerId: number) => request<RoomState>(`/room-state?code=${encodeURIComponent(code)}&player_id=${playerId}`),
  setTeam: (code: string, playerId: number, team: string) => request<{ players: RoomState["players"] }>("/set-team", { method: "POST", body: JSON.stringify({ code, player_id: playerId, team }) }),
  setRole: (code: string, playerId: number, role: string) => request<{ players: RoomState["players"] }>("/set-role", { method: "POST", body: JSON.stringify({ code, player_id: playerId, role }) }),
  startGame: (code: string, playerId: number) => request("/start-game", { method: "POST", body: JSON.stringify({ code, player_id: playerId }) }),
  submitClue: (code: string, playerId: number, clueWord: string, clueNumber: number) => request("/submit-clue", { method: "POST", body: JSON.stringify({ code, player_id: playerId, clue_word: clueWord, clue_number: clueNumber }) }),
  guessWord: (code: string, playerId: number, cardId: number) => request("/guess-word", { method: "POST", body: JSON.stringify({ code, player_id: playerId, card_id: cardId }) }),
  endTurn: (code: string, playerId: number) => request("/end-turn", { method: "POST", body: JSON.stringify({ code, player_id: playerId }) }),
  restartGame: (code: string, playerId: number) => request("/restart-game", { method: "POST", body: JSON.stringify({ code, player_id: playerId }) }),
  sendChat: (code: string, playerId: number, message: string) => request("/chat", { method: "POST", body: JSON.stringify({ code, player_id: playerId, message }) }),
  react: (code: string, playerId: number, emoji: string) => request("/react", { method: "POST", body: JSON.stringify({ code, player_id: playerId, emoji }) }),
};

export const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE_URL ?? wsFromApi;
