-- Reviews dos flashcards autorais V70 (deck jogável com SRS por usuário).
-- Aplicado no projeto Supabase em 2026-07-22 via MCP.

create table if not exists public.note_flashcard_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  flashcard_id uuid not null references public.note_flashcards(id) on delete cascade,
  rating text not null check (rating in ('again','hard','good','easy')),
  streak integer not null default 0,
  interval_days integer not null default 1,
  next_review_at date not null,
  created_at timestamptz not null default now()
);
create index if not exists note_flashcard_reviews_user_next_idx
  on public.note_flashcard_reviews (user_id, next_review_at);
create index if not exists note_flashcard_reviews_user_card_created_idx
  on public.note_flashcard_reviews (user_id, flashcard_id, created_at desc);

alter table public.note_flashcard_reviews enable row level security;
create policy "own reviews select" on public.note_flashcard_reviews
  for select using (auth.uid() = user_id);
create policy "own reviews insert" on public.note_flashcard_reviews
  for insert with check (auth.uid() = user_id);
create policy "own reviews delete" on public.note_flashcard_reviews
  for delete using (auth.uid() = user_id);
grant select, insert, delete on public.note_flashcard_reviews to authenticated;
grant select, insert, update, delete on public.note_flashcard_reviews to service_role;
