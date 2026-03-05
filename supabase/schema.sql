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
  status          text not null default 'Draft',
  likes           integer not null default 0,
  views           integer not null default 0,
  ai_score        integer,
  risk_flags      text[],
  logo_url        text,
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
