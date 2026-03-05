<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/10WrmBHz4JbKJLkODI3MMgOh1Exhv5M5f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Supabase Security Setup (Required for Admin + Member Data)

To enable protected blog/admin/member data access and automatic purchase-based entitlements:

1. Set these env vars in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_PUBLISHABLE_KEY`)
2. In Supabase SQL Editor, run:
   - `supabase/secure-access.sql`
3. Ensure your `profiles` table includes:
   - `id uuid` (same as `auth.users.id`)
   - `role text` (`admin` or `subscriber`)
   - `subscription_active boolean`
4. Set at least one admin user in `profiles.role = 'admin'`.

After setup:
- Admin-only: blog editing, member management, analytics, purchase data.
- Member-only: own biodata, own purchases/bookings/entitlements.
- Public users cannot read subscriber-only records.
