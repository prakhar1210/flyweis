# 🎮 Real-Time Leaderboard System

A real-time multiplayer leaderboard backend using **Node.js**, **Socket.io**, and **Redis** for storing and managing scores by `region` and `game mode`.

---

## 🚀 Features

- 📡 Real-time score updates via WebSockets
- 📊 Fetch top N players per region and game mode
- 🌐 Filter leaderboard by region and game mode
- ⏳ Bonus: TTL logic possible for daily resets (future add-on)
- ⚡ Optimized using Redis Sorted Sets for fast reads/writes

---

## 🛠️ Tech Stack

- **Node.js**
- **Socket.io**
- **Redis**
- **Docker (for local Redis setup)**

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/real-time-leaderboard.git
cd real-time-leaderboard


Install dependencies
npm install

Run Redis localyy
docker run --name redis-leaderboard -p 6379:6379 -d redis

Start the server
node server.js
using Nodemon
npx nodemon server.js
```
Socket Events:
| Event Name          | Payload                                 | Description                      |
| :------------------ | :-------------------------------------- | :------------------------------- |
| `updateScore`       | `{ playerId, score, region, gameMode }` | Updates a player's score         |
| `getTopPlayers`     | `{ region, gameMode, count }`           | Fetches top N players            |
| `leaderboardUpdate` | `[ { playerId, score } ]`               | Emits leaderboard to all clients |


Built By Prakhar Shrivastava.

---

## ✅ Done.

Want me to generate a `LICENSE` file too?  
Or a `Dockerfile` + `docker-compose.yml` section inside this README as bonus?  
Just say **"drop it"** and I’ll fix you up.
