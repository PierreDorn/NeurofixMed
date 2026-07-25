# 04 — Item "Estudar com IA" no Sidebar

## O que está oculto
O botão "Estudar com IA" da barra lateral esquerda, que ficava logo acima de
"Biblioteca". Sem este botão, o usuário final não tem como navegar até `/ia`
pela UI.

## Onde está oculto

### `components/Sidebar.tsx`
O objeto do item "Estudar com IA" no array `navItems` recebeu uma flag
`hidden: true`:

```tsx
{
  href: '/ia',
  label: 'Estudar com IA',
  hidden: true, // MVP: oculto visualmente — funções/rotas preservadas. Ver lancamento-futuro/04-sidebar-estudar-ia.md
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>
      <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/>
      <path d="M5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4z"/>
    </svg>
  ),
},
```

O filtro de render que já existia no Sidebar continua válido — ele esconde
qualquer item com `hidden: true`:

```tsx
{navItems.filter((item) => !(item as { hidden?: boolean }).hidden).map((item) => {
  // ...
})}
```

## Como reativar
1. Remover a linha `hidden: true,` do objeto "Estudar com IA" em `navItems`.

Pronto. O botão volta a aparecer no Sidebar e o aluno acessa `/ia` normalmente.

## O que NÃO está oculto (e continua funcional)
- Toda a infraestrutura da rota `/ia` continua viva (página, componentes,
  server actions).
- Tudo que estiver em `components/ia/`, `lib/neuro-ia.ts`, `lib/prompts/` e
  qualquer integração com modelos (Anthropic/OpenAI/etc) continua intacto.
- A página `/ia` responde se digitada na URL direta — só não aparece no menu.

## Por que está oculto no MVP
Estratégia de produto: o lançamento inicial vende apenas o consumo de conteúdo
estático (resumos, flashcards e questões). A funcionalidade "Estudar com IA"
fica para uma fase posterior, junto com a criação de resumos/flashcards pelo
aluno.

Ver também:
- [`03-sidebar-flashcards.md`](./03-sidebar-flashcards.md) — mesmo padrão
  aplicado ao item Flashcards.
- [`README.md`](./README.md) — visão geral do que foi escondido no MVP.

Data: 2026-06-26.
