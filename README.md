# Astrokarak - Vedic Astrology Education

## Run Locally

Prerequisites: Node.js 20+

1. Install dependencies:
   `npm install`
2. Set required env vars in `.env.local`:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)
3. Run the app:
   `npm run dev`

## Deploy on GitHub Pages

This repository is configured for GitHub Actions deployment to GitHub Pages via `.github/workflows/deploy-pages.yml`.

1. In GitHub repository settings, ensure Pages uses `GitHub Actions` as the source.
2. Add these repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)
3. Push to `main` to trigger deployment.

## Supabase Security Setup (Required for Admin + Member Data)

1. In Supabase SQL Editor, run:
   - `supabase/secure-access.sql`
2. Ensure your `profiles` table includes:
   - `id uuid` (same as `auth.users.id`)
   - `role text` (`admin` or `subscriber`)
   - `subscription_active boolean`
3. Set at least one admin user in `profiles.role = 'admin'`.

After setup:
- Admin-only: blog editing, member management, analytics, purchase data.
- Member-only: own biodata, own purchases/bookings/entitlements.
- Public users cannot read subscriber-only records.
