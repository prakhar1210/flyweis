const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const Redis = require("ioredis");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const redis = new Redis(); // default localhost:6379

redis.on("connect", () => console.log("✅ Connected to Redis"));
redis.on("error", (err) => console.error("❌ Redis Error:", err));

const getLeaderboardKey = (region, mode) => `leaderboard:${region}:${mode}`;

const updateScore = async ({ playerId, score, region, gameMode }) => {
  const key = getLeaderboardKey(region, gameMode);
  await redis.zadd(key, score, playerId);
};

const getTopPlayers = async (region, gameMode, count) => {
  const key = getLeaderboardKey(region, gameMode);
  const data = await redis.zrevrange(key, 0, count - 1, "WITHSCORES");
  // turn into array of { playerId, score }
  const result = [];
  for (let i = 0; i < data.length; i += 2) {
    result.push({ playerId: data[i], score: Number(data[i + 1]) });
  }
  return result;
};

io.on("connection", (socket) => {
  console.log("✅ A client connected");

  socket.on("updateScore", async (data) => {
    console.log("Received updateScore:", data);
    await updateScore(data);
    const leaderboard = await getTopPlayers(data.region, data.gameMode, 5);
    io.emit("leaderboardUpdate", leaderboard);
  });

  socket.on("getTopPlayers", async ({ region, gameMode, count }) => {
    console.log(`Fetching top ${count} players for ${region}-${gameMode}`);
    const leaderboard = await getTopPlayers(region, gameMode, count);
    socket.emit("leaderboardUpdate", leaderboard);
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
