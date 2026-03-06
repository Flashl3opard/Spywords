"use client";

import { Player } from "@/lib/types";

type PlayerListProps = {
  players: Player[];
  isHost: boolean;
  currentPlayerId: number;
  onSetTeam: (team: "red" | "blue" | "spectator") => void;
  onSetRole: (role: "spymaster" | "operative") => void;
};

const PlayerList: React.FC<PlayerListProps> = ({
  players,
  isHost,
  currentPlayerId,
  onSetTeam,
  onSetRole,
}) => {
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  const teamColor = (team: string) => {
    if (team === "red") return "text-red-500 font-extrabold";
    if (team === "blue") return "text-blue-500 font-extrabold";
    return "text-gray-400";
  };

  const roleIcon = (role: string) => (role === "spymaster" ? "🎩" : "🕵️");

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border-3 border-black">
        <h3 className="text-xl font-bold text-white mb-3">YOU</h3>
        {currentPlayer && (
          <div className="flex flex-col gap-2">
            <div className={`text-lg ${teamColor(currentPlayer.team)}`}>
              {roleIcon(currentPlayer.role)} {currentPlayer.name} (
              {currentPlayer.team})
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onSetTeam("red")}
                className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600"
              >
                Red
              </button>
              <button
                onClick={() => onSetTeam("blue")}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600"
              >
                Blue
              </button>
              <button
                onClick={() => onSetTeam("spectator")}
                className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm font-bold hover:bg-gray-600"
              >
                Spectate
              </button>
            </div>
            {currentPlayer.team !== "spectator" && (
              <div className="flex gap-2 flex-wrap mt-2">
                <button
                  onClick={() => onSetRole("spymaster")}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700"
                >
                  🎩 Spymaster
                </button>
                <button
                  onClick={() => onSetRole("operative")}
                  className="px-3 py-1 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-700"
                >
                  🕵️ Operative
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl border-3 border-black">
        <h3 className="text-xl font-bold text-white mb-3">
          PLAYERS ({players.length})
        </h3>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
          {players.map((player) => (
            <div
              key={player.id}
              className={`text-sm ${teamColor(player.team)}`}
            >
              {roleIcon(player.role)} {player.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerList;
