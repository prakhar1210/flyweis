import redis from "../services/redisClient.js";
import { getMidnightTimestamp } from "../utils/timeUtils.js";

export default function (io) {
  io.on("connection", (socket) => {
    console.log("🚀 New client connected:", socket.id);

    socket.on("updateScore", async ({ playerId, score, region, gameMode }) => {
      const leaderboardKey = `leaderboard:${region}:${gameMode}`;
      await redis.zincrby(leaderboardKey, score, playerId);

      const ttl = await redis.ttl(leaderboardKey);
      if (ttl === -1) {
        await redis.expireat(leaderboardKey, getMidnightTimestamp());
      }
    });

    socket.on("getTopN", async ({ region, gameMode, limit }, callback) => {
      const leaderboardKey = `leaderboard:${region}:${gameMode}`;
      const topPlayers = await redis.zrevrange(
        leaderboardKey,
        0,
        limit - 1,
        "WITHSCORES"
      );

      const formatted = [];
      for (let i = 0; i < topPlayers.length; i += 2) {
        formatted.push({
          playerId: topPlayers[i],
          score: parseInt(topPlayers[i + 1]),
        });
      }

      callback(formatted);
    });

    socket.on(
      "getPlayerRank",
      async ({ playerId, region, gameMode }, callback) => {
        const leaderboardKey = `leaderboard:${region}:${gameMode}`;
        const rank = await redis.zrevrank(leaderboardKey, playerId);
        callback(rank !== null ? rank + 1 : null);
      }
    );

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
