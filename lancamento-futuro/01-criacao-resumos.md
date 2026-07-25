# 01 — Criação de Resumos (Biblioteca)

## O que está oculto
A seção "Resumos personalizados" no topo da página `/biblioteca`, que continha:
- Card "Criar novo resumo" (abre modal `SummaryComposerModal`)
- Card "Acessar meus resumos" (abre modal `SummaryLibraryModal`)
- Card "Acessar hierarquia" (link para `/biblioteca/hierarquia`)

## Onde está oculto

### 1. `components/biblioteca/BibliotecaView.tsx`
Linha do `<section>` raiz do bloco recebeu `style={{display:'none'}}`:

```tsx
<section className="summary-builder-section" id="summary-tools" aria-label="Gerador de resumos" style={{display:'none'}}>
```

### 2. `app/globals.css` (fallback)
Bloco no final do arquivo:

```css
/* ── MVP: seções de criação ocultas visualmente (funções preservadas) ── */
.summary-builder-section,
.flash-builder-section {
  display: none !important;
}
```

## Como reativar
1. Remover `style={{display:'none'}}` da `<section className="summary-builder-section" ...>` em `BibliotecaView.tsx`.
2. Remover o bloco MVP do final de `app/globals.css` (ou só a linha `.summary-builder-section,`).

Nenhuma outra mudança é necessária. Os modais `SummaryComposerModal`,
`SummaryLibraryModal`, server actions e RLS já estão prontos.

## O que NÃO está oculto (e continua acessível)
- A página `/biblioteca/hierarquia` continua funcional via URL direta.
- O painel admin de resumos (`/admin/resumos`) está intacto — esta é a forma
  como o conteúdo é populado no MVP.
- O consumo de resumos pelo aluno (clicar num resumo e ler) continua 100% ativo.
