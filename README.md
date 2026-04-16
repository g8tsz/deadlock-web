# College Deadlock Website

Collegiate Deadlock esports site: schools map, current/past events, teams, Discord login, optional form notifications (Discord webhook), optional Turnstile on forms, and ingest APIs for the Discord bot.

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

### 3. Production checklist (URLs and forms)

| Variable | Purpose |
| -------- | ------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL (sitemap, Open Graph). On Vercel, `VERCEL_URL` is a fallback if unset. |
| `NEXTAUTH_URL` | Must match the origin users hit (scheme + host, no trailing slash), e.g. `https://your-domain.com`. **Vercel preview URLs** each have a different host: add each preview URL to Discord OAuth redirects, or use production-only sign-in. |
| `FORMS_DISCORD_WEBHOOK_URL` | [Discord webhook](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks) for contact + newsletter. Host must be `discord.com` or `discordapp.com`. **Required in production** for forms to succeed; local dev logs submissions instead. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Optional [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) — set **both** to require a solved widget on forms. |
| `BOT_INGEST_ALLOWED_IPS` | Optional comma-separated IPs allowed to call ingest APIs after bearer auth (see [docs/INGEST.md](docs/INGEST.md)). |

### 4. Run

```bash
npm run dev
```

Open the URL Next.js prints (e.g. [http://localhost:3000](http://localhost:3000)); if port 3000 is in use it may be 3001 or 3002. Many pages need the database: run `db push` and `db seed` first or you may see errors until SQLite exists and is seeded.

## Vercel / production

1. Create a **Postgres** database (Vercel Postgres, Neon, Supabase, etc.) and set `DATABASE_URL` in the project environment.
2. **Build command**: use `npm run vercel-build` when `DATABASE_URL` is **Postgres** (runs `prisma migrate deploy` then build). For **SQLite-only** preview branches, override the install command to `npm run build` (or a branch env without Postgres) so `migrate deploy` does not run against a missing DB.
3. Set **`NEXTAUTH_URL`** and **`NEXT_PUBLIC_SITE_URL`** to `https://your-domain`, and add Discord OAuth redirect `https://your-domain/api/auth/callback/discord`.
4. Set **`FORMS_DISCORD_WEBHOOK_URL`** for live form delivery; add Turnstile keys if you want CAPTCHA on forms.

## Features

- **Home**: Upcoming matches, current standings, CTAs
- **Events / schools / schedule**: Data-driven from Prisma
- **News**: List at `/news` and articles at `/news/[slug]`
- **404 / errors**: `app/not-found.tsx`, `app/error.tsx`, `app/global-error.tsx`
- **Privacy**: `/privacy` (linked in the footer)
- **Security headers**: root `middleware.ts` sets `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a minimal `Permissions-Policy`
- **Sign in with Discord**: Optional when Discord app credentials are set
- **Bot ingest API**: `POST /api/ingest/match` and `/api/ingest/standings` — see [docs/INGEST.md](docs/INGEST.md)

## Data

- **Local**: SQLite at `prisma/dev.db`. Edit `prisma/seed.ts` and run `npx prisma db seed` to refresh seed data.
- **Production**: Prefer Postgres + migrations in `prisma/migrations/`.

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Next.js dev server |
| `npm run build` | `prisma generate` + `next build` |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright smoke tests (requires `npm run build` then `npm run start`, or let Playwright start the server — see `playwright.config.ts`) |
| `npm run db:push` | Push schema (dev SQLite) |
| `npm run db:seed` | Run seed |

## News content

Articles are defined in `lib/news-posts.ts`. For a CMS or MDX later, replace that module with your content pipeline.

## Dependencies and audits

- **`sharp`** is included so `next/image` optimization works reliably in Node deployments (recommended by Next.js).
- Run `npm audit` periodically. Some reported issues (e.g. in `eslint-config-next` / `next` dev tooling) may only fix with **major** upgrades (`npm audit fix --force`); treat those as planned upgrades, not blind bumps.

## License

MIT — see [LICENSE](LICENSE).
