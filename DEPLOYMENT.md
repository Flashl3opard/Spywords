# Codenames Game - Production Deployment Guide

## Docker Deployment (Recommended)

### Prerequisites

- Docker
- Docker Compose

### Quick Start

1. Clone repository
2. Run:

```bash
docker-compose up --build
```

This will start:

- Redis on port 6379
- Django backend on port 8000
- Next.js frontend on port 3000

Access the game at **http://localhost:3000**

### Production Docker Setup

For production, modify `docker-compose.yml`:

```yaml
environment:
  - DEBUG=0
  - DJANGO_SECRET_KEY=<strong-random-key>
  - ALLOWED_HOSTS=yourdomain.com
```

---

## Manual Deployment

### Backend (Django + Channels)

#### Option 1: Daphne (Recommended)

```bash
pip install daphne
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
```

#### Option 2: Uvicorn

```bash
pip install uvicorn
uvicorn backend.asgi:application --host 0.0.0.0 --port 8000
```

#### Option 3: Gunicorn + Uvicorn Workers

```bash
pip install gunicorn uvicorn[standard]
gunicorn backend.asgi:application -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Frontend (Next.js)

```bash
npm run build
npm run start
```

Or deploy to:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**

---

## Recommended Production Setup

- Frontend: Vercel
- Backend (Django + Channels WebSockets): Render or Railway
- Redis: Managed Redis (required for multi-instance realtime)

### 1) Deploy Frontend to Vercel

1. Import repository in Vercel
2. Set **Root Directory** to `frontend`
3. Add env vars:

```env
NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>
NEXT_PUBLIC_WS_BASE_URL=wss://<your-backend-domain>
```

4. Deploy

### 2) Deploy Backend to Render

You can use the included `render.yaml` blueprint at repo root.

If configuring manually:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `bash start.sh`

Required env vars:

```env
DEBUG=0
DJANGO_SECRET_KEY=<strong-random-secret>
ALLOWED_HOSTS=<your-backend-domain>
CORS_ALLOWED_ORIGINS=https://<your-frontend>.vercel.app
USE_IN_MEMORY_CHANNEL_LAYER=0
REDIS_URL=redis://<your-redis-connection-string>
```

### 3) Deploy Backend to Railway (alternative)

Manual settings:

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `bash start.sh`

Use the same env vars as Render above.

---

## Environment Variables (Production)

### Backend

```env
DEBUG=0
DJANGO_SECRET_KEY=<generate-strong-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
REDIS_URL=redis://your-redis-host:6379/1
DATABASE_URL=postgres://user:password@host:5432/dbname
```

### Frontend

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_WS_BASE_URL=wss://api.yourdomain.com
```

---

## Redis Setup

### Cloud Options

- **Redis Cloud**: https://redis.com/try-free/
- **AWS ElastiCache**
- **DigitalOcean Managed Redis**
- **Heroku Redis**

---

## PostgreSQL Setup (Optional)

Install PostgreSQL and create database:

```sql
CREATE DATABASE codenames;
CREATE USER codenames_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE codenames TO codenames_user;
```

Update `.env`:

```env
DATABASE_URL=postgres://codenames_user:strong_password@localhost:5432/codenames
```

---

## HTTPS / SSL

Use a reverse proxy like **Nginx** or **Caddy**.

### Nginx Example

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
    }

    location /ws/ {
        proxy_pass http://localhost:8000/ws/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Systemd Service (Linux)

Create `/etc/systemd/system/codenames-backend.service`:

```ini
[Unit]
Description=Codenames Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/codenames-game/backend
ExecStart=/var/www/codenames-game/backend/venv/bin/daphne -b 0.0.0.0 -p 8000 backend.asgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable codenames-backend
sudo systemctl start codenames-backend
```

---

## CDN and Static Files

For production, serve static files via CDN:

```bash
python manage.py collectstatic
```

---

## Monitoring

Recommended tools:

- **Sentry** (error tracking)
- **LogRocket** (session replay)
- **Datadog** (infrastructure monitoring)

---

## Scaling

- Use **Redis Cluster** for channel layer
- Deploy multiple backend instances behind a load balancer
- Use **Celery** for background tasks (if needed)

---

## Security Checklist

✅ Set `DEBUG=0` in production  
✅ Use strong `DJANGO_SECRET_KEY`  
✅ Enable HTTPS  
✅ Configure `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`  
✅ Use environment variables for secrets  
✅ Enable Django security middleware  
✅ Use PostgreSQL instead of SQLite  
✅ Set up regular backups

---

## Performance Tips

- Enable Redis persistence
- Use database connection pooling
- Enable Next.js image optimization
- Use a CDN for static assets
- Enable gzip compression

---

For questions or issues, refer to the main [README.md](./README.md).
