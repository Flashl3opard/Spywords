# Changelog

All notable changes to the Codenames Multiplayer Game project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-03-05

### 🎉 Initial Release

The first production-ready release of Codenames Multiplayer Game.

### ✨ Added

#### Backend (Django)

- **Room Management**: Create/join rooms with unique codes
- **Player System**: Multiple players per room with teams and roles
- **Game Logic**: Full Codenames rules implementation
  - 5×5 board with 25 random words
  - Color distribution (9 red, 8 blue, 7 neutral, 1 assassin)
  - Turn-based clue submission and word guessing
  - Win/loss detection
- **REST API**: 12 endpoints for all game actions
- **WebSocket Support**: Real-time event broadcasting via Django Channels
- **Word Bank**: 400+ curated words
- **Database Models**: Room, Player, WordCard with migrations
- **Admin Interface**: Django admin panel for debugging
- **Redis Integration**: Channel layer for WebSocket sync
- **Server-Side Validation**: Role-based permissions and anti-cheat measures

#### Frontend (Next.js)

- **Landing Page**: Hero with logo and action buttons
- **Create/Join Flow**: Separate pages for room creation and joining
- **Game Room**: Full multiplayer interface with:
  - 5×5 responsive game board
  - Live player list with team/role badges
  - Real-time chat
  - Clue input (spymaster view)
  - Turn indicator and remaining cards counter
  - Win celebration with confetti
- **Components**:
  - `SpyWordsLogo`: Branded neon logo with radar ping
  - `Button`: 3D pressed-button design
  - `Card`: Interactive word cards with hover/flip animations
  - `Board`: Responsive grid layout
  - `ClueInput`: Spymaster clue submission form
  - `PlayerList`: Team management UI
  - `ChatBox`: Real-time messaging
- **WebSocket Client**: Native WebSocket integration for live updates
- **TypeScript**: Full type safety across the app
- **Animations**: Framer Motion for smooth transitions
- **Sound Effects**: Web Audio API tone synthesis
- **Local Storage**: Player session persistence

#### Developer Experience

- **Documentation**:
  - [README.md](./README.md) - Setup guide
  - [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
  - [FEATURES.md](./FEATURES.md) - Complete feature list
  - [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
  - [PROJECT_TREE.md](./PROJECT_TREE.md) - File structure overview
- **Docker Support**: `docker-compose.yml` for one-command setup
- **Setup Scripts**: `setup.sh` (Linux/macOS) and `setup.ps1` (Windows)
- **Environment Templates**: `.env.example` files for easy config
- **Dockerfile**: Separate containers for backend and frontend
- **License**: MIT License for open-source use

#### Security

- Server-side validation for all game actions
- Role-based access control
- Host-only actions (start/restart)
- Anti-cheat measures (color hiding for operatives)
- CORS configuration
- Input sanitization

#### UI/UX

- Aurora gradient backgrounds
- Glassmorphism design system
- Responsive layout (mobile/tablet/desktop)
- Hover/tap animations
- Win celebration confetti
- Dark theme optimized
- Branded color palette (neon green, yellow, purple)

---

## [Unreleased]

### Planned Features

- User authentication (JWT)
- Persistent user accounts
- Game history and replays
- Custom word packs
- Timer per turn
- Leaderboards
- Spectator mode
- Voice chat integration
- Mobile app (React Native)
- AI Spymaster opponent

---

## Known Issues

### Backend

- None at release

### Frontend

- WebSocket reconnection could be more robust (planned for v1.1)
- Chat history not paginated (entire history loaded)

---

## Migration Guide

### From Pre-Release

This is the first official release. If you were testing an earlier version:

1. Pull latest code
2. Run migrations: `python manage.py migrate`
3. Reinstall frontend dependencies: `npm install`
4. Clear browser localStorage to reset player sessions

---

## Contributors

- Initial development: [Your Team/Name]
- Inspired by: Codenames by Vlaada Chvátil

---

## Resources

- **GitHub Issues**: Report bugs and request features
- **Documentation**: See [README.md](./README.md)
- **Community**: [Link to Discord/Slack/Forum]

---

**Legend**:

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

---

For older versions, see [Releases](./releases) (if applicable).
