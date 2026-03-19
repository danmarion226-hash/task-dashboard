# Deployment Guide (Vercel + Supabase)

This guide gets the dashboard live on Vercel using free tiers.

## 1) Supabase setup

1. Open your Supabase project.
2. Go to **SQL Editor** and run `supabase/schema.sql`.
   - If you already set up tasks before due dates were added, also run:
     - `supabase/migrations/20260319_add_due_date_to_tasks.sql`
3. Go to **Authentication > Providers**:
   - Enable **Email** provider.
   - For quick testing, disable email confirmation (optional).
4. Go to **Project Settings > API** and copy:
   - `Project URL`
   - `anon public key`

## 2) Local environment setup

1. Create `.env.local` from `.env.example`.
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Validate locally:
   - `npm run dev`
   - Open `http://localhost:3000`
   - Sign up and sign in
   - Add/toggle/delete tasks

## 3) Push to GitHub

If not already pushed:

```bash
git add .
git commit -m "Initial Magic Mirror dashboard implementation"
git push -u origin main
```

## 4) Deploy on Vercel

1. Go to [Vercel](https://vercel.com/), click **Add New Project**.
2. Import your GitHub repository.
3. Framework should auto-detect as **Next.js**.
4. In **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**.

## 5) Post-deploy verification

After deploy finishes, verify:

1. `https://<your-domain>/api/health` returns JSON with `"status":"ok"`.
2. Signup flow works at `https://<your-domain>/signup`.
3. Login flow works at `https://<your-domain>/login`.
4. Dashboard route `/` redirects correctly when logged out.
5. Tasks CRUD works for account A.
6. Create account B and verify account B cannot see account A tasks.
7. Weather and quote sections load without UI breakage.

## 6) Production hardening (still free)

1. In Supabase Auth settings, re-enable email confirmation if desired.
2. In Vercel:
   - Set Production branch to `main`.
   - Enable preview deployments for pull requests.
3. Keep service-role key out of frontend env vars.

