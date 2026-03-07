# Multi-Database Setup (Public / Subscriber / Admin)

This repository currently runs with one Supabase project.  
If you want true physical separation, use **3 Supabase projects**:

1. `astrokarak-public` (public website data + auth entry)
2. `astrokarak-subscriber` (paid member data)
3. `astrokarak-admin` (admin-only ops/reporting)

## Important

- A frontend-only app cannot safely access an admin database with elevated privileges.
- For true multi-database architecture, add a backend layer (Edge Functions / API server) for admin and cross-project operations.

## Recommended split

1. Public DB:
   - `blog_posts` (published content)
   - minimal user profile fields for public UI
2. Subscriber DB:
   - `member_biodata`
   - `member_purchases`
   - `member_entitlements`
   - `member_bookings`
3. Admin DB:
   - admin analytics/reporting tables
   - admin audit logs
   - admin allowlist

## Admin Controls by Specific IDs

Use explicit ID allowlist (already added in `secure-access.sql`):

```sql
insert into public.admin_allowed_ids (user_id, note)
values
  ('00000000-0000-0000-0000-000000000000', 'founder'),
  ('11111111-1111-1111-1111-111111111111', 'ops');
```

Only these IDs are treated as admin by `public.is_admin()`.

## Next Step (Needed for true 3-DB runtime)

Build a backend service that:
- verifies user session
- reads/writes subscriber DB
- reads/writes admin DB
- keeps direct admin DB keys out of browser code
