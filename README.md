spywords/
│
├── README.md
├── docker-compose.yml
├── .env.example
├── package.json # Root workspace config
│
├── apps/ # Frontend apps
│ └── web/
│ ├── app/ # Next.js App Router
│ │ ├── page.tsx
│ │ ├── lobby/
│ │ ├── room/[id]/
│ │ └── game/[id]/
│ │
│ ├── components/
│ │ ├── GameGrid.tsx
│ │ ├── WordCard.tsx
│ │ ├── CluePanel.tsx
│ │ ├── TeamSidebar.tsx
│ │ └── Timer.tsx
│ │
│ ├── socket/
│ │ └── client.ts
│ │
│ ├── store/
│ │ └── gameStore.ts
│ │
│ └── styles/
│
│
├── services/ # Backend microservices
│
│ ├── gateway/ # WebSocket Gateway
│ │ ├── src/
│ │ │ ├── socket.ts
│ │ │ ├── kafkaConsumer.ts
│ │ │ └── server.ts
│ │ └── Dockerfile
│ │
│ ├── game-service/ # Game logic engine
│ │ ├── src/
│ │ │ ├── controllers/
│ │ │ ├── services/
│ │ │ ├── models/
│ │ │ ├── events/
│ │ │ └── app.py
│ │ └── Dockerfile
│ │
│ ├── replay-service/ # Event replay system
│ │ ├── src/
│ │ │ ├── consumer.py
│ │ │ ├── replayer.py
│ │ │ └── api.py
│ │ └── Dockerfile
│ │
│ ├── ai-service/ # AI clue generator
│ │ ├── src/
│ │ │ ├── clue_engine.py
│ │ │ ├── embeddings.py
│ │ │ └── api.py
│ │ └── Dockerfile
│ │
│ └── matchmaking-service/
│ ├── src/
│ │ ├── queue.py
│ │ └── consumer.py
│ └── Dockerfile
│
│
├── kafka/
│ ├── topics.md # Topic definitions
│ └── init-topics.sh
│
├── infra/
│ ├── mongodb/
│ ├── redis/
│ └── monitoring/
│ ├── prometheus.yml
│ └── grafana/
│
└── docs/
├── architecture.md
├── event-flow.md
└── api-spec.md
