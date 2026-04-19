# AGENTS.md

## Stack

- React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + motion + react-router-dom
- Express API server for admin/CRM
- Node.js 20+

## Developer Commands

```bash
npm install           # Install dependencies
npm run dev           # Frontend dev server on port 3000
npm run dev:api       # API server (requires --experimental-strip-types)
npm run build        # Production build
npm run lint         # TypeScript check (tsc --noEmit)
npm run test:server  # Run server validation tests
```

## TypeScript Check Before Commit

Always run `npm run lint` before committing — it runs `tsc --noEmit`.

## Admin CRM Setup

1. Copy `.env.example` to `.env`
2. Terminal 1: `npm run dev:api`
3. Terminal 2: `npm run dev`
4. Apply Supabase SQL migrations
5. Access `/admin/login`

API routes: `/api/admin/*` (requires session cookie), `/api/public/*`

## Project Structure

- `server/` — Express API (admin, leads, tours, home content)
- `supabase/migrations/` — SQL migrations
- `deploy/` — Docker production config

No opencode.json or pre-commit hooks configured.