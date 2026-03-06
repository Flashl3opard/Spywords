# Frontend Quick Start

## Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.local.example .env.local
```

3. Run development server:

```bash
npm run dev
```

Frontend will be live at **http://localhost:3000**

## Build for Production

```bash
npm run build
npm run start
```

## Folder Structure

- `app/` - Next.js 14 App Router pages
- `components/` - Reusable React components
- `lib/` - API client, types, utilities
- `public/` - Static assets

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API endpoint
- `NEXT_PUBLIC_WS_BASE_URL` - WebSocket endpoint

## Deploy on Vercel

1. Import this repo in Vercel and set **Root Directory** to `frontend`.
2. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_API_BASE_URL=https://<your-backend-domain>`
   - `NEXT_PUBLIC_WS_BASE_URL=wss://<your-backend-domain>`
3. Deploy.

Important: Vercel hosts the Next.js frontend well, but your multiplayer backend (Django + Channels WebSockets) should be deployed on a websocket-capable host like Render, Railway, Fly.io, or a VPS.
