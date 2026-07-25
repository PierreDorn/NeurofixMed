# MAPA_HTML — NeuroFix Med V73

> Fonte: `/Users/pierredonascimentodoerner/Downloads/NeuroFix_Med_v73 2.html` (~2.3 MB, HTML monolítico com JS inline e CSS puro embutido).
> Gerado em: 2026-07-21 · Fase 0 da migração V73.
> Regra: mapa estrutural, sem colar blocos grandes do HTML.

## Resumo em 5 linhas

- Aplicação SPA monolítica de estudo médico com 16 telas principais e navegação por `showPage(name)` + hash de URL.
- Vanilla JS + CSS puro, sem CDN, sem framework, sem Chart.js.
- Estado persistente em `localStorage` (fallback em memória) com ~15 chaves nomeadas com prefixo `neurofix-*`.
- Conteúdo (matérias, currículo, questões, flashcards) hardcoded em objetos JS.
- Grade responsiva com 23 media queries; padrão mobile: barra inferior fixa `#mobileBottomNav`.

## 1. Páginas / telas (16)

Navegação central: `showPage(name)` troca `data-page`. Hash de URL (`#pathology`) abre uma matéria.

| Nome (data-page) | Papel |
|---|---|
| `home` | "Continue de onde parou" + matérias favoritas |
| `subjects` | Catálogo de disciplinas por estágio acadêmico |
| `library` | Currículo de uma matéria (módulos + tópicos) |
| `notebook` | Meu Caderno (hoje, inbox, erros, folha de prova) |
| `blueprint` | Roteiro editorial de um microassunto |
| `course-test` | Teste final integrado de uma aula |
| `pathology-note` | Nota autoral: Necrose × Apoptose (9 abas) |
| `etiology-note` | Nota autoral: Etiologia e Fatores de Risco (9 abas) |
| `pathogenesis-note` | Nota autoral: Patogênese (9 abas) |
| `note` | Nota autoral: Ascaris lumbricoides (7 abas) |
| `review` | Revisões programadas |
| `questions` | Banco de questões isolado |
| `flashcards` | Deck isolado |
| `progress` | Progresso, radar, métricas |
| `favorites` | Notas com estrela |
| `privacy` | Políticas, termos, configurações |

## 2. Layout global

- `<aside class="sidebar">` — menu lateral esquerdo
- `<header class="topbar">` — breadcrumb + busca global (`#globalSearch`)
- `<main class="main">` — conteúdo central dinâmico
- `<nav class="mobile-bottom-nav" id="mobileBottomNav">` — 5 botões, z-index 75
- Painéis laterais: `.note-nav`, `.blueprint-side`, `.study-side`, `.privacy-nav`
- Sem `<dialog>`: "modais" são `<aside class="card">` com `display: none|grid|block`

## 3. Componentes visuais reutilizáveis

Total ~99 elementos com classe `.card`/`.modal`/`.tab`/etc.

- Cards: `course-module`, `notebook-note`, `favorite-card`, `coming-subject`, `review-item`
- Progresso: `.progress > span[style=width:%]`
- Pills / badges: `.pill` (blue/green/red)
- Botões: `.btn`, `.btn-dark`, `.btn-secondary`, `.mini-btn`, `.icon-btn`
- Tabs: `.subject-tabs`, `.curriculum-topic`, `data-etab`, `data-gtab`, `data-ptab`, `data-tab`
- Accordion: `.active-cycle`, `.cycle-steps`
- Listas: `.topic-list`, `.review-list`, `.activity-list`
- Flashcard 3D: `.flashcard > .flash-inner > .flash-front|.flash-back`

## 4. Fluxos principais

1. Home → matéria → subjects → `openSubject()` → `library` → `openTopic()` → `blueprint`
2. Nota autoral: `openEtiologyNote('start')` → `renderEtiologyNote(tab)` → tab troca conteúdo (start/explain/learning/clinical/confusions/questions/flashcards/eve/mastery)
3. Ciclo ativo de domínio: `renderActiveCycle(note)` → 6 estágios (entender → recuperar → aplicar → corrigir → revisar → provar); `submitCycleQuestion()` valida e avança
4. Revisão espaçada: `renderReviews()` → `completeReview(id)` / `rescheduleReview(id, days)`; intervalos `[1,3,7,14,30,60]`
5. Captura automática de erro: `captureQuestionErrorAutomatically()` → `renderLivingErrors()` → `toggleErrorResolved()` → `pinErrorToExam()`
6. Meu Caderno: `saveLivingPage()` / `loadLivingPage()` + `renderLivingErrors|Exam|Captures`
7. Prática de questões: `renderQuestionPracticeMode(scope, bank, mode)` → `checkQuestion()` → `buildQuestionCorrection()`; modos `theory` vs `clinical`
8. Flashcards com tracking: `updateNeurofixFlashcardDeck(deckKey)` → `goToNeurofixFlashcard(deckKey, position)`; ratings `again|hard|good|easy`
9. Favoritos: `toggleFavorite()` / `toggleGenericFavorite(id)` → `renderFavorites()`
10. Progresso: `renderProgress()` → `subjectData()` → `renderSubjectRadar()` (SVG inline, sem Chart.js)

## 5. Funções JavaScript principais

Grupos (60+ funções):

- **Navegação**: `showPage`, `openSubject`, `openTopic`, `openNote`, `openEtiologyNote`, `openPathogenesisNote`, `openPathologyNote`, `resumeLastStudy`, `rememberStudyPosition`
- **Renderização**: `renderSubjects`, `renderCurriculum`, `renderNotebook`, `renderNotebookNotes`, `renderNotebookSubjects`, `renderEtiologyNote`, `renderPathogenesisNote`, `renderPathologyNote`, `renderNote`, `renderReviews`, `renderProgress`, `renderFavorites`, `renderActiveCycle`, `renderQuestionPracticeMode`, `renderLivingErrors`, `renderLivingExam`, `renderLivingCaptures`
- **Factories/Templates**: `makeQuestionModeShell`, `makeNeurofixFlashcardDeckHTML`, `makeConfusionGlossaryHTML`, `makeAlternativeTrap`
- **Estado/Storage**: `store.get/set` (wrapper localStorage + fallback), `jsonGet/jsonSet`, `getLastStudyState/setLastStudyState`, `getStats/saveStats`, `getReviews`, `gaps`, `favoriteIds/isFavorite/toggleFavorite`, `addActivity`
- **Dados/Catálogos**: `subjectCatalog` (15), `pathologyCurriculum` (39 aulas / 372 microassuntos), `infectologyParasitologyCurriculum`, `microbiologyCurriculum`, `immunologyCurriculum`, `notebookNoteCatalog`, `activeCycleConfig`
- **Utilitários**: `escapeHTML`, `normalizeTerm`, `dateKey`, `formatDate`, `relativeTime`, `shortOptionText`, `questionAnswerLetter`, `questionComment`, `today`

## 6. Storage local (chaves detectadas)

Wrapper: `store.get/set` com fallback `memoryStorage` (para modo privado).

| Chave | Conteúdo |
|---|---|
| `neurofix-last-study-v2` | `{noteId, tab, scrollY}` |
| `neurofix-notebook-workspace-v40` | `today | inbox | exam | errors` |
| `neurofix-tab` | Aba corrente de nota genérica |
| `neurofix-etiology-tab` | Aba corrente etiology-note |
| `neurofix-pathogenesis-tab` | Aba corrente pathogenesis-note |
| `neurofix-pathology-tab` | Aba corrente pathology-note |
| `neurofix-personal-note` | Anotação livre |
| `activity` | Últimas 30 ações |
| `favorites` | IDs de notas favoritadas |
| `reviews` | `[{id, title, subject, date, type, done}]` (mock com 3) |
| `questions-stats` | `{questions, correct, reviews}` |
| `exam` (livingExam) | `[{id, label, topic, subject, text, confidence, priority}]` |
| `errors` (livingErrors) | `[{id, topic, subject, why, rule, resolved, signal, stage, nextReview, created}]` |
| `captures` (livingCaptures) | `[{id, type, subject, text, created}]` |
| `gaps-v40` | Lacunas normalizadas a partir de `errors` |

## 7. Formulários

~26 inputs/selects/textareas. Principais:

- `#globalSearch` (busca global, debounced)
- `#subjectsSearch` (filtro de disciplinas, `oninput="renderSubjects(this.value)"`)
- `#curriculumSearch` (filtro de currículo)
- Textareas de captura: dúvida, erro (4 campos: why/rule/topic/subject), prova (label+texto)
- `#errorComposer` (grid com validação)
- Filtro de estágio acadêmico (tabs inline)
- Agendador de revisão (select de aula + date picker)

## 8. Tabelas / modais / abas / tabelas

- **Tabelas HTML** (`<table>`): 5 elementos, uso residual. Alternativas de questão são `<div class="option">`.
- **Modais**: 0 `<dialog>`. Padrão: `<aside class="card">` + toggle de `display`. IDs relevantes: `#privacy-settings`, `#privacy-policy`, `#privacy-terms`, `#blueprintSide`, `#errorComposer`, `#nf70SchedulePanel`.
- **Abas**: 15+ grupos.

| Contexto | Data-attr | Valores |
|---|---|---|
| Estágio | `data-academic-stage` | basic, clinical, enamed, internship, residency |
| Etiology | `data-etab` | start, explain, learning, clinical, confusions, questions, flashcards, eve, mastery |
| Pathogenesis | `data-gtab` | (idem) |
| Pathology | `data-ptab` | start, explain, pathogenesis, morphology, clinic, traps, questions, flashcards, eve, mastery |
| Ascaris | `data-tab` | explain, exam, traps, falls, question, flash, eve |
| Workspace | `data-workspace` | today, inbox, exam, errors |
| Modo questão | `data-question-mode` | theory, clinical |
| Página | `data-page` | home, subjects, library, notebook, review, questions, flashcards, progress, favorites, privacy |
| Mobile | `data-mobile-page` | home, notebook, subjects, review, progress |

## 9. Pesquisa

Placeholders detectados:

- "Buscar aula, doença ou mecanismo..." → `#curriculumSearch`
- "Buscar matéria, aula ou microassunto" → global
- "Buscar uma disciplina do Ciclo Básico..." → `#subjectsSearch`

Padrão: `oninput` + `normalizeTerm()` (case/acento).

## 10. Questões

Volume: ~50–100 hardcoded. Pathology (36 no teste final), Etiology (60), Pathogenesis (60), Ascaris (~40).

Formato: `activeCycleConfig[note] = { apply: {text, ans, options[]}, prove: {text, ans, options[]} }`.

`getQuestionBankContext(bankName) → {bank: [...items], title}`.

Modos: `theory | clinical`. Feedback: comentário editorial por alternativa + trap review + miniReview.

## 11. Flashcards

~40 por tema. Decks hardcoded: `ascarisFlashcards`, `pathologyFlashcards`, `etiologyFlashcards`, `pathogenesisFlashcards`.

Item: `{q, a, track: "Base"|"Faculdade"|"Enamed"|"Residência"|"Pegadinhas"}`.

Estado: `flashcardDeckRecord(deckKey) = {indices, current, ratings, cards}`. UI 3D flip com `.flash-inner` + faces `.flash-front|.flash-back`. Ratings `again|hard|good|easy`.

## 12. Revisões / SRS

Algoritmo: primeira revisão no dia seguinte; intervalos `1, 3, 7, 14, 30, 60` dias. Errar encurta e reabre ciclo; acerto seguro amplia.

`getReviews()` retorna mock hardcoded com 3 itens. `completeReview(id)`, `rescheduleReview(id, days)`.

## 13. Progresso / estatísticas

- `.progress > span[style=width:pct%]` (barra)
- Cards de métrica: `#metricQuestions`, `#metricCorrect`, `#metricReviews`, `#metricAccuracy`
- Radar por matéria: `#nf56SubjectRadar` (SVG inline, não canvas)
- Dados: `getStats()`, `subjectData()`, `gaps()`

## 14. Favoritos

Chave `favorites` (array de IDs). Funções: `favoriteIds`, `isFavorite`, `toggleFavorite`, `toggleGenericFavorite`, `removeFavorite`, `renderFavorites`. Ícone Unicode ★/☆.

## 15. Responsividade

23 media queries. CSS puro (sem Tailwind), Grid `repeat(auto-fit, minmax(...))` + Flexbox. Breakpoints principais:

| Breakpoint | Efeito |
|---|---|
| ≤1280 | Grid 2-col → 1-col em favoritos |
| ≤1180 | metrics-grid vira 2 col |
| ≤1050 | header compacto |
| ≤760 | Mobile: barra inferior fixa, overlay de busca |
| ≤650 / ≤600 / ≤520 | Redução progressiva de forms/cards/botões |

## 16. Ativos externos / bibliotecas

- Nenhum `<script src="...">` externo detectado
- Nenhum React, Vue, Alpine, Chart.js
- Fontes e ícones: Unicode + `<svg>` inline; SVG inline para radar/gráficos
- Todo JS e CSS estão inline no arquivo

## 17. Seções com afinidade forte ao projeto atual

Estas partes tendem a "reutilizar" na matriz, não "criar":

- **subjects** (catálogo de matérias) — bate com a biblioteca atual em `app/(app)/biblioteca/*` (arquivado em `lancamento-futuro/`).
- **library** (currículo por matéria) — mesmo modelo de "matéria → tópicos → conteúdo" que já existe em `hierarquia`/`biblioteca` arquivadas.
- **flashcards deck com ratings** — projeto tem componente `FlashcardRevisor.tsx`.
- **questions com modo prático + feedback** — projeto tem estrutura de questões (arquivada).

O detalhamento de compatibilidade componente-a-componente vai para `MATRIZ_MIGRACAO.md`.

## 18. Alertas para o plano de migração

- **Estado 100% no localStorage** → migração precisa decidir o que vira Supabase (persistência por usuário) e o que continua local (rascunhos, última posição).
- **Conteúdo hardcoded em JS** → precisa virar dados (Supabase) ou content JSON versionado.
- **Sem framework de UI** → recriar em Tailwind v4 (não copiar CSS puro do HTML).
- **Sem router** → mapear `showPage(x)` → rotas do Next App Router (`/subjects`, `/subjects/[id]`, `/notes/[id]/[tab]`, etc.).
- **Modais via `display`** → substituir por padrão React (state + portal ou headless UI).
- **`<dialog>` ausente e SVG inline** → não bloqueia migração, mas exige recriação com componentes.
