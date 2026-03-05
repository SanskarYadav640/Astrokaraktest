-- Run this in Supabase SQL editor.
-- It creates secure member/admin tables and RLS policies.

create extension if not exists pgcrypto;

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
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

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
