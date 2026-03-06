"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import SpyWordsLogo from "@/components/SpyWordsLogo";
import Board from "@/components/Board";
import Button from "@/components/Button";
import ClueInput from "@/components/ClueInput";
import PlayerList from "@/components/PlayerList";
import ChatBox from "@/components/ChatBox";

import { api, WS_BASE } from "@/lib/api";
import { getPlayer } from "@/lib/storage";
import { RoomState, Player } from "@/lib/types";
import { sfx } from "@/lib/sfx";

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomCode = (params.roomId as string).toUpperCase();

  const [state, setState] = useState<RoomState | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  // Load room state
  const loadState = useCallback(async () => {
    const stored = getPlayer();
    if (!stored || stored.roomCode !== roomCode) {
      setError("Player not found. Please join the room again.");
      setLoading(false);
      return;
    }

    try {
      const data = await api.roomState(roomCode, stored.id);
      setState(data);
      setCurrentPlayerId(stored.id);
      setLoading(false);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to load room");
      setLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!wsConnected) {
        loadState();
      }
    }, 2000);

    return () => window.clearInterval(interval);
  }, [wsConnected, loadState]);

  // WebSocket connection
  useEffect(() => {
    if (!state) return;

    const wsBase = WS_BASE.replace(/\/$/, "");
    const wsUrl = `${wsBase}/ws/room/${roomCode}/`;
    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => {
      setWsConnected(true);
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      setWsConnected(false);
      console.log("WebSocket disconnected");
    };

    socket.onerror = () => {
      setWsConnected(false);
    };

    socket.onmessage = (e) => {
      const msg: { event: string; payload: Record<string, unknown> } =
        JSON.parse(e.data);
      console.log("WS Event:", msg.event, msg.payload);

      if (
        msg.event === "player_joined" ||
        msg.event === "team_changed" ||
        msg.event === "role_changed"
      ) {
        const players = msg.payload.players as Player[];
        setState((prev) => (prev ? { ...prev, players } : prev));
      }

      if (msg.event === "game_started") {
        loadState();
        sfx.click();
      }

      if (msg.event === "clue_given") {
        setState((prev) =>
          prev
            ? {
                ...prev,
                clue: msg.payload.clue as RoomState["clue"],
                guesses_left: msg.payload.guesses_left as number,
              }
            : prev,
        );
      }

      if (msg.event === "word_guessed") {
        loadState();
        sfx.reveal();
      }

      if (msg.event === "turn_changed") {
        setState((prev) =>
          prev && prev.room
            ? {
                ...prev,
                room: {
                  ...prev.room,
                  turn: msg.payload.turn as "red" | "blue",
                },
              }
            : prev,
        );
        sfx.turn();
      }

      if (msg.event === "game_over") {
        loadState();
        sfx.win();
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
        });
      }

      if (msg.event === "chat_message") {
        setState((prev) => {
          if (!prev) return prev;
          const newMsg = {
            by: msg.payload.by as string,
            message: msg.payload.message as string,
          };
          return { ...prev, chat: [...prev.chat, newMsg] };
        });
      }

      if (msg.event === "reaction") {
        // Optionally handle reactions
      }
    };

    return () => {
      setWsConnected(false);
      socket.close();
    };
  }, [state?.room?.code, roomCode, loadState]);

  const currentPlayer = state?.players.find((p) => p.id === currentPlayerId);
  const isHost = state?.room.host === currentPlayer?.name;
  const isSpymaster = currentPlayer?.role === "spymaster";
  const isOperative = currentPlayer?.role === "operative";
  const isMyTurn = currentPlayer?.team === state?.room.turn;
  const canGuess =
    state?.room.status === "active" &&
    isOperative &&
    isMyTurn &&
    (state?.guesses_left ?? 0) > 0;

  const handleSetTeam = async (team: "red" | "blue" | "spectator") => {
    if (!currentPlayerId) return;
    try {
      const { players } = await api.setTeam(roomCode, currentPlayerId, team);
      setState((prev) => (prev ? { ...prev, players } : prev));
      sfx.click();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to set team");
    }
  };

  const handleSetRole = async (role: "spymaster" | "operative") => {
    if (!currentPlayerId) return;
    try {
      const { players } = await api.setRole(roomCode, currentPlayerId, role);
      setState((prev) => (prev ? { ...prev, players } : prev));
      sfx.click();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to set role");
    }
  };

  const handleStartGame = async () => {
    if (!currentPlayerId) return;
    try {
      await api.startGame(roomCode, currentPlayerId);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to start game");
    }
  };

  const handleSubmitClue = async (word: string, number: number) => {
    if (!currentPlayerId) return;
    try {
      await api.submitClue(roomCode, currentPlayerId, word, number);
      sfx.click();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to submit clue");
    }
  };

  const handleGuessWord = async (cardId: number) => {
    if (!currentPlayerId) return;
    try {
      await api.guessWord(roomCode, currentPlayerId, cardId);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to guess");
    }
  };

  const handleEndTurn = async () => {
    if (!currentPlayerId) return;
    try {
      await api.endTurn(roomCode, currentPlayerId);
      sfx.turn();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to end turn");
    }
  };

  const handleRestartGame = async () => {
    if (!currentPlayerId) return;
    try {
      await api.restartGame(roomCode, currentPlayerId);
      sfx.click();
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to restart");
    }
  };

  const handleSendChat = async (message: string) => {
    if (!currentPlayerId) return;
    try {
      await api.sendChat(roomCode, currentPlayerId, message);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert("Room code copied!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (error || !state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 p-6">
        <p className="text-red-400 text-2xl font-bold">
          {error || "Room not found"}
        </p>
        <Button text="GO HOME" onClick={() => router.push("/")} />
      </div>
    );
  }

  const { room, players, cards, remaining, clue, guesses_left, winner, chat } =
    state;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-8 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-aurora opacity-40 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-screen-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/20 backdrop-blur-md border-4 border-white/40 rounded-2xl p-4 shadow-xl">
          <SpyWordsLogo size="sm" />
          <div className="flex items-center gap-4">
            <div className="text-white text-xl font-bold">
              Room: <span className="text-yellow-300">{room.code}</span>
            </div>
            <button
              onClick={copyRoomCode}
              className="px-4 py-2 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 border-2 border-black"
            >
              📋 Copy
            </button>
          </div>
        </div>

        {/* Lobby */}
        {room.status === "lobby" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-6 bg-white/10 backdrop-blur-lg border-4 border-white/30 rounded-3xl p-8"
          >
            <h2 className="text-4xl font-bold text-white">Lobby</h2>
            <p className="text-white/80">
              Waiting for players to join and select teams...
            </p>
            {isHost && <Button text="START GAME" onClick={handleStartGame} />}
            {!isHost && (
              <p className="text-white/60">Only the host can start the game</p>
            )}
          </motion.div>
        )}

        {/* Active Game */}
        {room.status === "active" && (
          <div className="flex flex-col gap-6">
            {/* Turn / Clue Display */}
            <div className="bg-gradient-to-r from-purple-600/80 to-pink-600/80 backdrop-blur-lg border-4 border-black rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-white text-2xl font-bold">
                  Turn:{" "}
                  <span
                    className={
                      room.turn === "red" ? "text-red-400" : "text-blue-400"
                    }
                  >
                    {room.turn.toUpperCase()}
                  </span>
                </div>
                <div className="text-white text-lg">
                  Red: {remaining.red} | Blue: {remaining.blue}
                </div>
              </div>

              {clue && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-4 bg-white/20 rounded-xl p-4 border-2 border-white/50"
                >
                  <p className="text-white text-xl font-bold">
                    Clue: "{clue.word.toUpperCase()}" ({clue.number}) by{" "}
                    {clue.by}
                  </p>
                  <p className="text-white/80">Guesses left: {guesses_left}</p>
                </motion.div>
              )}

              {isSpymaster && isMyTurn && !clue && (
                <ClueInput onSubmit={handleSubmitClue} />
              )}

              {isOperative && isMyTurn && clue && (
                <div className="mt-4">
                  <Button text="END TURN" onClick={handleEndTurn} />
                </div>
              )}
            </div>

            {/* Board */}
            <Board
              cards={cards}
              isSpymaster={isSpymaster}
              canGuess={!!canGuess}
              onGuess={handleGuessWord}
            />
          </div>
        )}

        {/* Finished Game */}
        {room.status === "finished" && winner && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-6 bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-black rounded-3xl p-10 shadow-2xl"
          >
            <h2
              className="text-5xl font-extrabold text-white"
              style={{ textShadow: "3px 3px 0px black" }}
            >
              {winner.toUpperCase()} TEAM WINS! 🎉
            </h2>
            {isHost && (
              <Button text="RESTART GAME" onClick={handleRestartGame} />
            )}
          </motion.div>
        )}

        {/* Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerList
            players={players}
            isHost={isHost}
            currentPlayerId={currentPlayerId!}
            onSetTeam={handleSetTeam}
            onSetRole={handleSetRole}
          />
          <ChatBox messages={chat} onSend={handleSendChat} />
        </div>
      </div>
    </div>
  );
}
