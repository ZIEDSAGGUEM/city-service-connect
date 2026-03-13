# City Service Connect — Frontend

React frontend for the City Service Connect local service marketplace.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** — build tool
- **Tailwind CSS** + **shadcn/ui** — styling & components
- **TanStack Query** — data fetching
- **React Router** — routing
- **Socket.io Client** — real-time updates
- **Axios** — HTTP client
- **Recharts** — analytics charts

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Then fill in your backend URL

# Start dev server
npm run dev
```

The app runs at `http://localhost:8080` by default.

## Features

- **Authentication** — register, login, email verification, password reset
- **Provider Discovery** — search, filter, view profiles and reviews
- **Service Requests** — full lifecycle (create, accept, start, complete, cancel)
- **Real-time Messaging** — per-request conversations via WebSocket
- **Reviews & Ratings** — leave reviews after completed services
- **Favorites** — save preferred providers
- **Notifications** — real-time in-app notifications
- **AI Assistant** — smart service recommendations
- **Disputes** — raise and resolve service disputes
- **Provider Dashboard** — analytics, request management, profile editing
- **Admin Dashboard** — user management, provider management, categories, disputes
- **User Settings** — notification preferences, privacy controls, account management

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Layout, Footer
│   ├── providers/       # Provider cards, lists, search
│   ├── ui/              # shadcn/ui components
│   └── ...              # AI chat, notifications, etc.
├── contexts/            # AuthContext, SocketContext
├── hooks/               # Custom React hooks
├── lib/                 # API client, auth helpers, types, utils
└── pages/               # Route pages (Dashboard, Services, Profile, etc.)
```
