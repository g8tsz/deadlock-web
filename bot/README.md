# College Deadlock ingest bot

Slash commands call the website’s `POST /api/ingest/*` routes with `Authorization: Bearer <BOT_INGEST_SECRET>`.

## Setup

1. Create a Discord application at https://discord.com/developers/applications — Bot token, and **Privileged Gateway Intents**: enable only what you need (defaults here use no privileged intents beyond what discord.js v14 requires for slash commands).
2. Copy `.env.example` to `.env` and fill values.
3. `npm install` then `npm run dev` (or `npm run build && npm start` for production).

## Commands

- `/cdc-match` — Create or update a match (scores optional).
- `/cdc-standings-row` — Upsert one standings row for the current event table.
- `/cdc-help` — Short usage summary.

## Hosting

Run this process 24/7 on Railway, Render, Fly.io, or a small VPS. Set the same `BOT_INGEST_SECRET` as in the Next.js/Vercel environment. Use `INGEST_BASE_URL` pointing at production.

## Registering slash commands

Commands register on startup (`DISCORD_GUILD_ID` = guild-only for fast iteration; omit for global registration).
