-- V73 — persistência multi-usuário para caderno, favoritos e última posição de estudo.
-- Aplicado no projeto Supabase em 2026-07-21 via MCP.

create table if not exists public.caderno_captures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id text,
  text text not null check (char_length(text) between 1 and 4000),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.caderno_captures enable row level security;
create policy "own captures select" on public.caderno_captures for select using (auth.uid() = user_id);
create policy "own captures insert" on public.caderno_captures for insert with check (auth.uid() = user_id);
create policy "own captures update" on public.caderno_captures for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own captures delete" on public.caderno_captures for delete using (auth.uid() = user_id);
create index if not exists caderno_captures_user_created_idx on public.caderno_captures (user_id, created_at desc);

create table if not exists public.caderno_errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null check (char_length(topic) between 1 and 200),
  subject_id text,
  why text,
  rule text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.caderno_errors enable row level security;
create policy "own errors select" on public.caderno_errors for select using (auth.uid() = user_id);
create policy "own errors insert" on public.caderno_errors for insert with check (auth.uid() = user_id);
create policy "own errors update" on public.caderno_errors for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own errors delete" on public.caderno_errors for delete using (auth.uid() = user_id);
create index if not exists caderno_errors_user_created_idx on public.caderno_errors (user_id, created_at desc);

create table if not exists public.caderno_exam (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 200),
  topic text,
  subject_id text,
  text text,
  confidence smallint check (confidence between 1 and 5),
  priority smallint check (priority between 1 and 5),
  created_at timestamptz not null default now()
);
alter table public.caderno_exam enable row level security;
create policy "own exam select" on public.caderno_exam for select using (auth.uid() = user_id);
create policy "own exam insert" on public.caderno_exam for insert with check (auth.uid() = user_id);
create policy "own exam update" on public.caderno_exam for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own exam delete" on public.caderno_exam for delete using (auth.uid() = user_id);
create index if not exists caderno_exam_user_created_idx on public.caderno_exam (user_id, created_at desc);

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null check (entity_type in ('subject','topic','note')),
  entity_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, entity_type, entity_id)
);
alter table public.favorites enable row level security;
create policy "own favorites select" on public.favorites for select using (auth.uid() = user_id);
create policy "own favorites insert" on public.favorites for insert with check (auth.uid() = user_id);
create policy "own favorites delete" on public.favorites for delete using (auth.uid() = user_id);

create table if not exists public.user_last_study (
  user_id uuid primary key references auth.users(id) on delete cascade,
  subject_id text,
  note_id text,
  tab text,
  scroll_y integer,
  title text,
  subject_label text,
  updated_at timestamptz not null default now()
);
alter table public.user_last_study enable row level security;
create policy "own last study select" on public.user_last_study for select using (auth.uid() = user_id);
create policy "own last study upsert" on public.user_last_study for insert with check (auth.uid() = user_id);
create policy "own last study update" on public.user_last_study for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own last study delete" on public.user_last_study for delete using (auth.uid() = user_id);
