create type learning_profile as enum ('tdah','tea','dislexia','padrao');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  learning_profile learning_profile not null default 'padrao',
  created_at timestamptz default now()
);

create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_at timestamptz default now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  parent_topic_id uuid references public.topics(id) on delete cascade,
  title text not null,
  content text,
  order_index int default 0
);

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics(id) on delete cascade,
  statement text not null,
  alternatives jsonb not null default '[]'::jsonb,
  correct_answer text not null,
  commented_answer text not null,
  accessibility_notes text
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  due_at timestamptz,
  reminder_at timestamptz,
  reminder_sent_at timestamptz,
  completed boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.subjects enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;

create policy "profiles are private" on public.profiles for select using (auth.uid() = id);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = id);
create policy "tasks are private" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "subjects readable" on public.subjects for select using (true);
create policy "topics readable" on public.topics for select using (true);
create policy "questions readable" on public.questions for select using (true);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into public.subjects (name, description) values
('Anatomia', 'Estruturas do corpo humano organizadas por sistemas.'),
('Fisiologia', 'Funcionamento dos sistemas corporais.'),
('Patologia', 'Mecanismos das doenças e alterações celulares.'),
('Farmacologia', 'Fármacos, mecanismos de ação e efeitos adversos.'),
('Semiologia', 'Anamnese, exame físico e raciocínio clínico inicial.');

insert into public.topics (subject_id, title, content, order_index)
select id, 'Sistema cardiovascular', 'Resumo-base: coração, vasos, circulação, débito cardíaco e pressão arterial.', 1 from public.subjects where name='Fisiologia';
insert into public.topics (subject_id, parent_topic_id, title, content, order_index)
select s.id, t.id, 'Débito cardíaco', 'Débito cardíaco = frequência cardíaca x volume sistólico. Pense como a quantidade de sangue bombeada por minuto.', 1
from public.subjects s join public.topics t on t.subject_id=s.id where s.name='Fisiologia' and t.title='Sistema cardiovascular';
insert into public.questions (topic_id, statement, alternatives, correct_answer, commented_answer, accessibility_notes)
select id, 'Um paciente apresenta FC de 80 bpm e volume sistólico de 70 mL. Qual é o débito cardíaco aproximado?', '["3,5 L/min","5,6 L/min","7,0 L/min","8,0 L/min"]', '5,6 L/min', 'Multiplique 80 x 70 = 5600 mL/min. Como 1000 mL = 1 L, então 5600 mL/min = 5,6 L/min.', 'Para TDAH: primeiro localize FC e VS; depois faça uma multiplicação; por último converta mL para L.' from public.topics where title='Débito cardíaco';
