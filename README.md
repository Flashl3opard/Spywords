# Codenames Multiplayer Game

A full-stack real-time multiplayer word-guessing game inspired by Codenames.

## Tech Stack

### Frontend

- Next.js 14 (App Router)
- React + TypeScript
- TailwindCSS
- Framer Motion
- Socket.IO Client

### Backend

- Django 5
- Django REST Framework
- Django Channels (WebSockets)
- Redis (for channel layer)
- SQLite (development) / PostgreSQL (production)

---

## Project Structure

```
codenames-game/
├── backend/          # Django backend
│   ├── backend/      # Django settings and config
│   ├── game/         # Core game logic, models, APIs
│   ├── users/        # User-related (minimal for now)
│   ├── websocket/    # WebSocket consumers and routing
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # Next.js frontend
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── lib/          # Utilities (API, storage, types)
│   ├── public/       # Static assets
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- Redis (for WebSocket channel layer)

Install Redis:

- **Windows**: Download from https://github.com/microsoftarchive/redis/releases or use WSL
- **macOS**: `brew install redis`
- **Linux**: `sudo apt install redis-server`

---

## Backend Setup

1. **Navigate to backend folder:**

```bash
cd backend
```

2. **Create a virtual environment:**

```bash
python -m venv venv
```

3. **Activate virtual environment:**

- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**

```bash
pip install -r requirements.txt
```

5. **Create `.env` file (optional):**

```env
DEBUG=1
DJANGO_SECRET_KEY=your-secret-key
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=http://localhost:3000
REDIS_URL=redis://127.0.0.1:6379/1
USE_IN_MEMORY_CHANNEL_LAYER=0
```

For quick development without Redis, set `USE_IN_MEMORY_CHANNEL_LAYER=1`.

6. **Run migrations:**

```bash
python manage.py migrate
```

7. **Create superuser (optional):**

```bash
python manage.py createsuperuser
```

8. **Start Redis:**

```bash
redis-server
```

9. **Run the Django development server:**

```bash
python manage.py runserver 0.0.0.0:8000
```

Backend will be available at: **http://localhost:8000**

---

## Frontend Setup

1. **Navigate to frontend folder:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create `.env.local` file:**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000
```

4. **Run the Next.js development server:**

```bash
npm run dev
```

Frontend will be available at: **http://localhost:3000**

---

## Running the Full Stack

### Start Backend (Terminal 1)

```bash
cd backend
python manage.py runserver
```

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

### Start Redis (Terminal 3, if needed)

```bash
redis-server
```

---

## How to Play

1. Go to **http://localhost:3000**
2. Click "CREATE ROOM" or "JOIN ROOM"
3. Share the room code with your friends
4. Players select teams (Red or Blue)
5. Each team selects one Spymaster and one or more Operatives
6. Host clicks "START GAME"
7. Spymaster gives clues like "Ocean 2"
8. Operatives guess words
9. Match all your team's words to win!

---

## Game Rules

- **Grid:** 5x5 board of 25 random words
- **Teams:** Red (9 agents) vs Blue (8 agents)
- **Roles:**
  - **Spymaster:** Can see hidden colors, gives one-word + number clues
  - **Operative:** Guesses words based on clues
- **Turn Flow:**
  - Spymaster gives clue
  - Operatives guess up to `<number> + 1` words
  - If correct → continue guessing (same team)
  - If neutral → turn ends
  - If opponent's word → opponent scores, turn ends
  - If assassin → instant loss
- **Win Condition:** First team to reveal all their agents wins

---

## Features

✅ Real-time multiplayer rooms  
✅ Secure server-side validation  
✅ WebSocket-based live updates  
✅ Responsive design (mobile/tablet/desktop)  
✅ Beautiful UI with Framer Motion animations  
✅ Confetti win celebration  
✅ In-game chat  
✅ Sound effects  
✅ Copy room code button  
✅ Spymaster view with color overlays  
✅ Turn indicator  
✅ Remaining word counter

---

## API Endpoints

| Method | Endpoint        | Description                |
| ------ | --------------- | -------------------------- |
| POST   | `/create-room`  | Create a new room          |
| POST   | `/join-room`    | Join an existing room      |
| GET    | `/room-state`   | Get current room state     |
| POST   | `/set-team`     | Set player team            |
| POST   | `/set-role`     | Set player role            |
| POST   | `/start-game`   | Start the game (host only) |
| POST   | `/submit-clue`  | Submit a clue (spymaster)  |
| POST   | `/guess-word`   | Guess a word (operative)   |
| POST   | `/end-turn`     | End current turn           |
| POST   | `/restart-game` | Restart game (host only)   |
| POST   | `/chat`         | Send chat message          |
| POST   | `/react`        | Send emoji reaction        |

---

## WebSocket Events

| Event           | Trigger                | Payload                     |
| --------------- | ---------------------- | --------------------------- |
| `player_joined` | Player joins room      | `{ player, players }`       |
| `player_left`   | Player disconnects     | `{ players }`               |
| `team_changed`  | Player changes team    | `{ players }`               |
| `role_changed`  | Player changes role    | `{ players }`               |
| `game_started`  | Host starts game       | `{ room, remaining }`       |
| `clue_given`    | Spymaster submits clue | `{ clue, guesses_left }`    |
| `word_guessed`  | Word is revealed       | `{ card, remaining, turn }` |
| `turn_changed`  | Turn switches          | `{ turn }`                  |
| `game_over`     | Game ends              | `{ winner, remaining }`     |
| `chat_message`  | Chat sent              | `{ by, message }`           |
| `reaction`      | Emoji reaction         | `{ by, emoji }`             |

---

## Production Deployment

### Backend

1. Set environment variables:
   - `DEBUG=0`
   - `DJANGO_SECRET_KEY=<strong-random-key>`
   - `ALLOWED_HOSTS=yourdomain.com`
   - `DATABASE_URL=postgres://...` (if using PostgreSQL)
   - `REDIS_URL=redis://...`

2. Collect static files:

```bash
python manage.py collectstatic
```

3. Use a production ASGI server like Daphne or Uvicorn:

```bash
pip install daphne
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
```

### Frontend

1. Build for production:

```bash
npm run build
```

2. Start:

```bash
npm run start
```

Or deploy to Vercel/Netlify.

---

## Troubleshooting

### WebSocket not connecting

- Ensure Redis is running
- Check `NEXT_PUBLIC_WS_BASE_URL` matches your backend
- Verify Django Channels is properly configured

### CORS issues

- Add frontend URL to `CORS_ALLOWED_ORIGINS` in Django settings

### Game state not syncing

- Check WebSocket connection in browser console
- Ensure all players are connected to the same room code

---

## Credits

Built with ❤️ using Next.js, Django, Channels, and Socket.IO.

Inspired by the board game **Codenames** by Vlaada Chvátil.

---

## License

MIT License - Feel free to modify and use for your own projects!
