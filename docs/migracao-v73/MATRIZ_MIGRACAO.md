# MATRIZ_MIGRACAO — HTML V73 → NeuroFix Med (App Router)

> Cruzamento elemento a elemento do HTML V73 com o que já existe no projeto oficial.
> Decisões possíveis: **reutilizar** · **adaptar** · **criar** · **manter temporariamente** · **não migrar**.
> Fontes: `MAPA_HTML.md` + `INVENTARIO_PROJETO.md`.

## Zonas intocáveis (fora do escopo da migração)

- `/` (landing) e `/landing.html`
- `/login`, `/cadastro`
- `/auth/callback`
- Migrations existentes e RLS
- `.env` / chaves

## Regra de arquivamento (durante a migração)

- A página principal atual (`/dashboard` com CadernoBloco/CadernoContext/CadernoTree) será **arquivada em `lancamento-futuro/dashboard-2026-07-21/`** quando o novo `/dashboard` (V73) estiver pronto e aprovado. Não apagar antes.
- Componentes recuperáveis do arquivo `2026-07-09` podem ser **restaurados individualmente** para reuso — sem devolver a árvore inteira.

## Matriz principal

| Elemento do HTML V73 | Equivalente atual | Decisão | Origem dos dados | Arquivos prováveis (após migração) |
|---|---|---|---|---|
| **Sidebar** (menu esquerdo) | `components/Sidebar.tsx` | **adaptar** | estático | `components/Sidebar.tsx` (expandir itens: home, subjects, notebook, review, questions, flashcards, progress, favorites) |
| **Topbar** (breadcrumb + `#globalSearch`) | não existe | **criar** | Supabase (busca cross-entity) | `components/layout/Topbar.tsx`, `components/layout/GlobalSearch.tsx` |
| **Mobile bottom nav** (`#mobileBottomNav`, 5 botões) | não existe | **criar** | estático | `components/layout/MobileBottomNav.tsx` |
| Página `home` (Continue de onde parou + favoritas) | `/dashboard` (atual, será arquivada) | **criar** (nova home) | Supabase (`activity`, `favorites`) + local (`neurofix-last-study-v2`) | `app/(app)/(v73)/home/page.tsx` |
| Página `subjects` (catálogo 15 disciplinas) | `BibliotecaView.tsx` + `data.ts` | **reutilizar/adaptar** | Supabase `materiais` | reaproveita `BibliotecaView`; ajusta filtros por estágio (`data-academic-stage`) |
| Página `library` (currículo módulos+tópicos) | `DisciplinePanel.tsx` + `lib/biblioteca.ts` | **reutilizar/adaptar** | Supabase `materiais` (hierarquia) | reaproveita `DisciplinePanel`; adiciona blocos "confusions" e "map" |
| Página `blueprint` (roteiro editorial) | não existe | **criar** | Supabase (novo modelo `blueprints` ou JSONB em `materiais`) | `app/(app)/(v73)/subjects/[id]/topics/[topicId]/page.tsx` |
| Página `course-test` (teste final integrado) | análogo em `questoes/` arquivado | **adaptar** | Supabase `conteudos_gerados` (tipo `questoes`) | `app/(app)/(v73)/subjects/[id]/course-test/page.tsx` |
| Páginas de nota autoral (`pathology-note`, `etiology-note`, `pathogenesis-note`, `note`) com 9 abas | não existe | **criar** | Conteúdo autoral (hardcoded → migrar para Supabase gradual) + Zod | `app/(app)/(v73)/notes/[noteId]/[tab]/page.tsx`, `components/note/NoteTabs.tsx`, `components/note/NoteContent.tsx` |
| Página `notebook` (Meu Caderno com abas today/inbox/exam/errors) | `CadernoContext` + `CadernoBloco` | **adaptar** | Supabase (novas tabelas `caderno_captures`, `caderno_errors`, `caderno_exam`, `caderno_notes`) | expande `CadernoContext` com 4 workspaces; `app/(app)/(v73)/notebook/page.tsx` |
| Página `review` (revisões programadas) | `review_schedule` + `srs.ts` | **reutilizar** | Supabase `review_schedule` | `app/(app)/(v73)/review/page.tsx` (usa `srs.ts`; **não** cria SRS novo) |
| Página `questions` (banco isolado, modos theory/clinical) | arquivado em `questoes/` + Zod `Questao` | **adaptar** | Supabase `conteudos_gerados` (tipo `questoes`) | `app/(app)/(v73)/questions/page.tsx`, `components/questions/QuestionPractice.tsx` |
| Página `flashcards` (deck isolado) | `FlashcardsView.tsx` + `flashcards.ts` | **reutilizar/adaptar** | Supabase `flashcards` + `flashcard_reviews` | reaproveita `FlashcardsView`; UI 3D flip a partir do HTML |
| Página `progress` (métricas + radar SVG) | não existe | **criar** | Supabase (agregações) | `app/(app)/(v73)/progress/page.tsx`, `components/progress/SubjectRadar.tsx` |
| Página `favorites` | não existe | **criar** | Supabase `favorites` (nova tabela) + local temp | `app/(app)/(v73)/favorites/page.tsx` |
| Página `privacy` (settings + policy + terms) | `/termos-de-uso` + `/politica-de-privacidade` + `ConfiguracoesView` | **reutilizar** | estático + `user_settings` | rotas atuais + integração com V73 |
| Componente **Flashcard 3D flip** (`.flashcard/.flash-inner/.flash-front/.flash-back`) | não existe visual 3D | **criar** | — | `components/flashcard/FlashcardCard.tsx` (transform 3D via Tailwind) |
| Componente **Progress bar** (`.progress > span[width%]`) | não existe padrão | **criar** | — | `components/ui/ProgressBar.tsx` |
| Componente **Pill / badge** (blue/green/red) | não existe padrão | **criar** | — | `components/ui/Pill.tsx` |
| Componente **Tabs genérico** (data-*tab) | não existe padrão | **criar** | — | `components/ui/Tabs.tsx` |
| Componente **Card genérico** (`.card`, `notebook-note`, `favorite-card`, ...) | não existe padrão | **criar** | — | `components/ui/Card.tsx` (+ variantes) |
| Componente **Accordion** (ciclo ativo) | não existe | **criar** | — | `components/ui/Accordion.tsx` |
| Modais (`.card` com toggle de `display`) | vários `*Modal.tsx` em `biblioteca/` | **reutilizar padrão** | — | seguir padrão existente (composer/library) para novos modais |
| Radar de matérias (`#nf56SubjectRadar`, SVG inline) | não existe | **criar** | Supabase (agregações) | `components/progress/SubjectRadar.tsx` (SVG puro, sem Chart.js) |
| Busca global (`#globalSearch`, debounced) | não existe | **criar** | Supabase (fts ou like nas tabelas relevantes) | `components/layout/GlobalSearch.tsx` + `app/(app)/(v73)/api/search/route.ts` |
| Busca de matéria (`#subjectsSearch`) | filtro dentro de `BibliotecaView` | **reutilizar** | client-side | ajustar prop de filtro |
| Busca de currículo (`#curriculumSearch`) | não existe | **criar** | client-side sobre dados de `library` | dentro de `library/page.tsx` |
| **SRS algorítmico** (intervalos 1,3,7,14,30,60) | migration `20260603130000_srs_adaptativo.sql` + `srs.ts` | **reutilizar** | Supabase `review_schedule` | manter — **não** recriar; ajustar mapeamento de tela |
| **Ratings de flashcard** (again/hard/good/easy) | migration + `flashcard_reviews` | **reutilizar** | Supabase | mapear os 4 botões para a lógica existente (again ≈ errei, hard ≈ dificil, good ≈ ok, easy ≈ facil) |
| **Ciclo ativo (6 estágios)** entender→recuperar→aplicar→corrigir→revisar→provar | não existe | **criar** | Supabase (nova tabela `ciclo_ativo_sessoes` OU JSONB em `conteudos_gerados`) | `components/ciclo/CicloAtivo.tsx` |
| Conteúdo hardcoded: `subjectCatalog` (15 disciplinas) | `components/biblioteca/data.ts` (parcial) | **adaptar** (migrar para Supabase) | Supabase `materiais` | seed em migration + import inicial (evitar hardcode em JS) |
| Conteúdo hardcoded: `pathologyCurriculum` (39 aulas, 372 microassuntos) | não existe | **criar** (migrar para dados) | Supabase (novas tabelas de módulo e microassunto) | seed via migration ou script |
| Conteúdo hardcoded: `notebookNoteCatalog` | não existe | **adaptar** | Supabase (`caderno_notes`) | seed inicial |
| `activeCycleConfig` (questões por nota) | não existe | **adaptar** | Supabase (`conteudos_gerados` tipo `questoes` com metadata do ciclo) | seed |
| Storage `neurofix-last-study-v2` | não existe | **manter temporariamente** (localStorage) | local | migrar para Supabase quando houver mobile/multi-device |
| Storage `neurofix-*-tab` (aba ativa por nota) | não existe | **manter temporariamente** | local | idem |
| Storage `activity` (últimas 30 ações) | não existe | **manter temporariamente** | local | avaliar Supabase depois |
| Storage `favorites` | não existe | **adaptar** | Supabase (persistir) | fallback local |
| Storage `reviews` (mock 3 itens) | `review_schedule` (real) | **não migrar** | — | descartar mock — usar dados reais |
| Storage `questions-stats` | não existe | **manter temporariamente** | local | migrar depois |
| Storage `exam`, `errors`, `captures`, `gaps-v40` | não existe | **adaptar** | Supabase (`caderno_*`) | com RLS |
| Landing (home page) | `/` + `/landing.html` | **não migrar** | — | intocáveis |
| Login + cadastro | `/login`, `/cadastro`, `/auth/callback` | **não migrar** | — | intocáveis |
| Onboarding | arquivado em `app-onboarding/` | **não migrar** (por ora) | — | usuário autenticado vai direto para `/dashboard` |
| Rota `/configuracoes` | `ConfiguracoesView.tsx` | **manter** | Supabase `user_settings` | integrar com nova estética V73 quando restante estabilizar |
| Cron `send-reminders`, `manutencao-revisoes` | arquivados em `app-api-cron/` | **manter arquivado** | — | reativar depois quando `/notifications` e Resend voltarem ao escopo |
| Neuro IA page (dedicada) | arquivado em `app-app-features/ia/` | **manter arquivado** | — | integrar como aba dentro das notas autorais (aba `eve`) |
| Admin (hierarquia/flashcards/resumos) | arquivado em `app-admin/` | **manter arquivado** | — | reintroduzir só quando houver mais volume de conteúdo |
| Dashboard atual (Caderno) | `/dashboard` + `caderno/*` | **arquivar** (após novo `/dashboard` pronto) | — | mover para `lancamento-futuro/dashboard-2026-07-21/` |

## Notas sobre reuso

- **Ícones e paleta por matéria**: `lib/flashcards-utils.ts` já tem ícones (neuro→brain, farma→pill, cardio→heart, etc.) e paleta accent — reaproveitar em todos os componentes V73 que mostrem matéria.
- **Modais**: seguir o padrão existente (`FlashComposerModal`, `FlashLibraryModal`, `SummaryComposerModal`, `SummaryLibraryModal`) para novos modais em vez de reinventar.
- **Zod schemas**: `lib/prompts/preceptor-medicina.ts` já define `Resumo`, `Flashcard`, `Questao` — usar como fonte da verdade para tipos em componentes.
- **CadernoContext**: expandir os campos existentes (`selectedTema`, `selectedSubtema`, `painel`) para acomodar os 4 workspaces do notebook V73 (today/inbox/exam/errors) em vez de criar contexto novo.

## O que precisa virar migration (nova)

Para virar dado real (não hardcoded), a migração V73 vai exigir novas tabelas/coluna:

1. `blueprints` (ou JSONB `blueprint` em `materiais`).
2. `caderno_captures`, `caderno_errors`, `caderno_exam`, `caderno_notes` (todos com RLS `user_id = auth.uid()`).
3. `favorites` (user_id + entity_type + entity_id).
4. `activity_log` (opcional — se quiser sair do localStorage).
5. Extensão de `conteudos_gerados`: metadata para o ciclo ativo (estágio, próxima ação).

> Nada disso vira migration nesta Fase 0. Cada tabela é responsabilidade de uma fase específica no `PLANO.md`.
