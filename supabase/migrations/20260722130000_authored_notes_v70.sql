-- Notas autorais V70: header + abas (HTML por aba) + flashcards + banco de questões.
-- Aplicado no projeto Supabase em 2026-07-22 via MCP.

create table if not exists public.authored_notes (
  slug text primary key,
  subject_id text not null,
  module_id text,
  topic_id text,
  title text not null,
  subtitle text,
  breadcrumb text,
  duration text,
  level text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.authored_notes enable row level security;
create policy "authored notes read" on public.authored_notes for select to authenticated using (true);
grant select on public.authored_notes to authenticated;
grant select, insert, update, delete on public.authored_notes to service_role;

create table if not exists public.authored_note_tabs (
  note_slug text not null references public.authored_notes(slug) on delete cascade,
  tab_key text not null,
  tab_label text not null,
  content_html text not null,
  ordering integer not null default 0,
  primary key (note_slug, tab_key)
);
create index if not exists authored_note_tabs_slug_idx on public.authored_note_tabs (note_slug, ordering);
alter table public.authored_note_tabs enable row level security;
create policy "authored note tabs read" on public.authored_note_tabs for select to authenticated using (true);
grant select on public.authored_note_tabs to authenticated;
grant select, insert, update, delete on public.authored_note_tabs to service_role;

create table if not exists public.note_flashcards (
  id uuid primary key default gen_random_uuid(),
  note_slug text not null references public.authored_notes(slug) on delete cascade,
  ordering integer not null default 0,
  front text not null,
  back text not null,
  track text,
  created_at timestamptz not null default now()
);
create index if not exists note_flashcards_slug_idx on public.note_flashcards (note_slug, ordering);
alter table public.note_flashcards enable row level security;
create policy "note flashcards read" on public.note_flashcards for select to authenticated using (true);
grant select on public.note_flashcards to authenticated;
grant select, insert, update, delete on public.note_flashcards to service_role;

create table if not exists public.note_questions (
  id uuid primary key default gen_random_uuid(),
  note_slug text not null references public.authored_notes(slug) on delete cascade,
  ordering integer not null default 0,
  stem text not null,
  options jsonb not null,
  answer text not null,
  explanation text,
  bank text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists note_questions_slug_idx on public.note_questions (note_slug, ordering);
alter table public.note_questions enable row level security;
create policy "note questions read" on public.note_questions for select to authenticated using (true);
grant select on public.note_questions to authenticated;
grant select, insert, update, delete on public.note_questions to service_role;
