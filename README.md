# 🕵️ SpyWords

**SpyWords** is a real-time multiplayer word strategy game inspired by Codenames, built using an event-driven microservices architecture powered by Apache Kafka.

Players compete in teams, decode clues, and avoid the assassin — all synchronized in real time through distributed event streaming.

---

# 🚀 Features

- 🎮 Real-time multiplayer gameplay
- 🕵️ Spymaster & Operative roles
- 🧠 One-word clue system
- 💀 Assassin card logic
- 🔄 Event replay system
- 👀 Spectator mode
- 🤖 AI clue generator (optional)
- 🏆 Ranked matchmaking (planned)

---

# 🧱 Tech Stack

## Frontend

- Next.js 14 (App Router)
- React + TypeScript
- Tailwind CSS
- Socket.IO Client
- Zustand / Redux Toolkit

## Backend / Microservices

| Service             | Tech                |
| ------------------- | ------------------- |
| WebSocket Gateway   | Node.js + Socket.IO |
| Game Service        | Python (FastAPI)    |
| Replay Service      | Python              |
| AI Service          | Python              |
| Matchmaking Service | Python              |

---

## Event Streaming

- Apache Kafka
- KafkaJS (Node client)
- Confluent-Kafka (Python client)

---

## Databases & Cache

- MongoDB → Game state storage
- Redis → Presence, timers, caching
- Kafka → Event storage / replay log

---

## DevOps / Infra

- Docker + Docker Compose
- Kubernetes (future scope)
- Prometheus + Grafana monitoring

---

# 📂 SpyWords — Project Structure

## Monorepo Layout

```text
spywords/
├── README.md
├── docker-compose.yml
├── .env.example
├── package.json                 # Root workspace config
│
├── apps/                        # Frontend apps
│   └── web/
│       ├── app/                 # Next.js App Router
│       │   ├── page.tsx
│       │   ├── lobby/
│       │   ├── room/[id]/
│       │   └── game/[id]/
│       │
│       ├── components/
│       │   ├── GameGrid.tsx
│       │   ├── WordCard.tsx
│       │   ├── CluePanel.tsx
│       │   ├── TeamSidebar.tsx
│       │   └── Timer.tsx
│       │
│       ├── socket/
│       │   └── client.ts
│       │
│       ├── store/
│       │   └── gameStore.ts
│       │
│       └── styles/
│
├── services/                   # Backend microservices
│   ├── gateway/                # WebSocket Gateway
│   │   ├── src/
│   │   │   ├── socket.ts
│   │   │   ├── kafkaConsumer.ts
│   │   │   └── server.ts
│   │   └── Dockerfile
│   │
│   ├── game-service/           # Game logic engine
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── models/
│   │   │   ├── events/
│   │   │   └── app.py
│   │   └── Dockerfile
│   │
│   ├── replay-service/         # Event replay system
│   │   ├── src/
│   │   │   ├── consumer.py
│   │   │   ├── replayer.py
│   │   │   └── api.py
│   │   └── Dockerfile
│   │
│   ├── ai-service/             # AI clue generator
│   │   ├── src/
│   │   │   ├── clue_engine.py
│   │   │   ├── embeddings.py
│   │   │   └── api.py
│   │   └── Dockerfile
│   │
│   └── matchmaking-service/
│       ├── src/
│       │   ├── queue.py
│       │   └── consumer.py
│       └── Dockerfile
│
├── kafka/
│   ├── topics.md
│   └── init-topics.sh
│
├── infra/
│   ├── mongodb/
│   ├── redis/
│   └── monitoring/
│       ├── prometheus.yml
│       └── grafana/
│
└── docs/
    ├── architecture.md
    ├── event-flow.md
    └── api-spec.md
```
