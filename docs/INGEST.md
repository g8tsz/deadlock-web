# Discord bot → website ingest API

The Next.js app exposes authenticated routes so a Discord bot (see the `bot/` package) can update matches and standings in the same database the site uses.

## Authentication

Every request must include:

```http
Authorization: Bearer <BOT_INGEST_SECRET>
```

Set `BOT_INGEST_SECRET` in the app environment to a long random string. The bot uses the same value (see `bot/.env.example`). **Never commit real secrets** or expose this header from browser code.

## Optional IP allowlist

After the bearer token is validated, you can restrict callers by IP:

- Set **`BOT_INGEST_ALLOWED_IPS`** to a comma-separated list of IPv4/IPv6 addresses that may call ingest (for example, your bot’s egress IPs).
- If the variable is **unset** or empty, any IP is allowed once the secret is valid.
- The literal `*` in the list means “allow any IP” (same as leaving the variable unset).

If the client IP is not in the allowlist, ingest returns **403 Forbidden**.

## Endpoints

- `POST /api/ingest/match` — body validated by `lib/schemas/ingest.ts` (`matchIngestSchema`). Creates or updates matches for an event slug.
- `POST /api/ingest/standings` — standings updates per event (see schema in the same module).

If `BOT_INGEST_SECRET` is unset, ingest routes return **503** with `Ingest not configured`.

## Production notes

- Prefer **PostgreSQL** in production; point `DATABASE_URL` at your provider and run `prisma migrate deploy` on deploy.
- Combine bearer auth with **`BOT_INGEST_ALLOWED_IPS`** or a private network path if the ingest URL is on the public internet.
- The standalone bot in `bot/` is documented in `bot/README.md`.
