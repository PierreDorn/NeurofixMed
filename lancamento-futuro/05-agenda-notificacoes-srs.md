# 05 — Sistema de Agenda, Notificações e Auto-Agendamento de Revisões

Documentação de TUDO que foi desconectado do site relacionado a:
- Sistema de Agenda (visualização de calendário, eventos, recorrências)
- Sistema de Notificações (push, Service Worker, central global)
- Auto-agendamento de revisões (SRS — Spaced Repetition System) ao
  visualizar/registrar leitura de resumo
- Botão "Agendar revisão" no resumo
- Painéis "Agenda Semanal" e "Próximos eventos" do Dashboard
- Item "Notificações" do menu da conta no Sidebar

> **Nada foi deletado.** Todo o código, design, posições, formatos, server
> actions, RPCs do Supabase, hooks, modais, lib helpers, cron jobs e Service
> Worker continuam intactos. Apenas os pontos de entrada na UI estão
> desconectados via `{false && (...)}` ou flag `disabled: true`.

---

## Pontos desconectados (5 alterações)

### 1. `app/(app)/layout.tsx` — `<NotificationCenter />` global
A central de notificações fica como overlay em toda área logada do app.
Desconectada via wrapper:

```tsx
{/* MVP: NotificationCenter desconectado. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
{false && <NotificationCenter />}
```

**Reativar**: remover o `{false && ...}` deixando só `<NotificationCenter />`.

---

### 2. `components/Sidebar.tsx` — item "🔔 Notificações" do menu da conta
O item agora aparece com `disabled: true` (já tem aparência "em breve"
suportada pelo render existente — vai vir riscado/inerte):

```tsx
{ icon: '🔔', label: 'Notificações',   href: '/configuracoes#notificacoes', disabled: true  }, // MVP: ver lancamento-futuro/05-agenda-notificacoes-srs.md
```

**Reativar**: trocar `disabled: true` por `disabled: false`.

---

### 3. `app/(app)/dashboard/page.tsx` — `<AgendaView />` + `<DashboardAdvancedSettings />`
A agenda embarcada e as configurações avançadas da agenda foram envolvidas:

```tsx
{/* MVP: agenda e configurações avançadas desconectadas. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
{false && (
  <>
    <section className="nf-section">
      <AgendaView
        events={agendaEvents ?? []}
        recurrences={agendaRecurrences ?? []}
        windowStartISO={agendaStart.toISOString()}
        windowEndISO={agendaEnd.toISOString()}
      />
    </section>
    <DashboardAdvancedSettings settings={mergedSettings} />
  </>
)}
```

**Reativar**: remover o `{false && (` e o `)}` correspondente.

---

### 4. `app/(app)/dashboard/page.tsx` — painéis "Agenda Semanal" e "Próximos eventos"
Os dois `nf-panel`s na coluna lateral do dashboard foram envolvidos cada um em
seu próprio `{false && (` … `)}`. Procure pelos comentários:

```tsx
{/* TODAY — MVP: oculto. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
{false && (
<div className="nf-panel">
  ...
</div>
)}
```

```tsx
{/* AGENDA — MVP: oculto. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
{false && (
<div className="nf-panel">
  ...
</div>
)}
```

**Reativar**: em cada um, remover o `{false && (` e o `)}` correspondente.

---

### 5. `app/(app)/resumos/[id]/page.tsx` — botão "Agendar revisão"
Dois renders (versão PDF e versão texto). Ambos envolvidos:

```tsx
{/* MVP: AgendarRevisaoButton desconectado. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
{false && (
  <div style={{ marginLeft: 'auto' }}>
    <AgendarRevisaoButton resumoId={resumo!.id} jaAgendado={jaAgendado} />
  </div>
)}
```

```tsx
{/* MVP: AgendarRevisaoButton desconectado. Ver lancamento-futuro/05-agenda-notificacoes-srs.md */}
{false && <AgendarRevisaoButton resumoId={resumo!.id} jaAgendado={jaAgendado} />}
```

> Como o TypeScript não estreita `resumo` através do `{false && ...}`, foi
> usado non-null assertion `resumo!.id` (a checagem `if (!resumo) notFound();`
> mais acima garante que nunca chegará nulo aqui em runtime). Ao reativar,
> pode-se voltar para `resumo.id` ou manter `resumo!.id`.

**Reativar**: remover os wrappers `{false && (...)}`.

---

## O que NÃO foi tocado (e continua intacto no código)

### Arquivos do sistema de agenda
- `app/(app)/agenda/page.tsx`
- `app/(app)/agenda/actions.ts`
- `components/agenda/AgendaView.tsx`
- `components/agenda/EventoModal.tsx`
- `lib/recurrence.ts`

### Arquivos do sistema de notificações
- `components/notifications/NotificationCenter.tsx`
- `lib/hooks/useNotifications.ts`
- `app/notifications-actions.ts`
- `public/sw-notifications.js` (Service Worker)

### Auto-agendamento de revisões (SRS)
- `app/(app)/resumos/[id]/srs-actions.ts` — `registrarLeituraResumo(...)`
- `app/(app)/resumos/[id]/ResumoTracker.tsx` — wrapper client-side
- `app/(app)/resumos/[id]/AgendarRevisaoButton.tsx`
- `app/(app)/flashcards/criar/srs-actions.ts`
- `app/(app)/flashcards/[materiaSlug]/estudar/actions.ts` — `recordReview(...)`
- `lib/srs.ts` — `agendarRevisoes(...)`
- Funções no Supabase: `ja_tem_revisoes`, `criar_revisoes_automaticas`

### Cron jobs
- `app/api/cron/manutencao-revisoes/route.ts`
- Configuração de cron no `vercel.json` (continua agendado mas sem efeito
  visível porque não há UI consumindo)

### Configurações do usuário relacionadas
- `app/(app)/configuracoes/page.tsx` e seções de notificações continuam no
  código, mas o link no Sidebar está desabilitado (#2 acima).

### Painel admin
- Painéis admin não foram tocados — admin continua tendo todas as
  funcionalidades para popular conteúdo.

---

## Observações importantes

- **O `ResumoTracker.tsx` já NÃO estava sendo importado em `resumos/[id]/page.tsx`
  antes destas mudanças** — ou seja, o auto-agendamento ao visualizar resumo já
  não estava ativo antes do MVP. Está pronto para ser plugado quando for o
  momento.

- **Os botões "Editar / Calendário →" dos painéis ocultos** apontavam para
  `/tarefas`. Essa rota continua existindo, mas sem entrada visual a partir do
  Sidebar (não existia link direto no Sidebar para `/tarefas` antes — só pelos
  painéis agora ocultos).

- **A rota `/agenda` continua viva** se digitada na URL direta. Para bloquear
  totalmente, basta adicionar um middleware ou redirect — não foi feito porque
  o usuário pediu para apenas tirar visualmente.

- **O cron `manutencao-revisoes` continua agendado** no vercel.json. Como não
  há UI consumindo dados de revisão pelo aluno no MVP, ele só fica rodando em
  segundo plano sem impacto visível. Se quiser desligar 100% até o lançamento,
  remova/comente a entrada do cron em `vercel.json`.

---

## Como reativar tudo de uma vez

Sequência sugerida para retomada no próximo ciclo:

1. Reverter cada uma das 5 alterações acima (busca por
   "lancamento-futuro/05-agenda" encontra todos os pontos).
2. Validar que as RPCs `ja_tem_revisoes` e `criar_revisoes_automaticas` ainda
   existem no Supabase (não deveriam ter sido alteradas).
3. Testar fluxo: abrir resumo → clicar "Agendar revisão" → ver evento aparecer
   na agenda do dashboard e no `/agenda`.
4. Testar fluxo de notificações: pedir permissão no browser →
   `NotificationCenter` deve subir o overlay quando houver revisão pendente.
5. Validar cron `manutencao-revisoes` rodando no Vercel.

Data: 2026-06-26.
