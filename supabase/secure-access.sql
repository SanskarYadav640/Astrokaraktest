-- Run this in Supabase SQL editor.
-- It creates secure member/admin tables and RLS policies.

create extension if not exists pgcrypto;

create table if not exists public.admin_allowed_ids (
  user_id uuid primary key references auth.users(id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

-- Helper view for dashboard/table editor: shows readable admin identities.
create or replace view public.admin_allowed_users as
select
  a.user_id,
  p.full_name,
  p.email,
  a.note,
  a.created_at
from public.admin_allowed_ids a
left join public.profiles p
  on p.id = a.user_id;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'subscriber' check (role in ('admin', 'subscriber')),
  subscription_active boolean not null default false,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_sign_in_at timestamptz
);

-- Backward-compatible migration for existing profiles tables
alter table public.profiles add column if not exists role text;
alter table public.profiles add column if not exists subscription_active boolean;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists created_at timestamptz;
alter table public.profiles add column if not exists updated_at timestamptz;
alter table public.profiles add column if not exists last_sign_in_at timestamptz;

-- Normalize role values safely for both text and enum role columns.
do $$
declare
  v_data_type text;
begin
  select c.data_type
  into v_data_type
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'profiles'
    and c.column_name = 'role';

  if v_data_type = 'USER-DEFINED' then
    -- Enum role columns cannot contain empty string; only backfill nulls.
    update public.profiles
    set role = 'subscriber'
    where role is null;
  else
    update public.profiles
    set role = 'subscriber'
    where role is null or btrim(role::text) = '';
  end if;
end
$$;
update public.profiles set subscription_active = false where subscription_active is null;
update public.profiles set created_at = now() where created_at is null;
update public.profiles set updated_at = now() where updated_at is null;

-- Preserve existing admins by seeding explicit admin ID allowlist.
insert into public.admin_allowed_ids (user_id, note)
select p.id, 'seeded_from_profiles_role_admin'
from public.profiles p
where p.role = 'admin'
on conflict (user_id) do nothing;

alter table public.profiles alter column role set default 'subscriber';
alter table public.profiles alter column role set not null;
alter table public.profiles alter column subscription_active set default false;
alter table public.profiles alter column subscription_active set not null;
alter table public.profiles alter column created_at set default now();
alter table public.profiles alter column created_at set not null;
alter table public.profiles alter column updated_at set default now();
alter table public.profiles alter column updated_at set not null;

alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles
  add constraint profiles_role_check
  check (role in ('admin', 'subscriber'));

-- Create profile rows for new auth users.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, role, subscription_active, full_name, email, avatar_url, created_at, updated_at, last_sign_in_at
  )
  values (
    new.id,
    case
      when exists (select 1 from public.admin_allowed_ids a where a.user_id = new.id) then 'admin'
      else 'subscriber'
    end,
    false,
    coalesce(
      nullif(new.raw_user_meta_data->>'full_name', ''),
      nullif(new.raw_user_meta_data->>'name', ''),
      split_part(coalesce(new.email, ''), '@', 1),
      'Member'
    ),
    new.email,
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.created_at, now()),
    now(),
    new.last_sign_in_at
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists trg_handle_new_auth_user on auth.users;
create trigger trg_handle_new_auth_user
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

-- Sync profile from auth.users for current user (captures Google metadata updates).
create or replace function public.sync_my_profile_from_auth()
returns public.profiles
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_existing_role text;
  v_existing_subscription boolean;
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  select p.role, p.subscription_active
  into v_existing_role, v_existing_subscription
  from public.profiles p
  where p.id = v_uid;

  insert into public.profiles as p (
    id, role, subscription_active, full_name, email, avatar_url, created_at, updated_at, last_sign_in_at
  )
  select
    u.id,
    case
      when exists (select 1 from public.admin_allowed_ids a where a.user_id = u.id) then 'admin'
      else coalesce(v_existing_role, 'subscriber')
    end,
    coalesce(v_existing_subscription, false),
    coalesce(
      nullif(u.raw_user_meta_data->>'full_name', ''),
      nullif(u.raw_user_meta_data->>'name', ''),
      split_part(coalesce(u.email, ''), '@', 1),
      'Member'
    ),
    u.email,
    nullif(u.raw_user_meta_data->>'avatar_url', ''),
    coalesce(u.created_at, now()),
    now(),
    u.last_sign_in_at
  from auth.users u
  where u.id = v_uid
  on conflict (id) do update set
    role = case
      when exists (select 1 from public.admin_allowed_ids a where a.user_id = excluded.id) then 'admin'
      else 'subscriber'
    end,
    subscription_active = case
      when exists (select 1 from public.admin_allowed_ids a where a.user_id = excluded.id) then true
      else p.subscription_active
    end,
    email = excluded.email,
    full_name = coalesce(excluded.full_name, p.full_name),
    avatar_url = coalesce(excluded.avatar_url, p.avatar_url),
    updated_at = now(),
    last_sign_in_at = excluded.last_sign_in_at
  returning * into v_profile;

  if v_profile.id is null then
    raise exception 'Unable to sync profile';
  end if;

  return v_profile;
end;
$$;

grant execute on function public.sync_my_profile_from_auth() to authenticated;

create table if not exists public.member_biodata (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  date_of_birth date,
  time_of_birth time,
  place_of_birth text,
  gender text,
  bio text,
  updated_at timestamptz not null default now()
);

create table if not exists public.member_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('course', 'ebook', 'service', 'package')),
  item_key text not null,
  item_title text not null,
  amount_inr numeric(12,2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('paid', 'pending', 'failed', 'refunded')),
  purchased_at timestamptz not null default now(),
  metadata jsonb
);

create index if not exists idx_member_purchases_user_id on public.member_purchases(user_id);
create index if not exists idx_member_purchases_purchased_at on public.member_purchases(purchased_at desc);

create table if not exists public.member_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('course', 'ebook', 'service', 'package')),
  item_key text not null,
  item_title text,
  source_purchase_id uuid references public.member_purchases(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique (user_id, item_type, item_key)
);

create index if not exists idx_member_entitlements_user_id on public.member_entitlements(user_id);

create table if not exists public.member_bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id text not null,
  service_title text not null,
  service_price_inr numeric(12,2) not null default 0,
  preferred_date date not null,
  preferred_time time not null,
  name text not null,
  email text not null,
  whatsapp text not null,
  message text,
  status text not null default 'new' check (status in ('new', 'confirmed', 'done', 'cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists idx_member_bookings_user_id on public.member_bookings(user_id);
create index if not exists idx_member_bookings_created_at on public.member_bookings(created_at desc);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  image text,
  author text not null default 'Astrokarak',
  category text not null,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'scheduled', 'archived')),
  is_featured boolean not null default false,
  published_at timestamptz,
  scheduled_for timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backward-compatible migration for existing blog_posts tables
alter table public.blog_posts add column if not exists status text;
alter table public.blog_posts alter column status set default 'draft';

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'blog_posts'
      and column_name = 'is_published'
  ) then
    execute $sql$
      update public.blog_posts
      set status = case when is_published then 'published' else 'draft' end
      where status is null or status = ''
    $sql$;
  else
    update public.blog_posts
    set status = 'draft'
    where status is null or status = '';
  end if;
end
$$;

alter table public.blog_posts alter column status set not null;
alter table public.blog_posts drop constraint if exists blog_posts_status_check;
alter table public.blog_posts
  add constraint blog_posts_status_check
  check (status in ('draft', 'published', 'scheduled', 'archived'));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_allowed_ids a
    where a.user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

-- One-time/bootstrap helper: add admin by email (run from SQL editor).
create or replace function public.add_admin_by_email(target_email text, admin_note text default null)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
begin
  select u.id
  into v_user_id
  from auth.users u
  where lower(u.email) = lower(trim(target_email))
  limit 1;

  if v_user_id is null then
    raise exception 'No auth.users row found for email: %', target_email;
  end if;

  insert into public.admin_allowed_ids (user_id, note)
  values (v_user_id, coalesce(admin_note, target_email))
  on conflict (user_id) do update set
    note = excluded.note;

  -- Keep profile role aligned for legacy UI checks.
  update public.profiles
  set role = 'admin', updated_at = now()
  where id = v_user_id;

  return v_user_id;
end;
$$;

revoke all on function public.add_admin_by_email(text, text) from public;
grant execute on function public.add_admin_by_email(text, text) to service_role;

-- Admin-only member management helpers for website UI.
-- NOTE: These functions cannot create/delete admins. Admins are managed manually in Supabase.
create or replace function public.admin_add_member_by_email(
  target_email text,
  member_full_name text default null,
  member_subscription_active boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_uid uuid := auth.uid();
  v_target_user auth.users%rowtype;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if public.is_admin() is not true then
    raise exception 'Admin access required';
  end if;

  select *
  into v_target_user
  from auth.users u
  where lower(u.email) = lower(trim(target_email))
  limit 1;

  if v_target_user.id is null then
    raise exception 'No registered user found for email: %', target_email;
  end if;

  if exists (select 1 from public.admin_allowed_ids a where a.user_id = v_target_user.id) then
    raise exception 'Cannot modify admin users from website';
  end if;

  insert into public.profiles as p (
    id, role, subscription_active, full_name, email, avatar_url, created_at, updated_at, last_sign_in_at
  )
  values (
    v_target_user.id,
    'subscriber',
    coalesce(member_subscription_active, false),
    coalesce(
      nullif(trim(member_full_name), ''),
      nullif(v_target_user.raw_user_meta_data->>'full_name', ''),
      nullif(v_target_user.raw_user_meta_data->>'name', ''),
      split_part(coalesce(v_target_user.email, ''), '@', 1),
      'Member'
    ),
    v_target_user.email,
    nullif(v_target_user.raw_user_meta_data->>'avatar_url', ''),
    coalesce(v_target_user.created_at, now()),
    now(),
    v_target_user.last_sign_in_at
  )
  on conflict (id) do update set
    role = 'subscriber',
    subscription_active = coalesce(member_subscription_active, p.subscription_active),
    full_name = coalesce(nullif(trim(member_full_name), ''), p.full_name),
    email = coalesce(v_target_user.email, p.email),
    avatar_url = coalesce(nullif(v_target_user.raw_user_meta_data->>'avatar_url', ''), p.avatar_url),
    updated_at = now(),
    last_sign_in_at = v_target_user.last_sign_in_at;

  return v_target_user.id;
end;
$$;

create or replace function public.admin_update_member(
  target_user_id uuid,
  target_email text default null,
  target_full_name text default null,
  target_subscription_active boolean default null
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_profile public.profiles;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if public.is_admin() is not true then
    raise exception 'Admin access required';
  end if;

  if exists (select 1 from public.admin_allowed_ids a where a.user_id = target_user_id) then
    raise exception 'Cannot modify admin users from website';
  end if;

  update public.profiles p
  set
    role = 'subscriber',
    email = coalesce(nullif(trim(target_email), ''), p.email),
    full_name = coalesce(nullif(trim(target_full_name), ''), p.full_name),
    subscription_active = coalesce(target_subscription_active, p.subscription_active),
    updated_at = now()
  where p.id = target_user_id
  returning p.* into v_profile;

  if v_profile.id is null then
    raise exception 'Member profile not found';
  end if;

  return v_profile;
end;
$$;

create or replace function public.admin_remove_member(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;
  if public.is_admin() is not true then
    raise exception 'Admin access required';
  end if;

  if exists (select 1 from public.admin_allowed_ids a where a.user_id = target_user_id) then
    raise exception 'Cannot remove admin users from website';
  end if;

  delete from public.member_entitlements where user_id = target_user_id;
  delete from public.member_bookings where user_id = target_user_id;
  delete from public.member_purchases where user_id = target_user_id;
  delete from public.member_biodata where user_id = target_user_id;
  delete from public.profiles where id = target_user_id and role <> 'admin';

  if not found then
    raise exception 'Member profile not found';
  end if;
end;
$$;

revoke all on function public.admin_add_member_by_email(text, text, boolean) from public;
grant execute on function public.admin_add_member_by_email(text, text, boolean) to authenticated;

revoke all on function public.admin_update_member(uuid, text, text, boolean) from public;
grant execute on function public.admin_update_member(uuid, text, text, boolean) to authenticated;

revoke all on function public.admin_remove_member(uuid) from public;
grant execute on function public.admin_remove_member(uuid) to authenticated;

-- Auto-grant entitlement when a paid purchase is inserted.
create or replace function public.grant_entitlement_from_purchase()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.payment_status = 'paid' then
    insert into public.member_entitlements (
      user_id, item_type, item_key, item_title, source_purchase_id, granted_at
    )
    values (
      new.user_id, new.item_type, new.item_key, new.item_title, new.id, now()
    )
    on conflict (user_id, item_type, item_key)
    do update set
      item_title = excluded.item_title,
      source_purchase_id = excluded.source_purchase_id,
      granted_at = excluded.granted_at;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_grant_entitlement_from_purchase on public.member_purchases;
create trigger trg_grant_entitlement_from_purchase
after insert on public.member_purchases
for each row
execute function public.grant_entitlement_from_purchase();

alter table public.member_biodata enable row level security;
alter table public.member_purchases enable row level security;
alter table public.member_entitlements enable row level security;
alter table public.member_bookings enable row level security;
alter table public.blog_posts enable row level security;
alter table public.profiles enable row level security;
alter table public.admin_allowed_ids enable row level security;

-- Profiles: users can see/edit themselves, admins can view/edit everyone.
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles
for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_self_insert on public.profiles;
create policy profiles_self_insert on public.profiles
for insert with check (auth.uid() = id or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
for update using (auth.uid() = id or public.is_admin())
with check (auth.uid() = id or public.is_admin());

-- Admin allowlist: website clients can only read it; mutation is manual in Supabase.
drop policy if exists admin_allowed_ids_admin_select on public.admin_allowed_ids;
create policy admin_allowed_ids_admin_select on public.admin_allowed_ids
for select using (public.is_admin());

drop policy if exists admin_allowed_ids_admin_insert on public.admin_allowed_ids;
drop policy if exists admin_allowed_ids_admin_delete on public.admin_allowed_ids;
-- No insert/delete policy on website clients.
-- Admin allowlist must be managed manually via Supabase dashboard/SQL.

-- Self or admin access for member tables.
drop policy if exists member_biodata_self_select on public.member_biodata;
create policy member_biodata_self_select on public.member_biodata
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists member_biodata_self_upsert on public.member_biodata;
create policy member_biodata_self_upsert on public.member_biodata
for all using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

drop policy if exists member_purchases_self_select on public.member_purchases;
create policy member_purchases_self_select on public.member_purchases
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists member_purchases_self_insert on public.member_purchases;
create policy member_purchases_self_insert on public.member_purchases
for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists member_purchases_admin_update on public.member_purchases;
create policy member_purchases_admin_update on public.member_purchases
for update using (public.is_admin())
with check (public.is_admin());

drop policy if exists member_entitlements_self_select on public.member_entitlements;
create policy member_entitlements_self_select on public.member_entitlements
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists member_entitlements_self_insert on public.member_entitlements;
create policy member_entitlements_self_insert on public.member_entitlements
for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists member_entitlements_admin_update on public.member_entitlements;
create policy member_entitlements_admin_update on public.member_entitlements
for update using (public.is_admin())
with check (public.is_admin());

drop policy if exists member_bookings_self_select on public.member_bookings;
create policy member_bookings_self_select on public.member_bookings
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists member_bookings_self_insert on public.member_bookings;
create policy member_bookings_self_insert on public.member_bookings
for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists member_bookings_admin_update on public.member_bookings;
create policy member_bookings_admin_update on public.member_bookings
for update using (public.is_admin())
with check (public.is_admin());

-- Blog: public can read published only, only admins can mutate.
drop policy if exists blog_public_read_published on public.blog_posts;
create policy blog_public_read_published on public.blog_posts
for select using (status = 'published' or public.is_admin());

drop policy if exists blog_admin_insert on public.blog_posts;
create policy blog_admin_insert on public.blog_posts
for insert with check (public.is_admin());

drop policy if exists blog_admin_update on public.blog_posts;
create policy blog_admin_update on public.blog_posts
for update using (public.is_admin())
with check (public.is_admin());

drop policy if exists blog_admin_delete on public.blog_posts;
create policy blog_admin_delete on public.blog_posts
for delete using (public.is_admin());
