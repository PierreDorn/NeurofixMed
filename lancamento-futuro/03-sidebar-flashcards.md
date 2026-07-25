# 03 — Item "Flashcards" no Sidebar

## O que está oculto
O botão "Flashcards" da barra lateral esquerda. Sem este botão, o usuário
final não tem como navegar até `/flashcards` pela UI.

## Onde está oculto

### `components/Sidebar.tsx`
O objeto do item Flashcards no array `navItems` recebeu uma flag `hidden: true`:

```tsx
{
  href: '/flashcards',
  label: 'Flashcards',
  hidden: true, // MVP: oculto visualmente — funções/rotas preservadas. Ver lancamento-futuro/README.md
  icon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
},
```

E o render filtra estes itens antes do `.map()`:

```tsx
{navItems.filter((item) => !(item as { hidden?: boolean }).hidden).map((item) => {
  // ...
})}
```

## Como reativar
1. Remover a linha `hidden: true,` do objeto Flashcards em `navItems`.
2. Opcional: remover o `.filter()` se quiser limpar o código (mas pode deixar,
   ele continua funcionando para futuros usos da flag).

Pronto. O botão volta a aparecer e o aluno acessa `/flashcards` normalmente.

## O que NÃO está oculto (e continua funcional)
- Toda a infraestrutura da rota `/flashcards`, `/flashcards/criar`,
  `/flashcards/hierarquia`, `/flashcards/[materiaSlug]`, e estudo.
- Tabelas `flashcards`, `flashcard_reviews`, lógica de SRS, server actions, RLS.
- Painel admin de flashcards (`/admin/flashcards`) — continua funcionando para
  popular conteúdo, se for a estratégia.
- A página `/flashcards` em si responde se digitada na URL direta — só não
  aparece no menu de navegação.

## Observação para futuro
Quando reativar, vale revisitar também:
- [`02-criacao-flashcards.md`](./02-criacao-flashcards.md) — o bloco "Criador
  de Flashcards" dentro de `/flashcards` está oculto pelo mesmo motivo.
