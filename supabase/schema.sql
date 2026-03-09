-- Run this in your Supabase SQL editor to set up the projects table.

create table if not exists projects (
  id              text primary key,
  name            text not null,
  description     text not null,
  token_symbol    text,
  category        text not null default 'other',
  website         text,
  twitter         text,
  github          text,
  funding_target  numeric,
  funding_raised  numeric not null default 0,
  creator_wallet  text not null,
  creator_username    text,
  creator_display_name text,
  creator_pfp_url     text,
  status          text not null default 'Draft',
  likes           integer not null default 0,
  views           integer not null default 0,
  ai_score        integer,
  risk_flags      text[],
  logo_url        text,
  token_address   text,
  token_tx_hash   text,
  token_supply    bigint,
  created_at      timestamptz not null default now()
);

-- Enable Row-Level Security (allow public read, authenticated write)
alter table projects enable row level security;

create policy "Public read" on projects
  for select using (true);

create policy "Service role write" on projects
  for all using (auth.role() = 'service_role');

-- Increment helpers (called via supabase.rpc)
create or replace function increment_views(project_id text)
returns void language sql as $$
  update projects set views = views + 1 where id = project_id;
$$;

create or replace function increment_likes(project_id text)
returns void language sql as $$
  update projects set likes = likes + 1 where id = project_id;
$$;

-- ─── Token Launch: launch_transactions table ───────────────────
create table if not exists launch_transactions (
  id              uuid primary key default gen_random_uuid(),
  wallet_address  text not null,
  project_id      text references projects(id) on delete set null,
  tx_hash         text not null,
  amount_paid     numeric(10,2) not null,
  token_address   text,
  token_name      text not null,
  token_symbol    text not null,
  token_supply    bigint not null,
  status          text not null default 'pending',
  created_at      timestamptz not null default now()
);

alter table launch_transactions enable row level security;

create policy "Public read" on launch_transactions
  for select using (true);

create policy "Service role write" on launch_transactions
  for all using (auth.role() = 'service_role');

-- ─── Migration: add token columns to existing projects table ───
-- Run these if the projects table already exists without token columns.
-- They are safe to run multiple times (IF NOT EXISTS / idempotent).
alter table projects add column if not exists token_address text;
alter table projects add column if not exists token_tx_hash text;
alter table projects add column if not exists token_supply  bigint;
alter table projects add column if not exists creator_username     text;
alter table projects add column if not exists creator_display_name text;
alter table projects add column if not exists creator_pfp_url      text;

-- ─── Notification tokens for Farcaster push notifications ──────
create table if not exists notification_tokens (
  fid       bigint not null,
  app_fid   bigint not null,
  token     text not null,
  url       text not null,
  updated_at timestamptz not null default now(),
  primary key (fid, app_fid)
);

alter table notification_tokens enable row level security;

create policy "Service role only" on notification_tokens
  for all using (auth.role() = 'service_role');
