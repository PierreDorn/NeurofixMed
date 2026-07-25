-- Ciclo ativo de estudo por usuário/nota: 6 estágios (entender → recuperar →
-- aplicar → corrigir → revisar → provar). 1 linha por (usuário, nota).
-- Aplicado no projeto Supabase em 2026-07-23 via MCP.

create table if not exists public.user_note_cycles (
  user_id uuid not null references auth.users(id) on delete cascade,
  note_slug text not null references public.authored_notes(slug) on delete cascade,
  stage text not null default 'understand'
    check (stage in ('understand','retrieve','apply','correct','review','prove','mastered')),
  stages_completed jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, note_slug)
);
create index if not exists user_note_cycles_updated_idx on public.user_note_cycles (user_id, updated_at desc);

alter table public.user_note_cycles enable row level security;
create policy "own cycle select" on public.user_note_cycles
  for select using (auth.uid() = user_id);
create policy "own cycle insert" on public.user_note_cycles
  for insert with check (auth.uid() = user_id);
create policy "own cycle update" on public.user_note_cycles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own cycle delete" on public.user_note_cycles
  for delete using (auth.uid() = user_id);
grant select, insert, update, delete on public.user_note_cycles to authenticated;
grant select, insert, update, delete on public.user_note_cycles to service_role;
