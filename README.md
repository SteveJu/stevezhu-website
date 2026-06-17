# Steve Zhu Website

Personal website built with Next.js. The public site has automatic weekday/weekend visual modes, resume download, photography, experience, education, and technical skills sections.

The owner area includes:

- Travel planner with Supabase-backed persistence
- Shared travel-plan links for collaborators
- AI screenshot filling for travel items through Gemini
- Photography manager with Supabase metadata and Cloudflare R2 image storage
- Stock dashboard placeholder
- World Cup calendar feed with anonymous usage estimates

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
CALENDAR_ANALYTICS_SALT=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-pro
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
```

`OWNER_PASSCODE` is used to sign owner-mode cookies. Changing it invalidates existing owner sessions.

## Supabase

The travel planner and photography manager currently store JSON snapshot rows in Supabase.

Initialize the tables with:

```bash
supabase/travel_planner_state.sql
supabase/photography_state.sql
supabase/world_cup_calendar_usage.sql
```

The API uses the service role key server-side only. Never expose `SUPABASE_SERVICE_ROLE_KEY` to client code.

## Cloudflare R2

Photography images are uploaded directly to R2 through short-lived signed URLs. Supabase stores only album/photo metadata and public image URLs.

`R2_PUBLIC_URL` should point at the public bucket/custom domain used to serve images.

## Deployment

The site is designed for Vercel. Configure the same environment variables in Vercel before deploying.
