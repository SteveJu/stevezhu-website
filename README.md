# Steve Zhu Website

Personal website built with Next.js. The public site has automatic weekday/weekend visual modes, resume download, photography, experience, education, and technical skills sections.

The owner area includes:

- Travel planner with Supabase-backed persistence
- Shared travel-plan links for collaborators
- AI screenshot filling for travel items through Gemini
- Stock dashboard placeholder

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run build
```

Run both before pushing changes.

## Environment Variables

Create `.env.local` locally. Do not commit it.

```bash
OWNER_PASSCODE=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-pro
```

`OWNER_PASSCODE` is used to sign owner-mode cookies. Changing it invalidates existing owner sessions.

## Supabase

The travel planner currently stores one JSON snapshot row in `travel_planner_state`.

Initialize the table with:

```bash
supabase/travel_planner_state.sql
```

The API uses the service role key server-side only. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

## Deployment

The site is designed for Vercel. Configure the same environment variables in Vercel before deploying.
