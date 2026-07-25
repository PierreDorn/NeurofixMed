# Lançamento Futuro — Funcionalidades ocultas no MVP

Esta pasta documenta TUDO que foi escondido visualmente do site para o lançamento
inicial (MVP). **Nada foi deletado do código** — toda a lógica, rotas, banco,
modais, server actions, RLS e migrations continuam funcionais. O usuário final
apenas não vê os pontos de entrada na UI.

> Quando quiser reativar para o lançamento futuro, basta reverter as alterações
> listadas abaixo seguindo as instruções de cada item.

---

## Itens ocultos

1. [`01-criacao-resumos.md`](./01-criacao-resumos.md) — Bloco "Resumos
   Personalizados" no topo da página da Biblioteca (criar resumo, acessar
   biblioteca, acessar hierarquia).
2. [`02-criacao-flashcards.md`](./02-criacao-flashcards.md) — Bloco "Criador de
   Flashcards" no topo da página de Flashcards (criar flashcards, acessar
   hierarquia).
3. [`03-sidebar-flashcards.md`](./03-sidebar-flashcards.md) — Item "Flashcards"
   da barra lateral (acesso completo à área de flashcards).
4. [`04-sidebar-estudar-ia.md`](./04-sidebar-estudar-ia.md) — Item "Estudar com
   IA" da barra lateral (acesso à área `/ia`).
5. [`05-agenda-notificacoes-srs.md`](./05-agenda-notificacoes-srs.md) — Sistema
   completo de Agenda + Notificações + Auto-agendamento de revisões (SRS):
   `<NotificationCenter />` global, `<AgendaView>` e `<DashboardAdvancedSettings>`
   no dashboard, painéis "Agenda Semanal" e "Próximos eventos", botão "Agendar
   revisão" no resumo (PDF e texto) e item "Notificações" no menu da conta.

---

## Estratégia de ocultação

- **Seções de criação (1 e 2)**: ocultadas via `style={{display:'none'}}` direto
  no `<section>` raiz de cada bloco + um fallback CSS em `app/globals.css`.
- **Itens do Sidebar (3 e 4)**: campo `hidden: true` adicionado nos objetos
  correspondentes do array `navItems` em `components/Sidebar.tsx`, com filtro
  `.filter()` no momento do render. O mesmo filtro vale para qualquer item
  futuro — basta marcar com `hidden: true`.

Tudo trivialmente reversível — sem migrations, sem mudanças em DB, sem
alteração de tipos. As rotas continuam ativas (`/flashcards`, modais de criar
resumo/flash), elas só não têm UI exposta para chegar lá.

---

## Por que MVP

Decisão de produto: o lançamento inicial vai vender apenas o consumo (resumos,
flashcards e questões já criados pelo admin). Toda criação pelo aluno fica para
depois. Quando esse momento chegar, este diretório é o ponto de partida.

Data: 2026-06-26.
