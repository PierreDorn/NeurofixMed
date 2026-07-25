# STATUS — Migração NeuroFix V70

> Único doc "vivo" da pasta `docs/migracao-v73/`. Toda sessão futura começa lendo este arquivo.
> Última atualização: **2026-07-22**.

## Fase atual

**Fases 10-12 — Ciclo Ativo, Dashboard real, Progresso, Favoritos ampliados — CONCLUÍDAS (2026-07-23).**
Fase 9c — Prática de questões — CONCLUÍDA.
Fase 9b — Flashcards jogáveis com SRS — CONCLUÍDA.
Fase 9a — Notas autorais — CONCLUÍDA.
Fase 8 — Currículo real por matéria — CONCLUÍDA.
Fase 7 — Migração para o design nf70 — CONCLUÍDA.
Fase 6 — Persistência multi-usuário Supabase — CONCLUÍDA.
Fases 2-5 — Rotas React (2 e 3 refeitas na Fase 7 com V70).
Fase 1 — Fundação de UI — CONCLUÍDA.
Fase 0 — Auditoria — histórico (feita contra V73).

Trabalho da Fase 8:
- Migration `20260722120000_curriculum_v70.sql`: tabelas `curriculum_modules` e `curriculum_topics` com RLS leitura para `authenticated` + grants pro `service_role` (necessário para o seed).
- Extração dos currículos JSON do V70 via `scripts/v70-import/build-seed.mjs`. Regras do V70 aplicadas: `immunology = infectology.filter(id==imunologia-infecciosa)`, `microbiology = infectology.filter(id in [bacterias,fungos])`.
- Seed aplicado via `scripts/v70-import/apply-seed.mjs` usando `@supabase/supabase-js` + service role: **48 módulos, 443 tópicos** no banco.
- `lib/curriculum.ts` — helpers server-side `getSubjectCurriculum(subjectId)` (junta módulos + tópicos por FK) e `getTopicWithModule(topicId)` (lookup individual).
- `/subjects/[id]` reescrito: tree lateral com todos os módulos numerados + panel central com descrição, sequência lógica (`map`), confusões e lista de microassuntos. Cada tópico linka para `/subjects/[id]/topics/[topicId]`. Busca live filtra dentro do módulo ativo.
- `/subjects/[id]/topics/[topicId]` novo (blueprint): mostra crumb + título + subtítulo do tópico, contadores (Q/F), study-path de 7 passos, callout de confusões e placeholder das 9 abas de nota autoral (a serem populadas na Fase 9). **Toda visita faz upsert em `user_last_study`** — o "Continue de onde parou" no `/dashboard` passa a mostrar o último tópico visitado.
- Verificação: `npx tsc --noEmit` passa, todas 8 rotas HTTP 200 (incluindo blueprint de tópico com id composto).

**HTML de referência canonical (2026-07-22):** `NeuroFix_Med_v70_LIMPO_FINAL.html` (copiado em `public/v73/index-v70.html`).

Trabalho da Fase 7:
- CSS único do V70 (`<style id="neurofix-v70-css">`, linhas 26-1876 do HTML) extraído e reescopado com prefixo `.v73-app`: `app/(app)/dashboard/v73/v73-scoped.css` agora tem 9658 linhas / 2522 seletores escopados. Overrides do layout pai + resets de heranças mantidos no fim.
- `/dashboard` reescrito em `DashboardV70.tsx` com markup fiel: `nf70-home`, `nf70-home-hero`, `nf70-continue`, `nf70-semester-head`, `subject-directory-grid`, `subject-card` com `--subject-accent`/`--subject-soft` inline. "Continue de onde parou" lê `user_last_study` (fallback pra "Escolher matéria" se nunca estudou). "Matérias favoritas do semestre" mostra até 6 cards — usa favoritos se existirem, senão as 4 matérias `live`.
- `/subjects` reescrito com o mesmo `subject-card` V70 + estrela ★/☆ integrada no card-top.
- Componente antigo `DashboardV73.tsx` removido.
- Verificação: `npx tsc --noEmit` passa, todas 7 rotas HTTP 200.

Trabalho da Fase 9a (notas autorais):
- Migration `20260722130000_authored_notes_v70.sql`: 4 tabelas com RLS leitura authenticated + grants: `authored_notes` (header), `authored_note_tabs` (HTML por aba), `note_flashcards` (front/back/track), `note_questions` (stem, options JSON, answer, explanation, bank, meta).
- Extração via `scripts/v70-import/extract-notes.mjs` usando VM sandbox + Proxy para stubbar todas as referências externas do V70 (funções de render, arrays clínicos). Resultado: 4 notas, 31 abas, 160 flashcards, 188 questões.
- Seed via `scripts/v70-import/apply-notes.mjs` — DB agora tem `notes=4 tabs=31 flashcards=160 questions=188`.
- `lib/notes.ts`: `getNoteWithTabs(slug)` e `findNoteByTopic(topicId)`.
- Rota `/notes/[slug]/[tab]` renderiza header + tabs + HTML da aba corrente. `dangerouslySetInnerHTML` porque o HTML autoral já vem escapado corretamente do V70 (classes `.callout`, `.learning-grid`, `.editorial-route`, etc. estão no CSS escopado da Fase 7). Cada visita atualiza `user_last_study` com `subject_id`, `note_id`, `tab`.
- `/subjects/[id]/topics/[topicId]` agora **redireciona pra nota autoral** quando existir (`findNoteByTopic`). Só cai no placeholder quando o tópico ainda não tem nota — hoje 4 dos 443 tópicos têm nota (etiologia, patogenese, necrose-apoptose e um placeholder p/ ascaris via slug).

Notas populadas com abas:
- `etiologia-fatores-de-risco` — start, explain, learning, clinical, confusions, eve, mastery (7 abas)
- `patogenese` — mesmas 7 abas
- `necrose-apoptose` — start, explain, pathogenesis, morphology, clinic, traps, questions, flashcards, eve, mastery (10 abas)
- `ascaris-lumbricoides` — explain, exam, traps, falls, question, flash, eve (7 abas)

Verificação: `npx tsc --noEmit` passa; 5 rotas smoke-testadas retornam 200.

Trabalho da Fase 9b (flashcards jogáveis):
- Migration `20260722140000_note_flashcard_reviews_v70.sql`: tabela `note_flashcard_reviews` com RLS `user_id = auth.uid()`, FK pra `note_flashcards`, guarda cada rating (again/hard/good/easy), `streak`, `interval_days` e `next_review_at`.
- Server Action `rateFlashcard(flashcardId, rating, noteSlug)` em `app/(app)/notes/[slug]/actions.ts`. Algoritmo SRS simples: `again` → reset (1d), `hard` → ×1.2 min 2d, `good` → ×2.2 max 60d, `easy` → ×2.8 max 90d.
- `lib/note-flashcards.ts` — `getNoteDeckAndReviews(slug)` retorna cards + última review por card do usuário.
- Componente `components/v73/NoteFlashcardDeck.tsx` — card visual com pill de "Frente/Verso", track badge, flip por clique ou Espaço, botões coloridos de rating (bloqueados até virar), navegação anterior/próximo, contador de vistos e pendentes, feedback da última avaliação.
- Rota `/notes/[slug]/[tab]` agora detecta `flashcards|flash` e injeta o deck em vez do HTML da aba. Reviews persistem em `note_flashcard_reviews` e alimentam o cálculo do próximo intervalo.
- Abas `flashcards` inseridas nos slugs que não tinham (etiologia, patogênese) — no V70 essas abas eram geradas por função, sem HTML; agora usam o deck real.

Verificação: `npx tsc --noEmit` passa; 5 rotas de flashcards retornam 200.

Trabalho da Fase 9c (prática de questões):
- Migration `20260722150000_note_question_attempts_v70.sql`: tabela `note_question_attempts` com RLS `user_id = auth.uid()` + índices por usuário e por questão. Guarda `chosen`, `is_correct`, `mode`.
- Server Action `checkQuestion(questionId, chosen, noteSlug, mode?)` em `app/(app)/notes/[slug]/actions.ts`. Busca gabarito e explicação do banco, compara, registra tentativa e devolve `{ isCorrect, correctAnswer, explanation, options }`.
- `lib/note-questions.ts` — `getNoteQuestionsAndAttempts(slug)` retorna as questões da nota + última tentativa do usuário por questão.
- Componente `components/v73/NoteQuestionPractice.tsx` — enunciado, 5 alternativas (A–E) clicáveis, badge de "Já acertou/errou" quando existe tentativa anterior, botão "Confirmar resposta", feedback verde/vermelho após submit com alternativa correta destacada e comentário editorial (quando presente). Stats no topo: X respondidas · N acertos · % acerto.
- Rota `/notes/[slug]/[tab]` já detecta `questions|question` e injeta a prática em vez de HTML.
- Abas `questions` inseridas em etiologia e patogênese (V70 gerava por função).

Verificação: `npx tsc --noEmit` passa; 4 rotas de questões retornam 200.

**Total funcional hoje:** 4 notas jogáveis com 160 flashcards (SRS por usuário) + 188 questões (tentativas por usuário com feedback).

Trabalho da Fase 10 (Ciclo Ativo):
- Migration `20260723120000_user_note_cycles_v70.sql`: tabela `user_note_cycles` (PK `user_id + note_slug`) com RLS. Guarda `stage` (understand/retrieve/apply/correct/review/prove/mastered) + `stages_completed` (jsonb).
- `lib/note-cycle-shared.ts` (constantes CYCLE_STAGES, types, seguro para client) + `lib/note-cycle.ts` (getUserNoteCycle, `server-only`).
- Server Actions `advanceCycleStage` e `resetCycleStage` em `actions.ts`.
- Componente `NoteCycle.tsx` — barra visual dos 6 estágios com estágio ativo destacado, sugestão de aba, botão "Concluir e avançar" que redireciona para a próxima aba sugerida (explain→learning→questions→confusions→flashcards→eve).
- Aparece no topo de **toda aba de nota**.

Trabalho da Fase 11 (Dashboard real):
- `lib/dashboard-data.ts` — `getDueFlashcardsByNote(userId)` (flashcards com `next_review_at <= hoje` agrupados por nota) e `getActiveCycles(userId)` (notas com ciclo iniciado, ordenadas por `updated_at`).
- `/dashboard` reescrito para mostrar seções condicionais:
  - **Continue de onde parou** agora navega direto pra `/notes/[note_id]/[tab]` real.
  - **Ciclos ativos** — cards com estágio + % de progresso, click abre a nota.
  - **Revisões para hoje** — lista de notas com N flashcards pendentes; botão "Revisar →" leva à aba de flashcards.
  - **Matérias favoritas do semestre** — mantida da Fase 7 (fallback nas notas `live`).

Trabalho da Fase 12 (Progresso + Favoritos ampliados):
- `lib/progress-data.ts` — agrega `note_question_attempts`, `note_flashcard_reviews`, `user_note_cycles` do usuário. Faz join server-side para calcular acerto por matéria.
- `/progress` — 4 métricas grandes (Questões, Taxa de acerto, Flashcards, Ciclos), gráfico de distribuição de ratings (again/hard/good/easy com cores V70), desempenho por matéria com barras coloridas pelo `subject.accent`. Empty state amigável quando ainda não há dado.
- `/favorites` — expandida para mostrar tanto matérias quanto notas autorais favoritas em duas seções separadas.
- `NoteView` — botão **☆ Salvar / ★ Salva** no header da nota que chama `toggleFavorite('note', slug)`, com estado real vindo do server.

Verificação: `npx tsc --noEmit` passa; 12 rotas smoke-testadas retornam 200. Após criar o ciclo/favoritos numa conta real, a UI reflete imediatamente por `revalidatePath`.

**Sistema completo funcional agora:** dashboard com estado real, ciclo ativo funcional, progresso vivo, favoritos multi-entidade.

**Ainda faltando (fora do escopo dessas fases):**
- Ampliação do conteúdo dos 439 microassuntos restantes (não existem no V70 original).
- Enriquecimento das 188 questões com `explanation` (via IA ou manual).
- Deploy Vercel — só com autorização explícita.

## Revalidação das Fases 1-6 contra o V70 (2026-07-22)

As fases 1-6 foram construídas contra o V73 antigo. Após leitura do V70, o estado real é:

| Fase | Status vs V70 | Ação |
|---|---|---|
| **0** Auditoria + 5 docs | Desatualizada. `INVENTARIO_PROJETO.md`, `MAPA_HTML.md`, `MATRIZ_MIGRACAO.md` refletem V73. As 358 funções JS e classes `nf70-*` não estão mapeadas. | Docs viram histórico; `PLANO.md` novo é fonte da verdade. |
| **1** Primitives UI | Válida — genéricos. | Sem mudança. |
| **2** `/dashboard` home | Quebrada visualmente. V70 usa `nf70-home-hero`, `nf70-continue`, `nf70-semester-head`, `subject-directory-grid`. | Refeita na Fase 7. |
| **3** `/subjects` catálogo | Cards antigos. V70 usa `subject-card` com `--subject-accent`/`--subject-soft` inline + `subject-status` + `subject-card-footer`. | Refeita na Fase 7. |
| **4** `/subjects/[id]` placeholder | Neutra. | Populada na Fase 8. |
| **5** `/notebook`, `/review`, `/progress`, `/favorites` placeholders | `/review` desatualizada (V70 tem `nf70-review-hero`, `nf70-review-columns`, fluxo Recall→Question→Rating). Demais genéricas. | `/review` refeita na Fase 11; demais evoluem nas Fases 11-12. |
| **6** Supabase + wiring notebook/favoritos | Migrations válidas (`caderno_captures/errors/exam`, `favorites`, `user_last_study` reaproveitadas 100%). UI do notebook precisa expandir com `captureToError/Exam/Page`, `saveErrorInline`, `editErrorRule`, `editExamItem`. | Tabelas mantidas. UI evolui nas Fases 8-10. |
| CSS extraído (`v73-scoped.css`, 9577 linhas do V73) | Obsoleto. | Substituído pelo bloco único `neurofix-v70-css` na Fase 7. |

## Trabalho concluído nas Fases 2-5

**Iframe descartado.** Cada tela do V73 é agora rota React usando um Shell compartilhado com CSS escopado.

**Shell compartilhado:**
- `components/v73/Shell.tsx` — sidebar + topbar + mobile bottom nav, `usePathname` para active state, `router.push` para navegação. Importa o CSS uma vez, aplica `body.v73-dashboard` no mount.
- `app/(app)/dashboard/v73/v73-scoped.css` — 9577 linhas. Extraído do HTML original e prefixado com `.v73-app` via awk (2518 regras). Contém no fim resets de heranças do `globals.css` (h1-h6, `a`, `p`) e overrides do layout pai (esconde Sidebar antiga, zera padding do `.main-content`).

**Rotas criadas (todas com auth server-side + Shell + conteúdo fiel ao HTML):**
- `/dashboard` — `page-home` completo (hero, continue, 6 subject cards, revisões hoje, promise 4 passos).
- `/subjects` — catálogo com abas de estágio (Ciclo Básico/Clínico/Internato/Enamed/Residência) e busca. 15 disciplinas de `lib/subjects-catalog.ts` (extraído do `subjectCatalog` do HTML, linhas 2046-2062).
- `/subjects/[id]` — página da disciplina com placeholder "currículo em preparação" (Fase 6 popula com módulos + microassuntos reais).
- `/notebook` — 4 workspaces (Hoje / Inbox / Folha de prova / Erros) com placeholder de "banco de dados por conectar".
- `/review` — placeholder da fila SRS.
- `/progress` — placeholder de métricas.
- `/favorites` — placeholder de estrelados.

**Verificação:** `npx tsc --noEmit` passa. Todas 7 rotas respondem HTTP 200 (autenticado).

**O que ainda não é "produção multi-usuário":**
- Página `/dashboard` mostra dados hardcoded (Continue de onde parou, revisões hoje).
- `/review` e `/progress` são placeholders visuais — sem persistência.
- Fase 7 (próxima): currículo real por matéria + "Continue de onde parou" real (upsert em `user_last_study`).
- Deploy Vercel só com autorização explícita.

## Trabalho concluído na Fase 6

Migration aplicada no Supabase (projeto `skkkflsymttfwsplfpab`):
- Tabelas novas com RLS `user_id = auth.uid()`: `caderno_captures`, `caderno_errors`, `caderno_exam`, `favorites` (PK composta `user_id + entity_type + entity_id`), `user_last_study` (PK `user_id`).
- SQL salvo em `supabase/migrations/20260721120000_caderno_favorites_last_study_v73.sql`.

Server Actions criadas:
- `app/(app)/notebook/actions.ts` — `addCapture`, `toggleCaptureResolved`, `deleteCapture`, `addError`, `toggleErrorResolved`, `deleteError`, `addExamItem`, `deleteExamItem`. Todas exigem sessão autenticada e revalidam `/notebook`.
- `app/(app)/favorites/actions.ts` — `toggleFavorite(entity_type, entity_id)` (upsert/delete idempotente).

UI wirada:
- `/notebook` — SSR carrega captures + errors + exam do Supabase; view tem 4 workspaces (Hoje / Inbox / Erros / Folha de prova) com forms controlados por `useTransition`, marcadores de resolvido e delete.
- `/favorites` — SSR carrega favoritos do usuário e cruza com `SUBJECT_CATALOG` para renderizar cards.
- `/subjects` — cada card ganhou botão ★/☆ que chama `toggleFavorite` e revalida.

Verificação: `npx tsc --noEmit` passa; todas 7 rotas HTTP 200 após deploy local.

Refs preservadas: branch `backup/lancamento-futuro` + tag `backup/lancamento-futuro-wip-2026-07-21`.

## Trabalho concluído na Fase 1

- `lib/flags.ts` — flag `V73_ENABLED` (env `NEXT_PUBLIC_V73_ENABLED=1`).
- `components/ui/Modal.tsx` — portal, focus trap, Esc, retorno de foco, scroll lock inline. Reusa `.summary-modal-*` do globals.
- `components/ui/Tabs.tsx` — controlado, ARIA `role="tablist"`, navegação por teclado (← →), reusa `.pill.active`.
- `components/ui/Accordion.tsx` — modo `single|multiple`, controlado ou não, ARIA correto, reusa `.accordion-item / .accordion-body`.
- `components/ui/ProgressBar.tsx` — wrapper fino com `aria-valuenow`, reusa `.progress-bar / .progress-fill`.
- `components/layout/Topbar.tsx` — classe `v73-topbar` (evita colisão com `.topbar` existente).
- `components/layout/MobileBottomNav.tsx` — fixed bottom, aparece só ≤768px, ícones lucide.
- `app/(app)/(v73)/layout.tsx` — grupo de rota isolado, herda auth de `app/(app)/layout.tsx`.
- `app/(app)/(v73)/preview/page.tsx` — showcase de tokens, primitives, botões e cores por matéria; toggle de tema local.
- `components/Sidebar.tsx` — bloco `v73Items` condicional atrás de `V73_ENABLED`. Sem a flag, Sidebar continua idêntica ao atual.

Decisão pragmática durante execução: os modais existentes (`SummaryComposerModal` etc.) já setam `body.summary-modal-open` mas o globals.css **não tem CSS para essa classe** (scroll lock ausente). O novo `Modal.tsx` aplica scroll lock inline via `document.body.style.overflow` — mais confiável.

Verificação: `npx tsc --noEmit` passou sem erro.

Refs git antes da Fase 1 (preservadas):
- Branch: `backup/lancamento-futuro` (commit `5f71144`)
- Tag: `backup/lancamento-futuro-wip-2026-07-21` (stash-object `feab73a`, WIP 94 arquivos)

## Trabalho concluído nesta Fase 0

- Ponto de restauração local criado (Opção B):
  - Branch: `backup/lancamento-futuro` → aponta para o commit `5f71144` (HEAD atual).
  - Tag: `backup/lancamento-futuro-wip-2026-07-21` → aponta para o stash-object `feab73a` que preserva o WIP (94 arquivos M/R).
  - Working tree **não foi modificado**; nenhum commit "silencioso" foi feito.
- Inventário completo do projeto oficial → `INVENTARIO_PROJETO.md`.
- Mapa estrutural do HTML V73 (2.3 MB, monolítico) → `MAPA_HTML.md`.
- Matriz de decisão HTML V73 × projeto atual → `MATRIZ_MIGRACAO.md`.
- Plano em 11 fases + 4 opcionais → `PLANO.md`.
- Este `STATUS.md`.

## Decisões tomadas

- **HTML lido direto de `/Users/pierredonascimentodoerner/Downloads/NeuroFix_Med_v73 2.html`**, sem copiar para o repositório.
- **Ponto de restauração via Opção B** (branch + tag para o stash do WIP). Não usar branch simples: perderíamos o WIP.
- **Arquivamento do Caderno atual** (`app/(app)/dashboard/*`) só na Fase 11, para `lancamento-futuro/dashboard-2026-07-21/`. Componentes de biblioteca/flashcards/questões/resumos serão **reaproveitados**, não recriados.
- **Zonas intocáveis** durante toda a migração: `/`, `/landing.html`, `/login`, `/cadastro`, `/auth/callback`.
- **SRS existente permanece** (migration `20260603130000_srs_adaptativo.sql` + `srs.ts`). Não recriar.
- **Novo trabalho isolado em `app/(app)/(v73)/*`** com flag `V73_ENABLED` até a Fase 11 (corte final).
- **Plugins Vercel e Figma** instalados — nenhum é necessário na Fase 0. Vercel pode ser útil nas Fases 5+ (preview/logs) quando começar a testar em ambiente do usuário.

## Arquivos criados nesta execução

- `docs/migracao-v73/INVENTARIO_PROJETO.md`
- `docs/migracao-v73/MAPA_HTML.md`
- `docs/migracao-v73/MATRIZ_MIGRACAO.md`
- `docs/migracao-v73/PLANO.md`
- `docs/migracao-v73/STATUS.md`

Refs git criadas:
- Branch: `backup/lancamento-futuro`
- Tag: `backup/lancamento-futuro-wip-2026-07-21`

**Nenhum arquivo de código-fonte foi criado, alterado ou movido nesta Fase 0.**

## Pendências (para as próximas fases)

- Decidir seed inicial de conteúdo (currículo de Patologia, notas autorais, questões, flashcards) — hardcoded no HTML.
- Definir tabelas novas: `caderno_captures`, `caderno_errors`, `caderno_exam`, `caderno_notes`, `favorites`, possivelmente `activity_log`, `blueprints`.
- Confirmar se `student_profiles` cobre o filtro por `data-academic-stage` (basic/clinical/enamed/internship/residency) ou se precisa de coluna nova em `user_settings`.
- Decidir mapeamento exato dos 4 ratings V73 (again/hard/good/easy) para o SRS existente (errei/dificil/facil).
- Remover `react-router-dom` do `package.json` (instalado sem uso) — só quando houver janela para rodar `npm ci` e verificar.

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| Perder o WIP das 94 alterações | Alto | Mitigado por tag `backup/lancamento-futuro-wip-2026-07-21`. Verificar `git tag --list "backup/*"` antes de qualquer `git reset` ou `stash drop`. |
| Colisão entre `/dashboard` atual e `/dashboard` V73 | Médio | Novo trabalho em `app/(app)/(v73)/*` até Fase 11. |
| Mudanças em `CadernoContext` quebrando dashboard atual | Médio | Novos campos entram como opcionais, default preservando comportamento. |
| Volume de conteúdo autoral hardcoded no HTML | Médio | Cada fase que depende de conteúdo real define seed mínimo no critério de conclusão. |
| Reintrodução acidental do CSS puro do HTML (2.3 MB) | Baixo | Regra explícita: usar Tailwind v4; não copiar CSS puro. |
| Tocar acidentalmente em login/landing | Alto | Regra em `PLANO.md` §"Regras globais"; conferir diff antes de commit. |

## Como retomar a Fase 1

1. Ler este `STATUS.md`.
2. Ler `PLANO.md` §Fase 1.
3. Criar branch `v73/fase-1-fundacao-ui`.
4. Executar Fase 1. Ao concluir, marcar aqui e apontar Fase 2.

## Como restaurar o backup (se precisar reverter)

```bash
# ver refs criadas
git branch --list "backup/*"
git tag --list "backup/*"

# restaurar o WIP (arquivos M/R do dia 2026-07-21) — cria stash a partir da tag
git stash apply backup/lancamento-futuro-wip-2026-07-21

# voltar HEAD ao commit preservado
git checkout backup/lancamento-futuro
```
