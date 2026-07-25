-- Tentativas dos usuários nas questões autorais V70.
-- Aplicado no projeto Supabase em 2026-07-22 via MCP.

create table if not exists public.note_question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id uuid not null references public.note_questions(id) on delete cascade,
  chosen text not null,
  is_correct boolean not null,
  mode text,
  created_at timestamptz not null default now()
);
create index if not exists note_question_attempts_user_created_idx
  on public.note_question_attempts (user_id, created_at desc);
create index if not exists note_question_attempts_user_question_idx
  on public.note_question_attempts (user_id, question_id);

alter table public.note_question_attempts enable row level security;
create policy "own attempts select" on public.note_question_attempts
  for select using (auth.uid() = user_id);
create policy "own attempts insert" on public.note_question_attempts
  for insert with check (auth.uid() = user_id);
create policy "own attempts delete" on public.note_question_attempts
  for delete using (auth.uid() = user_id);
grant select, insert, delete on public.note_question_attempts to authenticated;
grant select, insert, update, delete on public.note_question_attempts to service_role;
