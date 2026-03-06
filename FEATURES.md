# Features & Gameplay Guide

## 🎮 Core Gameplay Features

### ✅ Full Codenames Rules Implementation

- **5×5 Word Grid**: 25 randomly selected words per game
- **Color Distribution**:
  - 9 Red agent cards
  - 8 Blue agent cards
  - 7 Neutral bystanders
  - 1 Assassin (instant loss if revealed)
- **Two Teams**: Red vs Blue with asymmetric information
- **Two Roles**:
  - **Spymaster**: Sees all card colors, gives clues
  - **Operative**: Sees only words, guesses based on clues

### 🎯 Turn-Based Gameplay

1. Spymaster gives a one-word clue + number (e.g., "Ocean 3")
2. Operatives guess up to `number + 1` words
3. Correct guess → continue guessing
4. Wrong team → opponent scores, turn ends
5. Neutral → turn ends
6. Assassin → instant defeat

### 🏆 Win Conditions

- First team to reveal all their agents wins
- Revealing the assassin = instant loss for that team

---

## 🚀 Multiplayer Features

### Room Management

✅ **Create Room**

- Generate unique 6-character room code
- Automatic host assignment
- Shareable room codes

✅ **Join Room**

- Enter room code to join existing game
- Name validation (no duplicates per room)
- Real-time player list updates

✅ **Lobby System**

- Players can join before game starts
- Team selection (Red / Blue / Spectator)
- Role selection (Spymaster / Operative)
- Host controls when to start

✅ **Player Management**

- Live player count
- Team badges with color coding
- Role icons (🎩 Spymaster, 🕵️ Operative)
- Switch teams/roles anytime in lobby

---

## 🌐 Real-Time Features

### WebSocket Integration

✅ **Instant Updates**

- Player joins/leaves broadcast to all
- Team/role changes sync immediately
- Game state updates without refresh

✅ **Live Events**

- Clue submission appears for all players
- Word reveals animate in real-time
- Turn changes trigger notifications
- Win/loss broadcast with confetti

✅ **In-Game Chat**

- Real-time messaging
- Player name labels
- Auto-scroll to latest message
- Persists across game rounds

✅ **Emoji Reactions** (Framework ready)

- Send quick reactions during gameplay
- Broadcast to all players

---

## 🎨 UI/UX Features

### Beautiful Design

✅ **Modern Game Aesthetic**

- Aurora gradient backgrounds
- Glassmorphism cards
- Neon glow effects on logo
- Smooth animations with Framer Motion

✅ **Responsive Layout**

- Mobile-friendly (portrait/landscape)
- Tablet optimized
- Desktop ultra-wide support
- Adaptive 5×5 grid

✅ **Branded Components**

- Custom "Spy Words" logo with radar ping
- Iconic 3D pressed-button design
- Consistent color palette (neon green, yellow accents)
- Retro arcade game vibes

### Interactive Elements

✅ **Card Interactions**

- Hover zoom + glow effect
- Tap scale animation
- Flip reveal with color transition
- Spymaster overlay (semi-transparent colors)

✅ **Clue Display**

- Prominent clue card with team color
- Remaining guesses counter
- Clue author name

✅ **Turn Indicator**

- Big, bold current team display
- Red/Blue color coding
- Remaining cards per team

✅ **Win Celebration**

- Confetti explosion 🎉
- Full-screen winner banner
- Restart game button for host

---

## 🎵 Audio/Visual Feedback

✅ **Sound Effects** (Tone-synthesized)

- Button click
- Card reveal
- Turn change chime
- Victory fanfare

✅ **Visual Animations**

- Card hover lift
- Clue input scale-in
- Player list slide transitions
- Confetti on win

---

## 🔒 Security Features

✅ **Server-Side Validation**

- All game actions validated on backend
- Role-based permissions enforced
- Turn order checked before actions
- Card state verified (prevent re-guessing)

✅ **Anti-Cheat**

- Operatives cannot see card colors (not sent via API)
- Spymasters cannot guess words
- Only host can start/restart game
- One spymaster per team limit

✅ **Data Integrity**

- Room codes uniquely generated
- Player names validated per room
- Game state stored server-side

---

## 🛠️ Developer Features

### Backend (Django)

✅ **RESTful API**

- 12 endpoints for game actions
- JSON responses
- CORS configured for frontend

✅ **Django Channels WebSockets**

- Real-time bidirectional communication
- Redis-backed channel layer
- Room-based message broadcasting

✅ **Database Models**

- Room, Player, WordCard
- Relationships with foreign keys
- JSON field for flexible game state

✅ **Admin Interface**

- Django admin panel included
- Manage rooms/players/cards
- Debug game state

### Frontend (Next.js)

✅ **App Router (Next.js 14)**

- Server components where possible
- Client components for interactivity
- File-based routing

✅ **TypeScript**

- Full type safety
- Shared types (`lib/types.ts`)
- Autocomplete for API responses

✅ **API Client** (`lib/api.ts`)

- Centralized fetch wrapper
- Error handling
- Environment-based URLs

✅ **Local Storage**

- Player session persistence
- Auto-rejoin on refresh

---

## 📱 Responsive Features

✅ **Mobile Optimization**

- Touch-friendly card sizes
- Vertical stacking for UI panels
- Large tap targets
- Optimized keyboard inputs

✅ **Tablet Layout**

- Dual-column layout
- Sidebar for players/chat
- Horizontal clue input

✅ **Desktop Experience**

- Wide board layout
- Multiple columns for info panels
- Keyboard shortcuts ready (future)

---

## ♿ Accessibility (Future)

- [ ] Keyboard navigation
- [ ] Screen reader labels
- [ ] High contrast mode
- [ ] Color-blind friendly palettes
- [ ] Focus states on all interactive elements

---

## 🎮 Gameplay Enhancements

### Quality of Life

✅ **Copy Room Code**

- One-click copy to clipboard
- Share easily with friends

✅ **Current Player Highlighting**

- Your info displayed prominently
- Easy team/role switching

✅ **Remaining Cards Counter**

- Live update
- Red vs Blue progress

✅ **End Turn Button**

- Operatives can manually end turn
- Skip remaining guesses

✅ **Restart Game**

- Host can restart after game ends
- New board generated
- Teams/roles preserved

✅ **Chat Persistence**

- Chat history saved across game rounds
- Scroll to view older messages

---

## 🧩 Word Bank

✅ **400+ Words**

- Common nouns (tree, ocean, bank)
- Abstract concepts (time, gravity, echo)
- Compound words (frozen_river, silent_blade)
- Thematic variety (tech, nature, fantasy)

✅ **Random Selection**

- 25 words picked per game
- Shuffled colors
- No repeats in same game

---

## 🌍 Deployment Features

✅ **Docker Support**

- `docker-compose.yml` included
- One-command setup
- Redis, backend, frontend orchestration

✅ **Environment Variables**

- `.env.example` files
- Easy configuration
- Production/dev modes

✅ **Database Flexibility**

- SQLite for dev
- PostgreSQL for production
- Database URL support

✅ **Static File Handling**

- Django `collectstatic` ready
- Next.js build optimization

---

## 🔮 Future Feature Roadmap

### Planned Enhancements

- [ ] **User Authentication**: Persistent accounts with JWT
- [ ] **Game History**: View past games and stats
- [ ] **Custom Word Packs**: Upload your own word lists
- [ ] **Timer Mode**: Add time limits per turn
- [ ] **Leaderboards**: Track wins/losses
- [ ] **Spectator Mode**: Watch games without revealing board
- [ ] **Voice Chat**: Integrated WebRTC voice comms
- [ ] **Replays**: Rewatch games move-by-move
- [ ] **Tournaments**: Bracket-style competitions
- [ ] **Mobile App**: React Native version
- [ ] **AI Spymaster**: Play against AI
- [ ] **Dark Mode Toggle**: Built-in theme switcher

---

## 📊 Technical Specs

| Feature            | Technology                   |
| ------------------ | ---------------------------- |
| Frontend Framework | Next.js 14 (App Router)      |
| UI Styling         | TailwindCSS                  |
| Animations         | Framer Motion                |
| Real-Time          | Native WebSocket API         |
| Backend Framework  | Django 5                     |
| Real-Time Backend  | Django Channels              |
| Database           | SQLite / PostgreSQL          |
| Channel Layer      | Redis                        |
| API Style          | REST (Django REST Framework) |
| Type Safety        | TypeScript                   |
| Containerization   | Docker + Docker Compose      |

---

## 🎉 Easter Eggs

✅ **Confetti Celebration**: 200 particles on win  
✅ **Neon Logo Pulse**: Animated radar ping on logo  
✅ **Assassin Skull**: 💀 Emoji reveals on assassin card  
✅ **3D Button Press**: Satisfying skew + shadow effect  
✅ **Aurora Background**: Dynamic gradient overlay

---

For full documentation, see:

- [README.md](./README.md) - Setup instructions
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical design
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production guide

**Ready to play?** Start the servers and visit http://localhost:3000! 🎮
