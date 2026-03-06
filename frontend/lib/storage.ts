import { StoredPlayer } from "@/lib/types";

const KEY = "codenames-player";

export function savePlayer(player: StoredPlayer) {
  localStorage.setItem(KEY, JSON.stringify(player));
}

export function getPlayer(): StoredPlayer | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredPlayer;
  } catch {
    return null;
  }
}

export function clearPlayer() {
  localStorage.removeItem(KEY);
}
