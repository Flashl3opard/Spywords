# Troubleshooting Guide

Common issues and solutions for the Codenames Multiplayer Game.

---

## Installation Issues

### Backend

#### Problem: `ModuleNotFoundError: No module named 'channels'`

**Solution**: Make sure you activated the virtual environment and installed dependencies:

```bash
cd backend
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

#### Problem: `django.db.utils.OperationalError: no such table`

**Solution**: Run migrations:

```bash
python manage.py migrate
```

#### Problem: Redis connection error

**Solution**:

1. Check if Redis is running: `redis-cli ping` (should return `PONG`)
2. Start Redis: `redis-server`
3. Or use in-memory channel layer: Set `USE_IN_MEMORY_CHANNEL_LAYER=1` in `.env`

#### Problem: Port 8000 already in use

**Solution**:

- Kill existing process: `lsof -ti:8000 | xargs kill -9` (macOS/Linux)
- Or use different port: `python manage.py runserver 8001`

### Frontend

#### Problem: `npm ERR! code ENOENT`

**Solution**: Make sure you're in the `frontend` directory and run:

```bash
npm install
```

#### Problem: `Module not found: Can't resolve 'framer-motion'`

**Solution**: Install dependencies:

```bash
npm install
```

#### Problem: Port 3000 already in use

**Solution**:

- Kill process: `lsof -ti:3000 | xargs kill -9` (macOS/Linux)
- Or change port: `npm run dev -- -p 3001`

---

## Runtime Issues

### WebSocket Connection

#### Problem: WebSocket fails to connect

**Symptoms**: Console error `WebSocket connection failed` or events not updating in real-time

**Solutions**:

1. Check backend is running on port 8000
2. Verify CORS settings in `backend/backend/settings.py`
3. Check `NEXT_PUBLIC_WS_BASE_URL` in frontend `.env.local`
4. For production, ensure WebSocket route is configured in reverse proxy

**Debug WebSocket**:

```javascript
// Open browser console in game room
console.log(socketRef.current.readyState);
// 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
```

#### Problem: Events broadcast but frontend doesn't update

**Solution**:

- Check browser console for errors
- Verify WebSocket `onmessage` handler is firing
- Ensure state updates are correctly destructured

### Game Logic

#### Problem: "Only spymaster can submit clue" error

**Solution**:

- Switch your role to Spymaster in the player list
- Ensure it's your team's turn

#### Problem: Can't guess words

**Solution**:

- You must be an Operative (not Spymaster)
- It must be your team's turn
- A clue must have been submitted
- Card must not be already revealed

#### Problem: Room code not found

**Solution**:

- Verify room code is correct (case-insensitive)
- Room may have been deleted from database
- Create a new room instead

#### Problem: Name already taken

**Solution**:

- Choose a different name
- Previous player with that name may still be in room
- Ask them to leave or use a unique name

### Database

#### Problem: Migrations fail

**Solution**:

```bash
# Delete database and start fresh (dev only!)
rm db.sqlite3
python manage.py migrate
```

#### Problem: Admin panel login doesn't work

**Solution**: Create superuser:

```bash
python manage.py createsuperuser
```

---

## Performance Issues

### Slow Page Load

**Solutions**:

1. Check network tab in browser DevTools
2. Ensure backend API is responding quickly
3. For production, enable Next.js build: `npm run build && npm run start`

### WebSocket Lag

**Solutions**:

1. Check Redis performance
2. Ensure channel layer is configured correctly
3. Monitor network latency
4. Consider upgrading to Redis Cluster for production

---

## Docker Issues

### Problem: `docker-compose up` fails

**Solutions**:

1. Ensure Docker is running
2. Check Docker version: `docker --version` (20.10+ recommended)
3. Try rebuilding: `docker-compose up --build --force-recreate`

### Problem: Redis container won't start

**Solutions**:

1. Check port 6379 availability
2. View logs: `docker-compose logs redis`
3. Remove volumes: `docker-compose down -v`

---

## CORS Issues

### Problem: API requests blocked by CORS

**Symptoms**: Browser console shows `Access-Control-Allow-Origin` error

**Solutions**:

1. Check `CORS_ALLOWED_ORIGINS` in backend `.env`
2. Ensure frontend URL is listed correctly
3. For development, set `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py`

**Production Fix**:

```python
# backend/backend/settings.py
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

---

## Environment Variables

### Problem: Environment variables not loading

**Solutions**:

**Backend**:

1. Ensure `.env` file exists in `backend/` directory
2. Check file name (should be `.env`, not `env.txt`)
3. Restart Django server after changes

**Frontend**:

1. Ensure `.env.local` exists in `frontend/` directory
2. Variables must start with `NEXT_PUBLIC_` to be exposed to browser
3. Restart Next.js dev server after changes

---

## Browser Issues

### Problem: UI looks broken or unstyled

**Solutions**:

1. Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. Clear browser cache
3. Check browser console for CSS errors
4. Ensure TailwindCSS is building: look for `globals.css` imports

### Problem: LocalStorage not persisting

**Solutions**:

1. Check browser privacy settings
2. Disable "Clear cookies on exit"
3. Ensure `localStorage` is enabled (not in private/incognito mode)

---

## Production Issues

### Problem: Static files not loading

**Solution**:

```bash
cd backend
python manage.py collectstatic --no-input
```

Configure web server to serve from `staticfiles/` directory.

### Problem: WebSocket connection in production fails

**Solution**: Configure reverse proxy (Nginx example):

```nginx
location /ws/ {
    proxy_pass http://localhost:8000/ws/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

### Problem: High CPU usage

**Solutions**:

1. Enable Redis persistence
2. Use database connection pooling
3. Scale horizontally with load balancer
4. Monitor with tools like Datadog or New Relic

---

## Debugging Tips

### Enable Django Debug Toolbar

```bash
pip install django-debug-toolbar
```

### Check Backend Logs

```bash
# Terminal running Django server will show logs
# Or check application logs in production
```

### Check Frontend Console

```javascript
// In browser DevTools Console
localStorage.getItem("codenames-player"); // Check stored player
```

### Test WebSocket Manually

```bash
# Install wscat
npm install -g wscat

# Connect to WebSocket
wscat -c ws://localhost:8000/ws/room/ABC123/
```

### Check Redis

```bash
redis-cli
> KEYS *
> GET room_ABC123
```

---

## Still Having Issues?

1. **Check Documentation**:
   - [README.md](./README.md)
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - [DEPLOYMENT.md](./DEPLOYMENT.md)

2. **Review Logs**:
   - Backend: Check terminal running Django
   - Frontend: Check browser console (F12)
   - Redis: `docker-compose logs redis` (if using Docker)

3. **GitHub Issues**:
   - Search existing issues
   - Create new issue with:
     - Steps to reproduce
     - Expected vs actual behavior
     - Error messages
     - Environment (OS, Python version, Node version)

4. **Community Support**:
   - [Link to Discord/Slack/Forum if available]

---

## Reporting Bugs

When reporting bugs, please include:

1. **Environment**:
   - OS (Windows/macOS/Linux)
   - Python version: `python --version`
   - Node version: `node --version`
   - Browser (Chrome/Firefox/Safari/Edge)

2. **Steps to Reproduce**:
   - Exact steps taken
   - Expected behavior
   - Actual behavior

3. **Error Messages**:
   - Backend errors from terminal
   - Frontend errors from browser console
   - Screenshots if applicable

4. **Configuration**:
   - `.env` file contents (remove secrets!)
   - Any custom modifications

---

**Last Updated**: March 2026
