# Architecture Documentation

## System Overview

This is a full-stack real-time multiplayer game built with a **Django backend** and **Next.js frontend**, connected via **REST APIs** and **WebSockets** for real-time communication.

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Landing    │  │  Create/Join │  │  Game Room   │         │
│  │     Page     │──▶│     Room     │──▶│   (Active)   │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                           │                    │                │
│                           │                    │                │
│                      REST API            WebSocket              │
└───────────────────────────┼────────────────────┼────────────────┘
                            │                    │
                            ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (Django + Channels)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  REST APIs   │  │  WebSocket   │  │   Game       │         │
│  │  (DRF)       │  │  Consumer    │  │   Logic      │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│          │                  │                  │                │
│          └──────────────────┴──────────────────┘                │
│                            │                                    │
│                  ┌─────────▼─────────┐                          │
│                  │     Models        │                          │
│                  │  (Room, Player,   │                          │
│                  │    WordCard)      │                          │
│                  └─────────┬─────────┘                          │
└────────────────────────────┼──────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         ┌──────▼──────┐          ┌──────▼──────┐
         │  SQLite/    │          │    Redis    │
         │  PostgreSQL │          │ (Channels)  │
         └─────────────┘          └─────────────┘
```

---

## Backend Architecture

### Core Components

#### 1. **Django Apps**

- **`game/`**: Core game logic, models, APIs, and game rules
- **`users/`**: User management (minimal in current implementation)
- **`websocket/`**: WebSocket consumers and routing

#### 2. **Models** (`game/models.py`)

##### Room

Represents a game room/session.

| Field        | Type      | Description                       |
| ------------ | --------- | --------------------------------- |
| `code`       | CharField | Unique 6-character room code      |
| `host`       | CharField | Name of the room creator          |
| `status`     | CharField | `lobby`, `active`, `finished`     |
| `turn`       | CharField | Current team (`red` or `blue`)    |
| `game_state` | JSONField | Stores clues, guesses, chat, etc. |

##### Player

Represents a player in a room.

| Field  | Type       | Description                |
| ------ | ---------- | -------------------------- |
| `name` | CharField  | Player name                |
| `team` | CharField  | `red`, `blue`, `spectator` |
| `role` | CharField  | `spymaster`, `operative`   |
| `room` | ForeignKey | Room reference             |

##### WordCard

Represents a word on the game board.

| Field      | Type         | Description                          |
| ---------- | ------------ | ------------------------------------ |
| `word`     | CharField    | The word itself                      |
| `color`    | CharField    | `red`, `blue`, `neutral`, `assassin` |
| `revealed` | BooleanField | Whether already guessed              |
| `position` | IntegerField | 0-24 grid position                   |
| `room`     | ForeignKey   | Room reference                       |

#### 3. **Game Logic** (`game/services.py`)

Core functions:

- **`create_board(room)`**: Randomly generates 25 words with correct color distribution (9 red, 8 blue, 7 neutral, 1 assassin)
- **`safe_cards_for_player(room, role, team)`**: Returns filtered card data based on player role (hides colors for operatives)
- **`room_remaining(room)`**: Counts unrevealed red/blue cards
- **`broadcast_room_event(room_code, event, payload)`**: Sends WebSocket events to all players in a room

#### 4. **REST API Endpoints** (`game/views.py`)

All endpoints validate requests server-side to prevent cheating.

| Endpoint        | Method | Auth           | Description                                       |
| --------------- | ------ | -------------- | ------------------------------------------------- |
| `/create-room`  | POST   | None           | Creates new room, returns room + player           |
| `/join-room`    | POST   | None           | Joins existing room                               |
| `/room-state`   | GET    | player_id      | Gets full room state for a player                 |
| `/set-team`     | POST   | player_id      | Changes player's team                             |
| `/set-role`     | POST   | player_id      | Changes player's role (validates spymaster limit) |
| `/start-game`   | POST   | host only      | Initializes game board and starts game            |
| `/submit-clue`  | POST   | spymaster only | Submits clue (validates turn)                     |
| `/guess-word`   | POST   | operative only | Guesses a word (validates turn, updates state)    |
| `/end-turn`     | POST   | operative only | Manually ends turn                                |
| `/restart-game` | POST   | host only      | Resets board for new round                        |
| `/chat`         | POST   | player_id      | Sends chat message                                |
| `/react`        | POST   | player_id      | Sends emoji reaction                              |

#### 5. **WebSocket Consumer** (`websocket/consumers.py`)

- **`RoomConsumer`**: Handles WebSocket connections for real-time updates
- Players join a channel group when connecting: `room_{ROOM_CODE}`
- Server broadcasts events to all connected clients in a room

##### Events Broadcasted:

- `player_joined`
- `team_changed`
- `role_changed`
- `game_started`
- `clue_given`
- `word_guessed`
- `turn_changed`
- `game_over`
- `chat_message`
- `reaction`

#### 6. **Word Bank** (`game/word_bank.py`)

- 400+ curated words + programmatically generated combinations
- Words are randomly sampled each game
- Includes common nouns, adjectives, and compound words

---

## Frontend Architecture

### Tech Stack

- **Next.js 14** with App Router
- **React 18** with TypeScript
- **TailwindCSS** for styling
- **Framer Motion** for animations
- **Canvas Confetti** for celebrations
- **Native WebSocket API** for real-time sync

### Pages

#### 1. **Landing Page** (`app/page.tsx`)

- Hero section with logo
- Create Room / Join Room buttons
- Aurora gradient background

#### 2. **Create Room** (`app/create/page.tsx`)

- Name input
- Calls `/create-room` API
- Redirects to game room

#### 3. **Join Room** (`app/join/page.tsx`)

- Name + room code input
- Calls `/join-room` API
- Redirects to game room

#### 4. **Game Room** (`app/room/[roomId]/page.tsx`)

The main game interface. Handles:

- Fetching room state via REST
- Establishing WebSocket connection
- Sync state changes in real-time
- Rendering lobby, active game, or finished states

##### State Structure:

```typescript
{
  room: { code, host, turn, status, game_state },
  players: Player[],
  cards: Card[],
  remaining: { red, blue },
  clue: { word, number, team, by },
  guesses_left: number,
  winner: 'red' | 'blue' | null,
  chat: { by, message }[],
  reactions: { by, emoji }[]
}
```

### Components

#### **SpyWordsLogo** (`components/SpyWordsLogo.tsx`)

Reusable game logo with neon glow + radar ping effect

#### **Button** (`components/Button.tsx`)

3D pressed-button style (ported from your existing `Button1`)

#### **Card** (`components/Card.tsx`)

Individual word card with:

- Hover/tap animations
- Color reveal on click
- Spymaster color overlay
- Assassin skull emoji

#### **Board** (`components/Board.tsx`)

5x5 responsive grid of cards

#### **ClueInput** (`components/ClueInput.tsx`)

Spymaster's clue input (word + number)

#### **PlayerList** (`components/PlayerList.tsx`)

Shows all players with team/role badges
Allows current player to switch teams/roles

#### **ChatBox** (`components/ChatBox.tsx`)

Real-time chat with message history

---

## Data Flow

### Creating a Room

```
User → [Create Page] → REST: /create-room
                     ↓
                Django creates Room + Player
                     ↓
              Returns { room, player }
                     ↓
        Frontend saves player in localStorage
                     ↓
          Redirects to /room/[roomId]
```

### Starting a Game

```
Host → [Game Room] → REST: /start-game
                    ↓
         Django creates 25 WordCards
                    ↓
       Broadcasts "game_started" via WS
                    ↓
      All clients reload room state
```

### Submitting a Clue

```
Spymaster → [ClueInput] → REST: /submit-clue
                         ↓
           Django validates (role, turn)
                         ↓
       Updates room.game_state.clue
                         ↓
       Broadcasts "clue_given" via WS
                         ↓
        Operatives see clue in UI
```

### Guessing a Word

```
Operative → [Card Click] → REST: /guess-word
                          ↓
         Django validates (role, turn, card)
                          ↓
              Reveals card
                          ↓
      Checks win/loss/turn-end logic
                          ↓
   Broadcasts "word_guessed" + optionally
   "turn_changed" or "game_over" events
                          ↓
         All clients sync state
```

---

## Security & Validation

### Server-Side Enforcement

✅ **Role-based access**: Only spymasters can submit clues, only operatives can guess  
✅ **Turn validation**: Players can only act during their team's turn  
✅ **Host-only actions**: Start/restart game restricted to host  
✅ **Card state checks**: Already-revealed cards cannot be guessed again  
✅ **Team limits**: Only one spymaster per team

### No Client-Side Cheating

- Card colors are hidden for operatives (not sent in API response)
- Spymaster view is validated server-side
- All game logic executed on backend

---

## Real-Time Communication

### WebSocket Lifecycle

1. **Frontend**: Opens WebSocket connection to `ws://localhost:8000/ws/room/{roomCode}/`
2. **Backend**: Consumer accepts connection and adds client to room group
3. **Frontend**: Listens for incoming JSON messages
4. **Backend**: Broadcasts events to all clients in group when state changes
5. **Frontend**: Updates local state reactively

### Channel Layer (Redis)

Django Channels uses Redis as a message broker for cross-process communication:

```
REST API View → broadcast_room_event()
                       ↓
                   Redis Pub/Sub
                       ↓
            All WebSocket Consumers
                       ↓
                Connected Clients
```

---

## Game State Machine

```
       ┌─────────────┐
       │   LOBBY     │
       │  (players   │
       │   join)     │
       └──────┬──────┘
              │
        [START GAME]
              │
              ▼
       ┌─────────────┐
       │   ACTIVE    │◀───────┐
       │  (gameplay) │        │
       └──────┬──────┘        │
              │               │
    [All words revealed   [RESTART]
     or assassin picked]      │
              │               │
              ▼               │
       ┌─────────────┐        │
       │  FINISHED   │────────┘
       │  (winner)   │
       └─────────────┘
```

---

## Deployment Considerations

### Stateless Backend

- All game state stored in database
- No session dependencies
- Can scale horizontally

### Redis Scaling

- Use Redis Cluster for production
- Channel layer handles cross-server WebSocket sync

### Database

- SQLite OK for small deployments
- PostgreSQL recommended for production

### Static Files

- Backend: Use `collectstatic` + CDN
- Frontend: Next.js auto-optimization

---

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Persistent user accounts
- [ ] Game history / replay
- [ ] Custom word packs
- [ ] Timer per turn
- [ ] Spectator mode with hidden board
- [ ] Voice chat integration
- [ ] Mobile app (React Native)
- [ ] Leaderboards

---

## Testing Strategy

### Backend

- Unit tests for game logic (services)
- Integration tests for APIs
- WebSocket consumer tests

### Frontend

- Component unit tests (Vitest/Jest)
- E2E tests (Playwright/Cypress)

---

## Performance Optimizations

- Use Django query optimization (`select_related`, `prefetch_related`)
- Cache room states in Redis (optional)
- Lazy load chat history
- Debounce WebSocket reconnections

---

For implementation details, see source code comments in:

- `backend/game/views.py` (API logic)
- `backend/game/services.py` (game rules)
- `frontend/app/room/[roomId]/page.tsx` (game UI)

---

**Last Updated**: March 2026
