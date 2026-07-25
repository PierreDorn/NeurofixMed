# PLANO — Migração NeuroFix V70 (canonical)

> **HTML de referência atualizado (2026-07-22):**
> `/Users/pierredonascimentodoerner/Downloads/NeuroFix_Med_v70_LIMPO_FINAL.html`
> Cópia disponível no repo: `public/v73/index-v70.html` (~2.7 MB, 5715 linhas).

## O que mudou entre V73 e V70

- **Build tag**: agora `data-version="70"` em `<style>` e nas telas principais (`#page-home`, `#page-review`).
- **CSS consolidado**: em vez de 30+ blocos `<style>`, o V70 tem **1 bloco único** com `id="neurofix-v70-css"`. Vai simplificar extração.
- **Sistema de design `nf70-*`**: novas classes (`nf70-home`, `nf70-home-hero`, `nf70-continue`, `nf70-semester-head`, `nf70-review-hero`, `nf70-review-columns`, `nf70-question-*`, `nf70-option-*`, `nf70-rating`, `nf70-phase`, etc.). São **overlay** sobre os cards/tabs antigos, com maior densidade e visual mais editorial.
- **Home reescrita**: hero preto/azul com fundo em base64 (não pede mais `neuronio-neurofix.jpeg` externo). Nova seção "Matérias favoritas do semestre" no lugar da grid de 6 disciplinas fixas.
- **Review reescrita** (`nf70-review-hero`, `nf70-review-columns`, `nf70-review-focus`, `nf70-review-complete`, `nf70-review-correction`, `nf70-review-plan`): revisões passam por um foco com fases (Recall → Question → Rating), não só uma lista.
- **Novas funções JS** (358 no total, +200 sobre V73): `addCurrentPageToExam`, `buildExamFromWeakPoints`, `captureToError`, `captureToExam`, `captureToPage`, `clearExamSheet`, `completeUnderstand`, `convertConfusionToError`, `copyExamFinal`, `editErrorRule`, `editExamItem`, `finishNotebookRecall`, `finishRetrieve`, `finishReviewV70`, `markExamRecall`, `saveErrorInline`, `chooseConfidence`, etc.
- **Novas seções**: `#page-course-test`, `#page-pathology-note`, `#page-etiology-note`, `#page-pathogenesis-note`, `#page-note` já existiam mas agora têm markup próprio; `#page-privacy` também ampliado.
- **Sidebar/topbar/bottom nav**: **idênticos** ao V73 (mesmos itens, mesmos handlers). Nossa `Shell.tsx` continua compatível.

## Estratégia de execução

Extrair o CSS **1 vez só** (é 1 bloco monolítico agora) e reescopar com `.v73-app`. Substituir o `v73-scoped.css` atual. Depois recriar cada tela do V70 fiel ao markup, wirando handlers em rotas Next + Server Actions Supabase.

Cada fase segue o padrão consolidado:
1. Extrair markup daquela tela do V70
2. Reescrever a rota React usando o Shell
3. Se precisar de dados, criar Server Actions + migration
4. Type-check + smoke test das rotas

## Restrições invioláveis (mantidas)

- Não tocar `/`, `/landing.html`, `/login`, `/cadastro`, `/auth/callback`
- Sem deploy, sem push sem ordem
- Sem alterar `.env`
- Toda tabela nova nasce com RLS por `user_id = auth.uid()`
- SRS existente (`review_schedule` + `srs.ts`) é reusado, não recriado
- Admin client só server-side autenticado

## Zonas prontas (para revalidar contra V70)

Já feito nas fases 2-6, precisa **revalidação visual contra o V70**:
- Sidebar / topbar / mobile bottom nav (Shell.tsx) — bate 100%.
- `/dashboard` (home) — visual **precisa refazer**: adotar `nf70-home`, `nf70-home-hero`, `nf70-continue`, `nf70-semester-head`, `subject-directory-grid`.
- `/subjects` — visual próximo, mas cards do V70 usam `subject-card` novo (com `--subject-accent`, `subject-status`, `subject-card-footer`). Precisa reescrever cards.
- `/subjects/[id]` — placeholder atual sai; entra `#page-library` real (Fase 8).
- `/notebook` — mantém 4 workspaces já wirados no Supabase; adicionar UI de `captureToError|Exam|Page`, `saveErrorInline`, `editErrorRule`, `editExamItem`.
- `/review` — reescrever com `nf70-review-hero` + `nf70-review-columns` + fluxo de foco (Recall → Question → Rating).
- `/progress`, `/favorites` — visual do V70 mais rico; refazer.

## Fases atualizadas (a partir de agora)

### Fase 7 — Migração para o design nf70

**Escopo**
- Copiar o V70 HTML para `public/v73/index-v70.html` (feito).
- Extrair o bloco único `<style id="neurofix-v70-css">` e reescopar com prefixo `.v73-app`.
- Substituir `app/(app)/dashboard/v73/v73-scoped.css` pelo CSS V70.
- Reescrever `DashboardV73.tsx` para adotar `nf70-home`, `nf70-home-hero`, `nf70-continue`, `nf70-semester-head` + novo cartão de matéria.
- Reescrever `SubjectsView.tsx` para adotar `subject-card` do V70 (com `--subject-accent`/`--subject-soft` inline).
- Type-check + smoke test.

**Critério**: `/dashboard` e `/subjects` visualmente = V70 pixel a pixel; nenhum drift em `/notebook` e `/favorites`.

### Fase 8 — Currículo real (`#page-library` + `#page-blueprint`)

**Escopo**
- Extrair `pathologyCurriculum` (39 aulas / 372 microassuntos), `microbiologyCurriculum`, `immunologyCurriculum`, `infectologyParasitologyCurriculum` do V70 (linhas ~2100–2300 no HTML são o markup; o dado JS está no bloco `<script>` correspondente — extrair como TS).
- Nova migration:
  - `curriculum_modules(id, subject_id, number, block, title, description, confusions jsonb, map text, test_count int, ordering int)`
  - `curriculum_topics(id, module_id, title, subtitle, question_count int, flashcard_count int, level text, status text, ordering int)`
  - Ambas com RLS somente leitura para `authenticated` (dados públicos).
- `lib/curriculum.ts` — helpers `getCurriculum(subjectId)`, `getTopic(topicId)`.
- Reescrever `/subjects/[id]` para renderizar `#page-library`: tree lateral + grid de módulos + topic-row.
- Nova rota `/subjects/[id]/topics/[topicId]` = `#page-blueprint`.

**Critério**: abrir Patologia → ver 39 aulas + 372 microassuntos com contagens reais.

### Fase 9 — Notas autorais (`#page-pathology-note`, `#page-etiology-note`, `#page-pathogenesis-note`, `#page-note`)

**Escopo**
- Extrair markup + dados das 4 notas autorais do V70.
- Nova migration `authored_notes(id, subject_id, topic_id, slug, title, tabs_config jsonb, content jsonb)` — RLS leitura authenticated.
- Rota `/notes/[slug]/[tab]` com tabs: `start`, `explain`, `learning`, `clinical`, `confusions`, `questions`, `flashcards`, `eve`, `mastery` (varia por nota).
- Persistir aba ativa em `user_last_study` (upsert).

**Critério**: navegar Ascaris/Etiologia/Patogênese/Patologia com todas as abas funcionando.

### Fase 10 — Fluxo de estudo ativo (Ciclo, Questões, Flashcards)

**Escopo**
- Ciclo Ativo (6 estágios: entender → recuperar → aplicar → corrigir → revisar → provar). Funções V70: `completeUnderstand`, `finishRetrieve`, `chooseConfidence`, `completeCorrection`.
- Questões (`nf70-question-*`, `nf70-option-*`): modos theory/clinical, `checkQuestion`, feedback editorial + trap review + mini-review.
- Flashcards com flip 3D + ratings (`again|hard|good|easy`) wirados em `flashcard_reviews` existente.
- Migration extra se necessário para `question_bank` e `flashcard_deck` estruturados.

**Critério**: 1 nota rodando de ponta a ponta (Explicação → Ciclo → Questão → Flashcard → Revisão programada).

### Fase 11 — Dashboard real (Continue + Revisões hoje)

**Escopo**
- Wirar "Continue de onde parou" em `user_last_study` (leitura no `/dashboard`, escrita ao abrir nota).
- Wirar "Revisões para hoje" em `review_schedule` (mesma migration existente `20260603120000_agenda_revisao_sistema.sql`).
- Refazer `nf70-review-hero`, `nf70-review-columns`, `nf70-review-focus`, `nf70-review-complete`, `nf70-review-correction`, `nf70-review-plan` no `/review`.
- Funções V70: `resumeLastStudy`, `finishReviewV70`, `saveScheduledReview`, `openScheduleAssistant`.

**Critério**: dashboard mostra estado real; revisões abrem foco e completam ciclo.

### Fase 12 — Progresso e Favoritos com visual V70

**Escopo**
- `/progress` — refazer com métricas do banco (question_attempts, flashcard_reviews, review_schedule).
- `/favorites` — reusar tabela `favorites` (já criada Fase 6); adotar visual `nf70-*` e adicionar suporte a favoritar tópicos e notas (não só matérias).

**Critério**: progresso real + favoritos multi-entidade.

### Fase 13 — Página de privacidade V70 (`#page-privacy`)

**Escopo**
- Extrair markup expandido do `#page-privacy` (settings + policy + terms) do V70.
- Rota `/politica-de-privacidade` e `/termos-de-uso` já existem — decidir se linka pra elas ou refaz dentro do V70.

### Fase 14 — Deploy Vercel

Só com sua ordem explícita.

## Zonas intocáveis (relembrando)

- `/` (landing), `/landing.html`
- `/login`, `/cadastro`
- `/auth/callback`
- Migrations existentes
- `.env`, service role key

## Regras globais (mantidas)

- Sem deploy automático
- Sem `git push` sem ordem
- Não duplicar clientes Supabase — sempre importar de `lib/`
- Admin client (`getSupabaseAdmin`/`createAdminClient`) só em Server Components, Server Actions ou Route Handlers **autenticados**. Nunca em Client Components nem rotas públicas.
