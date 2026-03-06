# Backend Quick Start

## Installation

1. Create virtual environment:

```bash
python -m venv venv
```

2. Activate:

- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Copy environment variables:

```bash
cp .env.example .env
```

5. Run migrations:

```bash
python manage.py migrate
```

6. Start Redis (optional in development, required for production):

```bash
redis-server
```

7. Run server (ASGI, supports WebSockets):

```bash
daphne -b 0.0.0.0 -p 8000 backend.asgi:application
```

Backend will be live at **http://localhost:8000**

## Optional: Create Admin User

```bash
python manage.py createsuperuser
```

Access admin at **http://localhost:8000/admin**

## API Testing

Test the API:

```bash
curl -X POST http://localhost:8000/create-room \
  -H "Content-Type: application/json" \
  -d '{"name":"TestPlayer"}'
```

## Development Without Redis

In `DEBUG=1`, the app defaults to in-memory channel layer so local setup works without Redis.

You can force behavior with `.env`:

- `USE_IN_MEMORY_CHANNEL_LAYER=1` (no Redis)
- `USE_IN_MEMORY_CHANNEL_LAYER=0` (Redis-backed)
