# PickFlick

**Pick a flick, together** — a self-hosted movie night picker for your Jellyfin library.

PickFlick is a fun, interactive web app that lets your family or group pick a movie from your Jellyfin library together. Spin a genre wheel, nominate films, vote, and reveal the winner — all from your own devices on the same network.

## Features

- **Genre Wheel** — Spin to pick tonight's genre from your actual library
- **Smart Content Filtering** — Automatically filters by the most restrictive viewer's age tier (Kid/Teen/Adult)
- **Movie Nominations** — Each participant browses unwatched titles and nominates picks
- **Live Voting** — Everyone votes with tap-to-toggle, live vote counts update in real time
- **Winner Reveal** — Confetti celebration with poster, synopsis, and a direct Jellyfin link
- **Movie Night History** — Log of past winners, viewable from the menu
- **Zero External Services** — Everything runs on your network, talking directly to your Jellyfin server

## Screenshots

> _Screenshots coming soon — run it yourself and see!_

## Prerequisites

- A running [Jellyfin](https://jellyfin.org/) server (v10.8+)
- A Jellyfin API key (generate one in **Dashboard → API Keys**)
- Docker (recommended) or Node.js 20+

## Quick Start with Docker Compose

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/pickflick.git
   cd pickflick
   ```

2. Edit `docker-compose.yml` with your Jellyfin details:
   ```yaml
   environment:
     - JELLYFIN_URL=http://your-jellyfin-server:8096
     - JELLYFIN_API_KEY=your-api-key-here
     - NEXT_PUBLIC_JELLYFIN_URL=http://your-jellyfin-server:8096
   ```

3. Start the app:
   ```bash
   docker-compose up -d
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Quick Start with Docker

```bash
docker build -t pickflick .
docker run -p 3000:3000 \
  -e JELLYFIN_URL=http://your-jellyfin-server:8096 \
  -e JELLYFIN_API_KEY=your-api-key-here \
  -e NEXT_PUBLIC_JELLYFIN_URL=http://your-jellyfin-server:8096 \
  -v pickflick-data:/app/data \
  pickflick
```

## Development Setup

```bash
git clone https://github.com/yourusername/pickflick.git
cd pickflick
cp .env.example .env
# Edit .env with your Jellyfin URL and API key
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `JELLYFIN_URL` | Yes | Your Jellyfin server URL (e.g., `http://192.168.1.100:8096`) |
| `JELLYFIN_API_KEY` | Yes | API key from Jellyfin Dashboard → API Keys |
| `NEXT_PUBLIC_JELLYFIN_URL` | Yes | Same as `JELLYFIN_URL` — used by the browser for poster images |
| `DATABASE_URL` | No | SQLite path (default: `file:./dev.db` for dev, `file:/app/data/pickflick.db` in Docker) |

## How Content Filtering Works

PickFlick uses **age tiers** to determine content suitability:

| Age Tier | Max Content Rating |
|---|---|
| Kid | PG |
| Teen | PG-13 |
| Adult | Unrestricted |

When participants are selected for a movie night, PickFlick finds the **most restrictive** tier among them and uses that as the ceiling for every step — genre wheel, movie browsing, and nominations. This happens silently and automatically.

For example: if a Kid (PG max) and an Adult are both watching, only G and PG-rated titles will appear — regardless of what the Adult would normally see.

## Tech Stack

- **Next.js 14** (App Router) — React framework
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling with glassmorphism design
- **Prisma + SQLite** — Local database for profiles and history
- **Jellyfin REST API** — Movie metadata, posters, content ratings
- **Docker** — Single-container deployment

## License

[MIT](LICENSE)
