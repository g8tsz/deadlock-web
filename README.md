# College Deadlock Website

Collegiate Deadlock esports site: schools map, current/past events, teams, and Discord login.

## Setup

1. **Install and database**
   ```bash
   npm install
   cp .env.example .env
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

2. **Discord login (optional)**  
   Create an app at [Discord Developer Portal](https://discord.com/developers/applications) → OAuth2 → Redirects: `http://localhost:3000/api/auth/callback/discord`.  
   In `.env` set:
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`
   - `NEXTAUTH_SECRET` (e.g. `openssl rand -base64 32`)

3. **Run**
   ```bash
   npm run dev
   ```
   Open the URL Next.js prints (e.g. [http://localhost:3000](http://localhost:3000)); if 3000 is in use it may be 3001 or 3002. The site will return 500 until `db push` and `db seed` have been run.

## Features

- **Home**: Map of participating schools (pins), current season standings, student/staff signup CTA
- **Events**: List and detail pages (teams, placements, captains, staff)
- **Schools**: List (this season vs previous) and school detail with teams
- **Sign in with Discord**: Optional; works once Discord app credentials are set

## Data

Content is stored in SQLite (`prisma/dev.db`). Edit `prisma/seed.ts` and run `npx prisma db seed` to change seed data. A future Discord bot or admin UI can write to the same database.
