# Magic Mirror Dashboard - Project Plan

This plan is the blueprint for building your **Magic Mirror dashboard** using only free/open-source tools and free tiers:
- **Framework:** Next.js
- **Styling:** Professional dark theme
- **Backend/Database/Auth:** Supabase
- **Deployment:** Vercel

The app goal is a modern dashboard with:
- Daily task management
- Inspirational quote section
- Weather section
- Basic username/password login

We will execute the project in **4 milestones**.

## Confirmed Decisions (Locked)

- **Styling approach:** Tailwind CSS
- **Weather provider:** Open-Meteo (free, no API key)
- **Quote strategy:** Public API (free)
- **Authentication:** Supabase email + password, with username as display name metadata
- **Task v1 fields:** `title` + `is_completed` only
- **Device priority:** Desktop-first (with reasonable responsive behavior)

## Milestone 1: Project Initialization & Environment Setup
- Initialize Next.js app with TypeScript, ESLint, Tailwind.
- Create Supabase project and collect URL + anon key.
- Create `tasks` table with `id`, `user_id`, `title`, `is_completed`, timestamps.
- Enable RLS and add per-user policies for select/insert/update/delete.
- Configure `.env.local` and Vercel env vars.
- Connect GitHub repo to Vercel and validate deployment.

## Milestone 2: User Interface Design
- Build a dark, professional dashboard layout.
- Create reusable card and form styles using Tailwind.
- Implement desktop-first responsive sections for Weather, Quote, and Tasks.
- Add loading, empty, and error states.

## Milestone 3: Database Functionality
- Connect app to Supabase using browser and server clients.
- Implement tasks CRUD:
  - Load tasks
  - Add task
  - Mark complete/incomplete
  - Delete task
- Ensure all operations are user-scoped and resilient.

## Milestone 4: Authentication
- Build signup/signin flows with email + password.
- Save username in user metadata on signup.
- Protect dashboard routes and redirect unauthenticated users.
- Add logout and session checks.

## Production Checklist
- Build succeeds locally and on Vercel.
- Env vars set in local + Vercel.
- Auth and tasks CRUD work in production.
- Weather + quote sections gracefully handle API failures.
