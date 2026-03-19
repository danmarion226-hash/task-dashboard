# Magic Mirror Dashboard

A professional dark-themed Next.js dashboard with:
- Supabase authentication (email/password + username metadata)
- User-scoped tasks CRUD (with optional due date)
- Weather widget (Open-Meteo)
- Inspirational quote widget (public API + fallback)

## 1) Local setup

Install dependencies:

```bash
npm install
```

Copy env template:

```bash
cp .env.example .env.local
```

Set real values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Run the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 2) Supabase setup (free tier)

1. Create a new Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
   - If you already created the table earlier, also run `supabase/migrations/20260319_add_due_date_to_tasks.sql`.
3. In Authentication settings:
   - Enable Email provider.
   - For easier testing, disable email confirmation (optional).

## 3) Vercel deployment (free tier)

1. Push this project to GitHub.
2. Import repo in Vercel.
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

For a full end-to-end release checklist, see `DEPLOY.md`.

## 4) Features included

- Protected dashboard route at `/`
- Auth pages:
  - `/login`
  - `/signup`
- API routes:
  - `GET /api/health`
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PATCH /api/tasks/:id`
  - `DELETE /api/tasks/:id`
  - `GET /api/weather`
  - `GET /api/quote`

## 5) Notes

- Weather defaults to Barcelona; coordinates can be extended later.
- Quote endpoint uses a fallback list when public API fails.
- RLS policies ensure users only manage their own tasks.
