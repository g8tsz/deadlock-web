# Discord bot → website ingest API

The Next.js app exposes authenticated routes so a Discord bot (see the `bot/` package) can update matches and standings in the same database the site uses.

## Authentication

Every request must include:

```http
Authorization: Bearer <BOT_INGEST_SECRET>
```

Set `BOT_INGEST_SECRET` in the app environment to a long random string. The bot uses the same value (see `bot/.env.example`). **Never commit real secrets** or expose this header from browser code.

## Endpoints

- `POST /api/ingest/match` — body validated by `lib/schemas/ingest.ts` (`matchIngestSchema`). Creates or updates matches for an event slug.
- `POST /api/ingest/standings` — standings updates per event (see schema in the same module).

If `BOT_INGEST_SECRET` is unset, ingest routes return **503** with `Ingest not configured`.

## Production notes

- Prefer **PostgreSQL** in production; point `DATABASE_URL` at your provider and run `prisma migrate deploy` on deploy.
- Rate-limit or restrict ingest by network if the URL is public; the bearer secret is required but additional IP allowlists or a private tunnel reduce abuse surface.
- The standalone bot in `bot/` is documented in `bot/README.md`.
