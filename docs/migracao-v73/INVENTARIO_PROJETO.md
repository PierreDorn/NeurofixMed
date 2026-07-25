# INVENTARIO_PROJETO — NeuroFix Med (estado em 2026-07-21)

> Snapshot do projeto oficial na raiz `/Users/pierredonascimentodoerner/Documents/NeuroFix Med`.
> Fase 0 da migração V73. Somente factual — decisões de reuso ficam em `MATRIZ_MIGRACAO.md`.
> Contexto do WIP: 94 arquivos modificados/renomeados (arquivamento seletivo de 2026-07-09), preservados pelo backup Opção B.

## 1. Tecnologias

| Componente | Versão | Notas |
|---|---|---|
| Next.js | latest (16.x) | App Router, `force-dynamic` em rotas protegidas |
| TypeScript | latest | strict mode |
| React | latest | Client + Server Components |
| Tailwind CSS | 4.x (`@tailwindcss/postcss` 4.2.4) | v4 |
| Supabase SSR | latest | `createServerClient` + `createBrowserClient` |
| TipTap | 3.23.6 | editor rich-text (usado em notas/resumos) |
| Dexie | 4.4.4 + `dexie-react-hooks` 4.4.0 | IndexedDB (offline) |
| OpenAI | 6.44.0 | Neuro IA — modelo `gpt-5-mini` |
| Resend | latest | **instalado, sem uso ativo** (cron arquivado) |
| Zod | 4.4.3 | validação/tipagem |
| lucide-react | latest | ícones |
| DOMPurify | 3.4.5 | sanitização HTML |
| react-router-dom | 7.15.0 | **⚠ instalado e não utilizado** (App Router basta) |

Next config: Turbopack com root fixado.

## 2. Rotas ativas

| Rota | Tipo | Arquivo | Layout |
|---|---|---|---|
| `/` | pública | `app/page.tsx` | root |
| `/login` | pública | `app/(auth)/login/page.tsx` | `(auth)` (usa root) |
| `/cadastro` | pública | `app/(auth)/cadastro/page.tsx` | `(auth)` (usa root) |
| `/auth/callback` | api (GET) | `app/auth/callback/route.ts` | — |
| `/dashboard` | protegida | `app/(app)/dashboard/page.tsx` | `(app)` + CadernoProvider |
| `/configuracoes` | protegida | `app/(app)/configuracoes/page.tsx` | `(app)` |
| `/termos-de-uso` | pública | `app/termos-de-uso/page.tsx` | root |
| `/politica-de-privacidade` | pública | `app/politica-de-privacidade/page.tsx` | root |
| `/landing.html` | pública | `public/landing.html` (estática) | — |

**Zonas intocáveis nesta migração (por decisão do usuário):** `/`, `/landing.html`, `/login`, `/cadastro`, `/auth/callback`.

## 3. Layouts

| Arquivo | Papel |
|---|---|
| `app/layout.tsx` | Raiz: HTML, metadata, manifest, theme-color `#C9A84C`, `lang="pt-BR"`. |
| `app/(auth)/layout.tsx` | Herda root (sem layout dedicado). |
| `app/(app)/layout.tsx` | Protege rotas (verifica auth → redirect `/login`), carrega `student_profiles` + `user_settings`, aplica classes de tema (perfil_cognitivo + tema_preferido), monta `<Sidebar>` + `<CadernoProvider>`. |

## 4. Componentes ativos

| Arquivo | Papel |
|---|---|
| `components/AuthButton.tsx` | Botão de logout. |
| `components/Logo.tsx` | Marca NeuroFix. |
| `components/Sidebar.tsx` | Menu lateral simplificado (Configurações, Ajuda) + toggle de tema. |
| `components/biblioteca/BibliotecaView.tsx` | Grid de disciplinas por ciclo (básico/clínico), search + filtros. |
| `components/biblioteca/DisciplinePanel.tsx` | Painel expansível por disciplina (tópicos, subtópicos, stats). |
| `components/biblioteca/FlashComposerModal.tsx` | Modal criar flashcard. |
| `components/biblioteca/FlashLibraryModal.tsx` | Modal biblioteca de flashcards. |
| `components/biblioteca/FlashcardsView.tsx` | Visualização/revisão de flashcards (SRS). |
| `components/biblioteca/SummaryComposerModal.tsx` | Modal criar resumo. |
| `components/biblioteca/SummaryLibraryModal.tsx` | Modal biblioteca de resumos. |
| `components/biblioteca/ResumosHierarquiaManager.tsx` | Gestor de hierarquia de resumos. |
| `components/configuracoes/ConfiguracoesView.tsx` | Preferências (tema, notificações, horários, intervalos SRS). |

## 5. Autenticação

- Login e cadastro em `app/(auth)/{login,cadastro}/page.tsx` — client-side (`'use client'`).
- **Google OAuth** via Supabase (`signInWithOAuth` → callback `/auth/callback?next=/dashboard`).
- **Email + senha** com validações: nome+sobrenome, email válido, senha ≥ 8, telefone com DDD.
- Callback (`app/auth/callback/route.ts`): `exchangeCodeForSession(code)` → `/dashboard`. Erros: `?error=missing_code|auth`.
- **Onboarding arquivado** em 2026-07-09 → usuário autenticado vai direto para `/dashboard`.
- **RLS** habilitada em todas as tabelas de usuário (`user_id = auth.uid()`).

## 6. Banco / Supabase

**Clientes:**
- `lib/supabase-browser.ts` — `createBrowserClient` (anon key), para Client Components.
- `lib/supabase-server.ts` — `createServerClient` (cookies), para RSC e Route Handlers. Também exporta `createAdminClient()`.
- `lib/supabase-admin.ts` — `getSupabaseAdmin()` singleton (service role) — bypass RLS, uso privilegiado.

**Migrations em `supabase/migrations/`:**

1. `20260603120000_agenda_revisao_sistema.sql` — tabelas `user_settings`, `events`, `event_recurrence`, `event_reminders`, `review_schedule`, `notification_log`; função `set_updated_at()`, `criar_revisoes_automaticas()`; SRS Ebbinghaus 4 ciclos.
2. `20260603130000_srs_adaptativo.sql` — funções `aplicar_desempenho_revisao()`, `marcar_revisoes_atrasadas()`, `ja_tem_revisoes()`. Feedback-driven (errei → +50% int1; difícil → padrão; fácil → 1.5×; 3× fácil → arquiva).
3. `20260604120000_fix_revisoes_horario_titulo.sql` — fix de horário/título.
4. `20260624120000_perfis_estudantes_conteudos_gerados.sql` — `perfis_estudantes` (1:1 user, `openai_thread_id`), `conteudos_gerados` (N:1 user, JSONB flashcards/questões/resumo). Tipos: `['resumo','flashcards','questoes']`.
5. `20260624130000_neuro_ia_cache_e_rate_limit.sql` — cache e rate limiting da IA.

**Tabelas identificadas (ativas nas queries):**

- `auth.users` (built-in), `student_profiles`, `user_settings`
- `events`, `event_recurrence`, `event_reminders`, `review_schedule`, `notification_log`
- `perfis_estudantes`, `conteudos_gerados`
- `materiais` (hierarquia de disciplinas: ciclo, ativo, ordem)
- `flashcards`, `flashcard_reviews`

## 7. Serviços em `lib/`

| Arquivo | Papel |
|---|---|
| `supabase-browser.ts` | Factory anon (browser). |
| `supabase-server.ts` | Factory server + `createAdminClient`. |
| `supabase-admin.ts` | Singleton admin. |
| `neuro-ia.ts` | Wrapper OpenAI (gpt-5-mini, 200 req/dia, timeout 60s), erro `ErroNeuroIA`. |
| `flashcards.ts` | `getFlashHubDataForUser()` — agrega flashcards+reviews por matéria. |
| `flashcards-utils.ts` | Tipos, normalização, ícones e paleta por matéria. |
| `biblioteca.ts` | Tipos (`MaterialRow`, `TopicRow`, ...), `getMateriais()`. |
| `srs.ts` | Lógica SRS. |
| `recurrence.ts` | Recorrência de eventos. |
| `db/cliente-local.ts` | Setup Dexie (IndexedDB offline). |
| `hooks/useNotifications.ts` | Hook de notificações. |
| `prompts/preceptor-medicina.ts` | System prompt Neuro IA + schemas Zod (Resumo, Flashcard, Questao). |

## 8. Integrações externas

| Serviço | Status | Onde |
|---|---|---|
| Supabase Auth (Google + email/senha) | Ativo | `app/(auth)/*`, `app/auth/callback/*` |
| Supabase DB + RLS | Ativo | migrations + queries |
| OpenAI (Assistants) | Ativo (via `neuro-ia.ts`) | usado pela Neuro IA — page dedicada está arquivada |
| Vercel deploy | Ativo (manual) | `vercel.json` + Turbopack |
| Vercel Cron | **Arquivado** | `lancamento-futuro/paginas-arquivadas-2026-07-09/app-api-cron/*` |
| Resend | Instalado sem uso ativo | seria usado nos crons arquivados |

## 9. Estruturas reutilizáveis (foco V73)

### Ativas
- **Biblioteca**: `BibliotecaView`, `DisciplinePanel`, `types.ts`, `data.ts`, `lib/biblioteca.ts`. Modelo hierárquico Discipline → Topic → Subtopic → SubSubtopic.
- **Flashcards**: `FlashcardsView`, `FlashComposerModal`, `FlashLibraryModal`, `lib/flashcards.ts`, `lib/flashcards-utils.ts` (ícones, palette).
- **Resumos**: `SummaryComposerModal`, `SummaryLibraryModal`, `ResumosHierarquiaManager`.
- **Questões**: arquitetura análoga a flashcards, schemas Zod prontos em `prompts/preceptor-medicina.ts`.
- **Caderno (Dashboard)**: `app/(app)/dashboard/page.tsx` + `caderno/CadernoBloco.tsx` + `CadernoContext.tsx` (state: `selectedTema`, `selectedSubtema`, `painel: aula|resumo|pegadinhas|questoes|flashcards|plano|modelo`) + `CadernoTree.tsx`.

### Arquivadas em `lancamento-futuro/paginas-arquivadas-2026-07-09/` (recuperáveis)
- Rotas de página inteira: `questoes/`, `flashcards/` (com hierarquia e criar), `resumos/`, `biblioteca/` (versão full-featured), `ia/` (Neuro IA dedicada), `agenda/`, `perfil/`, `desempenho/`, `tarefas/`, `configuracoes-backup/`.
- Componentes: `components-features/{flashcards,ia,dashboard,agenda}/`, `components-notifications/`, `components-admin/`.
- Crons: `app-api-cron/send-reminders/`, `app-api-cron/manutencao-revisoes/`.
- Admin: `app-admin/{hierarquia,flashcards,resumos}/`.
- Onboarding: `app-onboarding/`.

## 10. Panorama do arquivado

Arquivamento em 2026-07-09 reduziu drasticamente a superfície ativa. O que sobrou:
- Landing pública (`/`, `/landing.html`)
- Autenticação (`/login`, `/cadastro`, `/auth/callback`) — **intocável**
- Área logada mínima: Dashboard (Caderno) + Configurações
- Sidebar com só Configurações e Ajuda

Sinal claro: a V73 é a próxima expansão dessa base mínima. O trabalho é **repopular** com telas em nível superior ao arquivado, aproveitando os componentes recuperáveis.

## 11. Testes

Nenhum teste automatizado no projeto. Sem Jest, Vitest ou Playwright configurados.

## 12. Sinais operacionais

- 94 arquivos modificados no working tree (M + R). Preservados pelo backup Opção B (branch `backup/lancamento-futuro` + tag `backup/lancamento-futuro-wip-2026-07-21`).
- Deploy Vercel é **manual**.
- Chaves e `.env` intocáveis.
- 3 clientes Supabase — nunca instanciar novo cliente fora de `lib/`.
