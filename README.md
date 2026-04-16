# College Deadlock Website

Collegiate Deadlock esports site: schools map, current/past events, teams, Discord login, and optional form notifications via Discord webhook.

Repository: [github.com/g8tsz/deadlock-web](https://github.com/g8tsz/deadlock-web)

## Setup

### 1. Install and database (local SQLite)

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx prisma db seed
```

- **SQLite (default in `.env.example`)** stores data in `prisma/dev.db` (gitignored). Good for local development.
- **PostgreSQL** is supported for production: set `DATABASE_URL` to a Postgres connection string and run `npx prisma migrate deploy` (see [Vercel / production](#vercel--production)).

### 2. Discord login (optional)

Create an app at the [Discord Developer Portal](https://discord.com/developers/applications) → OAuth2 → Redirects: `http://localhost:3000/api/auth/callback/discord` (add your production URL when you deploy).

In `.env` set:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_SECRET`
- `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)

### 3. Site URL and forms

- Set **`NEXT_PUBLIC_SITE_URL`** to your canonical public URL in production (used for sitemap and Open Graph). On Vercel, `VERCEL_URL` is used as a fallback if this is unset.
- **Contact and newsletter forms** POST to `/api/contact` and `/api/newsletter`. Configure **`FORMS_DISCORD_WEBHOOK_URL`** with a [Discord incoming webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) URL so submissions appear in a channel. Without it, production form endpoints return 503; in **development**, submissions are logged to the server console instead.

### 4. Run

```bash
npm run dev
```

Open the URL Next.js prints (e.g. [http://localhost:3000](http://localhost:3000)); if port 3000 is in use it may be 3001 or 3002. Many pages need the database: run `db push` and `db seed` first or you may see errors until SQLite exists and is seeded.

## Vercel / production

1. Create a **Postgres** database (Vercel Postgres, Neon, Supabase, etc.) and set `DATABASE_URL` in the project environment.
2. Build command can stay `npm run vercel-build` (runs `prisma migrate deploy`, `prisma generate`, `next build`) or align with your host’s docs.
3. Set `NEXTAUTH_URL` to your live site URL, Discord OAuth redirect to `https://your-domain/api/auth/callback/discord`, and `NEXT_PUBLIC_SITE_URL` to `https://your-domain`.
4. Set `FORMS_DISCORD_WEBHOOK_URL` if you want contact/newsletter deliveries.

## Features

- **Home**: Upcoming matches, current standings, CTAs
- **Events / schools / schedule**: Data-driven from Prisma
- **News**: List at `/news` and articles at `/news/[slug]`
- **Sign in with Discord**: Optional when Discord app credentials are set
- **Bot ingest API**: `POST /api/ingest/match` and `/api/ingest/standings` with `Authorization: Bearer <BOT_INGEST_SECRET>` — see [docs/INGEST.md](docs/INGEST.md)

## Data

- **Local**: SQLite at `prisma/dev.db`. Edit `prisma/seed.ts` and run `npx prisma db seed` to refresh seed data.
- **Production**: Prefer Postgres + migrations in `prisma/migrations/`.

## Scripts

| Script            | Purpose                          |
| ----------------- | -------------------------------- |
| `npm run dev`     | Next.js dev server               |
| `npm run build`   | `prisma generate` + `next build` |
| `npm run lint`    | ESLint                           |
| `npm run db:push` | Push schema (dev SQLite)         |
| `npm run db:seed` | Run seed                         |

## License

MIT — see [LICENSE](LICENSE).
