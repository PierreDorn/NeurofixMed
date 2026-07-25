-- V70 currículo: módulos + tópicos (microassuntos) por matéria.
-- Aplicado no projeto Supabase em 2026-07-22 via MCP.

create table if not exists public.curriculum_modules (
  id text primary key,
  subject_id text not null,
  block_key text,
  block text,
  number text,
  title text not null,
  description text,
  map text,
  confusions jsonb not null default '[]'::jsonb,
  test_count integer,
  ordering integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists curriculum_modules_subject_idx on public.curriculum_modules (subject_id, ordering);
alter table public.curriculum_modules enable row level security;
create policy "curriculum modules read" on public.curriculum_modules for select to authenticated using (true);
grant select on public.curriculum_modules to authenticated;
grant select, insert, update, delete on public.curriculum_modules to service_role;

create table if not exists public.curriculum_topics (
  id text primary key,
  module_id text not null references public.curriculum_modules(id) on delete cascade,
  title text not null,
  subtitle text,
  question_count integer,
  flashcard_count integer,
  level text,
  status text,
  ordering integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists curriculum_topics_module_idx on public.curriculum_topics (module_id, ordering);
alter table public.curriculum_topics enable row level security;
create policy "curriculum topics read" on public.curriculum_topics for select to authenticated using (true);
grant select on public.curriculum_topics to authenticated;
grant select, insert, update, delete on public.curriculum_topics to service_role;
