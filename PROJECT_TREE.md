# Codenames Game - Project Tree

```
codenames-game/
│
├── README.md                    # Main setup guide
├── ARCHITECTURE.md              # Technical design documentation
├── FEATURES.md                  # Complete feature list
├── DEPLOYMENT.md                # Production deployment guide
├── LICENSE                      # MIT License
├── .gitignore                   # Git ignore rules
├── docker-compose.yml           # Docker orchestration
├── setup.sh                     # Linux/macOS quick setup script
├── setup.ps1                    # Windows PowerShell setup script
│
├── backend/                     # Django Backend
│   ├── manage.py                # Django management script
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example             # Environment variables template
│   ├── README.md                # Backend setup instructions
│   ├── Dockerfile               # Backend container image
│   │
│   ├── backend/                 # Django project settings
│   │   ├── __init__.py
│   │   ├── settings.py          # Django configuration
│   │   ├── urls.py              # Main URL routing
│   │   ├── wsgi.py              # WSGI entry point
│   │   └── asgi.py              # ASGI entry point (Channels)
│   │
│   ├── game/                    # Core game logic
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py            # Room, Player, WordCard models
│   │   ├── serializers.py       # DRF serializers
│   │   ├── views.py             # REST API endpoints (12 views)
│   │   ├── urls.py              # Game URL routing
│   │   ├── admin.py             # Django admin config
│   │   ├── services.py          # Game logic (board creation, validation)
│   │   ├── word_bank.py         # 400+ word list
│   │   └── migrations/
│   │       ├── __init__.py
│   │       └── 0001_initial.py  # Initial database schema
│   │
│   ├── users/                   # User management (minimal)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   └── migrations/
│   │       └── __init__.py
│   │
│   ├── websocket/               # WebSocket consumers
│   │   ├── __init__.py
│   │   ├── consumers.py         # RoomConsumer for real-time events
│   │   └── routing.py           # WebSocket URL routing
│   │
│   └── templates/               # Django templates (empty, API-only)
│
└── frontend/                    # Next.js Frontend
    ├── package.json             # Node dependencies
    ├── next.config.mjs          # Next.js configuration
    ├── tsconfig.json            # TypeScript configuration
    ├── tailwind.config.ts       # TailwindCSS configuration
    ├── postcss.config.mjs       # PostCSS configuration
    ├── next-env.d.ts            # Next.js types
    ├── .env.local.example       # Environment variables template
    ├── README.md                # Frontend setup instructions
    ├── Dockerfile               # Frontend container image
    │
    ├── app/                     # Next.js App Router
    │   ├── globals.css          # Global styles + Tailwind imports
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Landing page (/)
    │   │
    │   ├── create/              # Create room page
    │   │   └── page.tsx
    │   │
    │   ├── join/                # Join room page
    │   │   └── page.tsx
    │   │
    │   └── room/                # Game room pages
    │       └── [roomId]/        # Dynamic room route
    │           └── page.tsx     # Main game interface
    │
    ├── components/              # React components
    │   ├── SpyWordsLogo.tsx     # Game logo with neon glow
    │   ├── Button.tsx           # 3D pressed-button component
    │   ├── Card.tsx             # Individual word card
    │   ├── Board.tsx            # 5×5 game board
    │   ├── ClueInput.tsx        # Spymaster clue input
    │   ├── PlayerList.tsx       # Player roster with team/role
    │   └── ChatBox.tsx          # Real-time chat
    │
    ├── lib/                     # Utilities
    │   ├── types.ts             # TypeScript types (shared)
    │   ├── api.ts               # API client + endpoints
    │   ├── storage.ts           # LocalStorage helpers
    │   └── sfx.ts               # Sound effects (Web Audio API)
    │
    └── public/                  # Static assets
        └── sounds/              # (empty, ready for future audio files)
```

---

## File Count Summary

| Category                | Count   |
| ----------------------- | ------- |
| **Backend Files**       | 30+     |
| **Frontend Files**      | 25+     |
| **Documentation**       | 6       |
| **Config Files**        | 10+     |
| **Total Lines of Code** | ~4,500+ |

---

## Key Files to Explore

### Backend

1. **`backend/game/models.py`** - Database schema
2. **`backend/game/views.py`** - All REST API logic
3. **`backend/game/services.py`** - Game rule engine
4. **`backend/websocket/consumers.py`** - WebSocket handler

### Frontend

1. **`frontend/app/room/[roomId]/page.tsx`** - Main game UI
2. **`frontend/components/Card.tsx`** - Card component
3. **`frontend/lib/api.ts`** - API client
4. **`frontend/lib/types.ts`** - Type definitions

### Config

1. **`backend/backend/settings.py`** - Django settings
2. **`backend/backend/asgi.py`** - ASGI config (Channels)
3. **`frontend/tailwind.config.ts`** - Theme config
4. **`docker-compose.yml`** - Full stack orchestration

---

## Quick Navigation

- **Getting Started**: [README.md](./README.md)
- **System Design**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Feature List**: [FEATURES.md](./FEATURES.md)
- **Deployment**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Backend Docs**: [backend/README.md](./backend/README.md)
- **Frontend Docs**: [frontend/README.md](./frontend/README.md)

---

**Last Updated**: March 2026
