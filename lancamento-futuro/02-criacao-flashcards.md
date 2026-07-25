# 02 — Criação de Flashcards (Flashcards)

## O que está oculto
A seção "Criador de flashcards" na página `/flashcards`, que continha:
- Card "Criar flashcards" (link para `/flashcards/criar`)
- Card "Acessar hierarquia" (link para `/flashcards/hierarquia`)

## Onde está oculto

### 1. `components/biblioteca/FlashcardsView.tsx`
Linha do `<section>` raiz do bloco recebeu `style={{display:'none'}}`:

```tsx
<section className="summary-builder-section flash-builder-section" id="flashcard-tools" aria-labelledby="flashcard-builder-title" style={{display:'none'}}>
```

### 2. `app/globals.css` (fallback)
Mesmo bloco do item 01:

```css
.summary-builder-section,
.flash-builder-section {
  display: none !important;
}
```

## Como reativar
1. Remover `style={{display:'none'}}` da `<section className="summary-builder-section flash-builder-section" ...>` em `FlashcardsView.tsx`.
2. Remover o bloco MVP do final de `app/globals.css` (ou só a linha `.flash-builder-section`).

## O que NÃO está oculto (e continua acessível por URL)
- `/flashcards/criar` — a página completa de criação continua funcional.
- `/flashcards/hierarquia` — a árvore de matérias/tópicos/cards continua acessível.
- Server actions, modais, tabelas no Supabase, RLS e SRS continuam intactos.

## Observação importante
A área `/flashcards` em si **também está oculta** no MVP — ver
[`03-sidebar-flashcards.md`](./03-sidebar-flashcards.md). Ou seja, sem o item
do Sidebar, o usuário só chega no `/flashcards/criar` se digitar a URL direta.
