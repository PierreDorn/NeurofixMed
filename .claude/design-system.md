# NeuroFix Med — Design System & Guia de Escrita

> **Para agentes:** Leia a seção correspondente antes de criar ou editar qualquer página/componente.
> Se a seção não estiver documentada, pergunte ao usuário antes de decidir.
> Versão navegável no vault: `02-projetos/NeuroFix-Med-Design-Escrita.md`

---

## 1. SISTEMA VISUAL GLOBAL

### 1.1 Estrutura da aplicação

```
AppShell
├── Sidebar fixa (fundo preto)
├── Topbar fixa (fundo claro)
└── Área principal (fundo #F7F6F3)
    ├── Identificação da página
    ├── Conteúdo específico
    └── Navegação interna
```

A área principal nunca encosta nas extremidades — margens laterais amplas, aparência editorial e premium.

### 1.2 Paleta de cores

| Função | Hex | Uso |
|--------|-----|-----|
| Preto principal | `#0B0B0C` | Sidebar, botões primários, estados ativos |
| Azul-marinho profundo | `#081321` | Hero, banners, áreas editoriais premium |
| Azul-marinho secundário | `#10223B` | Gradientes e superfícies escuras |
| Fundo geral | `#F7F6F3` | Fundo das páginas |
| Branco | `#FFFFFF` | Cards e campos |
| Texto principal | `#17181B` | Títulos e informações importantes |
| Texto secundário | `#6E7074` | Descrições e textos auxiliares |
| Borda clara | `#E5E0D7` | Cards, campos e separadores |
| Dourado | `#D2B354` | Destaques editoriais, progresso premium |
| Dourado claro | `#F6ECD0` | Chips e fundos informativos |
| Azul de ação | `#2D73D5` | Links, estados informativos, progresso |
| Azul claro | `#EAF2FF` | Badges, etiquetas, mapa mestre |
| Verde | `#26966E` | Conteúdo concluído |
| Verde claro | `#E6F5EF` | Fundo de status concluído |

**Regras de cor:**
- **Dourado** = conteúdo oficial, padrão editorial, currículo NeuroFix, ações de maior valor. Não usar como decorativo.
- **Azul** = navegação, informação, ligação entre conteúdos, progresso, ações secundárias.
- **Preto** = ação principal, item selecionado, estado ativo, autoridade visual.

> Antes de substituir cores, verificar tokens existentes no projeto.

### 1.3 Tipografia

**Fonte serifada** (editorial) — usar em:
- Grandes títulos de página
- Nomes de disciplinas e módulos
- Títulos conceituais e chamadas editoriais

**Fonte sans-serif** — usar em:
- Navegação, botões, filtros
- Descrições e textos funcionais
- Números auxiliares, badges, campos de busca

**Regra tipográfica:**
> Serifada = conhecimento, disciplina, conceito, conteúdo editorial
> Sans-serif = navegação, instrução, dado, estado, ação

> Identificar a fonte já carregada no projeto antes de instalar qualquer família nova.

### 1.4 Arredondamentos

| Componente | border-radius |
|------------|---------------|
| Grandes banners / hero | 28–36px |
| Cards principais | 24–28px |
| Cards menores | 18–24px |
| Botões | 14–18px |
| Chips, badges, abas de navegação | pill (9999px) |
| Ícones quadrados | 14–18px |

Bordas finas e discretas. Sombras amplas e muito suaves — nunca escuras ou pesadas.

### 1.5 Padrões de copy (globais)

**Usar:**
- Verbos de ação
- Frases diretas
- Resultados específicos
- Termos médicos precisos
- Instruções que expliquem o próximo passo
- `→` para progressão
- `×` para conceitos comparados
- Números para demonstrar dimensão e progresso

**Evitar:**
- "Clique aqui" / "Saiba mais" sem contexto
- Frases publicitárias genéricas
- Parágrafos longos em áreas de navegação
- Títulos que não indiquem assunto ou competência

---

## 2. SIDEBAR

Fundo: `#0B0B0C` (preto quase absoluto)

**Estrutura:**
```
Logo (centralizado, topo)
────────────────────────
Hoje
Meu caderno
Matérias
Revisões
Meu progresso
Favoritos  [contador à direita]
────────────────────────
Perfil do usuário (fixo, base)
```

**Item ativo:**
- Fundo marrom-preto / dourado muito escuro
- Borda dourada na lateral esquerda
- Texto branco, ícone branco
- Cantos arredondados
- Contraste máximo

**Itens inativos:** cinza-claro (não branco absoluto)

**Regra:** A sidebar não muda de estrutura entre páginas. Apenas o estado ativo muda.

---

## 3. TOPBAR (Cabeçalho superior)

Fundo claro com borda inferior discreta. Altura constante.

**Elementos:**
- Breadcrumb à esquerda
- Campo de busca à direita (largo)
- Botões quadrados auxiliares após a busca

**Breadcrumb:**
- 1º nível: cinza
- Nível atual: preto e negrito
- Exemplos: `NeuroFix Med / Hoje` · `NeuroFix Med / Patologia Médica` · `NeuroFix Med / Etiologia e fatores de risco`

**Campo de busca:**
- Fundo branco, borda clara, ícone de lupa
- Placeholder: `Buscar matéria, aula ou microassunto`
- Nunca usar placeholder genérico como "Pesquisar"

---

## 4. PÁGINA INICIAL ("Hoje")

**Objetivo:** Ponto de orientação para o estudo — não painel de estatísticas.

**Ordem da informação:**
```
1. Motivação e direcionamento (hero)
2. Retomada do último estudo
3. Acesso rápido às matérias favoritas
4. Demais conteúdos
```

### 4.1 Banner hero

- Fundo azul-marinho com imagem científica abstrata
- Gradiente escuro mais intenso à esquerda
- Cantos fortemente arredondados, grande padding
- Texto à esquerda, conteúdo em ~50% da largura

**Hierarquia:**

| Elemento | Estilo |
|----------|--------|
| Etiqueta superior | Maiúsculas, dourado, peso forte, letra-espaçada. Ex: `SEU PONTO DE PARTIDA PARA ESTUDAR` |
| Título | Serifado, branco, muito grande, 2 linhas, entrelinha curta. Ex: `O caos já foi organizado. / Agora é só estudar.` |
| Descrição | Sans-serif, cinza-claro, largura controlada, explica como usar a plataforma |

**Tom:** Alívio → instrução prática. Copy segura, acolhedora, direta.

### 4.2 Seção "Continue de onde parou"

- Título à esquerda + descrição abaixo
- Link azul à direita: `Abrir última etapa`

**Card de retomada:**
- Fundo branco, borda clara, layout horizontal
- Badge: disciplina + aula (azul sobre fundo azul-claro)
- Título do microassunto: sans-serif, preto, negrito
- Estado: `Você parou em: [nome exato da etapa]`
- Barra de progresso: trilho cinza-claro → dourado para azul, espessura pequena
- Botão: `Retomar em "[nome exato da etapa]"` — fundo preto, texto branco, grande

### 4.3 Seção "Matérias favoritas do semestre"

- Título + descrição que explica por que só algumas aparecem
- Link à direita: `Ver todas as matérias →`

**Cards de disciplina (grade 4 colunas no desktop):**

| Elemento | Estilo |
|----------|--------|
| Linha superior colorida | Fina, pode ser preta, dourada ou azul — significado consistente |
| Badge de estado | Maiúsculas, azul, fundo azul-claro, pill. Ex: `EM DESENVOLVIMENTO` |
| Nome | Serifado, grande, entrelinha curta |
| Descrição | Resumo do escopo curricular — não frase publicitária |
| Rodapé esquerdo | `39 aulas · 372 microassuntos` |
| Rodapé direito | `Abrir disciplina →` (preto, peso forte, seta) |

Todos os cards na mesma linha têm a mesma altura (mesmo com títulos diferentes).

---

## 5. PÁGINA INTERNA DA DISCIPLINA

**Objetivo:** Mapa curricular completo. Responde: onde estou, o que cobre, tamanho, organização, progresso, o que abrir agora.

### 5.1 Cabeçalho

- Botão `← Todas as matérias` (branco, contorno claro)
- Texto orientacional à direita: `Você está dentro do caderno de [Disciplina]`
- Etiqueta editorial: `NÚCLEO COMPLETO NEUROFIX` (dourado, maiúsculas, letra-espaçada)
- Título: serifado, preto, grande, alinhado à esquerda
- Descrição: resume a progressão pedagógica
- Botão `+ Salvar núcleo` à direita (preto)

### 5.2 Cards de indicadores (linha de 4)

| Label | Valor | Complemento |
|-------|-------|-------------|
| Aulas principais | número grande (serifado) | Ex: Patologia Geral, Diagnóstica e Sistêmica |
| Microassuntos mapeados | número | Organizados em progressão curricular |
| Questões editoriais | número | Diretas, mecanismos, imagens e casos |
| Testes finais | número | 25 a 40 questões e 80% de domínio |

Fundo branco, borda clara, cantos arredondados. Número é o foco visual principal.

### 5.3 Banner "Padrão NeuroFix Ouro"

- Fundo azul-marinho, texto branco, destaque dourado
- Etiqueta: `PADRÃO NEUROFIX OURO`
- Título da nota-modelo (serifado, grande)
- Descrição: o que a nota contém
- Chips de aplicação: `Faculdade` · `Ponte clínica` · `Residência`
- Área direita: contador `X de 372`, barra de progresso, botão dourado `Abrir nota-modelo`

### 5.4 Faixa curricular

Fundo bege claro.
- Título: `Do mecanismo ao paciente`
- Descrição: sequência pedagógica do conteúdo
- Badge à direita: `Currículo longitudinal`

### 5.5 Filtros

Abas: `Todas` · `[Subcategorias da disciplina]`
- Ativo: fundo preto, texto branco
- Inativo: fundo branco, texto cinza-escuro, borda clara

Busca interna: `Buscar aula, doença ou mecanismo` (pesquisa só dentro da disciplina atual)

### 5.6 Card de módulo

```
[01]              PATOLOGIA GERAL              8 microassuntos
                  Como pensar em Patologia     163 questões + teste final
                  Ensina a linguagem da doença...
```

| Elemento | Estilo |
|----------|--------|
| Número do módulo | Quadrado preto, texto branco, serifado, cantos arredondados |
| Categoria | Dourado, maiúsculas, pequeno, letra-espaçada |
| Título | Serifado, grande, preto |
| Quantidades | À direita — negrito + cinza |

**Mapa mestre:** faixa azul-claro. Ex: `Mapa mestre: Etiologia → patogênese → morfologia → manifestação clínica → prognóstico`
- Termos curtos, sequência com setas, do fundamento à aplicação

**Chips de comparação:** fundo dourado-claro, Ex: `⇄ Patologia geral × sistêmica`

### 5.7 Lista de microassuntos

Cada linha:
- Indicador de progresso (ícone)
- Número + título + descrição curta
- Status editorial (pill)
- Questões / Flashcards / Níveis (à direita)

| Status | Visual |
|--------|--------|
| Concluído | Ícone verde com check, badge verde-claro, texto verde, `NOTA COMPLETA` |
| Não concluído | Círculo cinza, badge dourado, `ROTEIRO OURO` |

### 5.8 Teste final (dentro do card de módulo)

Fundo creme, borda dourada, ícone quadrado dourado-claro.
Ex: `Teste final — Como pensar em Patologia · 36 questões, 80% de domínio, morfologia, casos e mapa de erros.`
Botão branco: `Ver blueprint`

---

## 6. PARTE SUPERIOR DO MÓDULO (interior)

**Objetivo:** Ambiente guiado de aprendizagem — não mais catálogo.

### 6.1 Link de retorno

`← Voltar para [Nome da Disciplina]` — azul, menciona sempre a disciplina explicitamente. Nunca apenas "Voltar".

### 6.2 Hero do módulo

- Fundo: azul-marinho quase preto (`#081321`) com gradiente quente discreto à direita
- Cantos amplos, grande padding, texto branco

| Elemento | Estilo |
|----------|--------|
| Badge editorial | Borda dourada, texto dourado-claro, fundo dourado translúcido, pill. Ex: `✦ Nota NeuroFix Ouro · Padrão editorial oficial` |
| Título | Serifado, muito grande, branco |
| Descrição | Informa a competência adquirida — não apenas descreve o assunto |

**Metadados (chips escuros, borda clara):**
- Localização curricular: `Aula 01 · Como pensar em Patologia`
- Tempo: `35–45 minutos`
- Nível: `Faculdade → Clínica → Residência`
- Origem: `Conteúdo autoral baseado nos livros do projeto`

**Ações utilitárias (não competem com botões principais):**
- `☆ Salvar` · `♫ Ouvir tela atual` · `↻ Programar revisão`
- Fundo escuro levemente mais claro que o hero, borda cinza, texto branco

### 6.3 Bloco "Método NeuroFix em 3 Fases"

Fundo azul-marinho.
- Etiqueta: `MÉTODO NEUROFIX EM 3 FASES` (dourado, maiúsculas)
- Título: serifado, branco. Ex: `Aprenda. Teste sem olhar. Revise até dominar.`
- Descrição: `A plataforma conduz automaticamente os passos menores dentro de cada fase.`
- Progresso à direita: `0/3 fases concluídas` (dourado)

**Seletor das 3 fases:**

| Fase | Estado ativo | Estado inativo |
|------|-------------|----------------|
| `1 · Aprenda · entenda o mecanismo` | Fundo preto, número em círculo dourado, título branco | Fundo branco/bege, texto acinzentado, borda clara |
| `2 · Teste sem olhar · lembre, aplique e corrija` | — | idem |
| `3 · Revise até dominar · retorne e confirme` | — | idem |

Fase ativa = contraste máximo. Fases futuras = visíveis mas não parecem disponíveis no mesmo nível.

**Painel da fase ativa (Aprenda):**
- Etiqueta: `APRENDA · CONSTRUA A BASE` (azul, fundo azul-claro, pill)
- Orientação: frase que esclarece o comportamento esperado do aluno
- Botões secundários: `Abrir explicação` · `Ouvir explicação` (fundo claro, borda, texto preto)
- Botão principal: `Concluí e consigo resumir` (fundo preto, texto branco)
- Texto auxiliar abaixo do botão principal: explicação do que acontece ao marcar

---

## 7. BARRA DE NAVEGAÇÃO DO MÓDULO (ModuleSectionTabs)

Barra horizontal com pills. Posicionada abaixo do painel de fases.

**Design da barra:**
- Fundo da área: `#F7F6F3` (bege claro da página)
- Espaçamento confortável entre os pills
- Scroll horizontal se não couber na tela

**Aba ativa:**
- Fundo: `#0B0B0C` (preto)
- Texto: branco, peso forte
- Border-radius: pill

**Aba inativa:**
- Fundo: branco
- Texto: cinza-escuro
- Borda: `#E5E0D7` (clara)
- Border-radius: pill

**Ordem fixa das abas:**
1. Comece aqui
2. Explicação do zero
3. Entender × memorizar
4. Raciocínio clínico
5. O que confunde
6. Questões
7. Flashcards
8. Véspera
9. Domínio e fontes

---

## 7.0 REGRA GERAL ENTRE AS 4 PRIMEIRAS ABAS

`Comece aqui`, `Explicação do zero`, `Entender × memorizar` e `Raciocínio clínico` pertencem ao mesmo módulo, mas não são versões repetidas.

| Aba | Função |
|-----|--------|
| Comece aqui | Orientação e preparação |
| Explicação do zero | Construção progressiva do conteúdo |
| Entender × memorizar | Síntese por nível de conhecimento |
| Raciocínio clínico | Aplicação do conteúdo em um caso |

Ao trocar de aba, substituir **apenas** o conteúdo abaixo da barra de navegação. Permanecem fixos: hero do módulo, metadados, ações utilitárias, progresso, bloco Método NeuroFix em 3 Fases, painel da fase ativa e a própria `ModuleSectionTabs`.

---

## 7.1 ABA — Comece aqui

**Papel pedagógico:** Introdução estratégica ao microassunto — não ensina, prepara. Funciona como contrato pedagógico entre plataforma e aluno. Responde: o que vai conseguir fazer, o que precisa saber antes, tempo, critério de domínio, o que compreender, o que memorizar e a ideia central.

**Superfície:** grande card branco, borda clara, cantos arredondados, padding interno amplo.

### 7.1.1 Estrutura obrigatória (topo → base)

```
Etiqueta introdutória
↓
Título principal (resultado esperado)
↓
Parágrafo de abertura (o que não fazer × o que fazer)
↓
Grade de 4 cards (Objetivo · Pré-requisitos · Tempo · Critério de domínio)
↓
Dois cards Compreender × Memorizar
↓
Caixa "Regra-mãe da nota"
```

### 7.1.2 Etiqueta introdutória

Texto fixo entre módulos: `Antes de começar`.

- Formato: pill · fundo bege/dourado muito claro (`#F6ECD0`) · texto dourado-escuro
- Fonte sans-serif, pequena, peso forte, acima do título

### 7.1.3 Título principal

Serifado, grande, preto, entrelinha curta, alinhamento à esquerda. **Orientado por competência**, não por tema.

Formatos aceitos: `O que você vai conseguir fazer ao final` · `O que você será capaz de reconhecer` · `O que este conteúdo permitirá explicar`. Nunca `Introdução`, `Visão geral`, `Informações iniciais`.

### 7.1.4 Parágrafo de abertura

Estrutura em duas partes:
1. O que o aluno **não deve** fazer (`não foi criada para você decorar...`)
2. O que ele **deve** conseguir fazer (`foi criada para você olhar e separar...`)

Termos centrais em **negrito**. Linguagem direta, sem explicações longas.

### 7.1.5 Grade de 4 cards de preparação

Mesma largura e altura. Sem ícones. Fundo branco, borda `#E5E0D7`, cantos arredondados, padding confortável, etiqueta superior em dourado maiúsculo, conteúdo em preto e negrito.

| Card | Etiqueta | Regra de escrita | Exemplo |
|------|----------|------------------|---------|
| Objetivo | `OBJETIVO` | Verbo de ação (`explicar`, `diferenciar`, `interpretar`, `reconhecer`, `relacionar`, `aplicar`, `classificar`) + aplicação prática | `Explicar etiologia e fatores de risco e aplicá-los ao raciocínio clínico.` |
| Pré-requisitos | `PRÉ-REQUISITOS` | Tranquilizadora **e** precisa. Explicar o mínimo — nunca só `Nenhum.` | `Nenhum conteúdo avançado. Basta reconhecer que doença altera estrutura e função.` |
| Tempo | `TEMPO` | Duração + formato + possibilidade de divisão | `35–45 minutos, divididos em blocos curtos.` |
| Critério de domínio | `CRITÉRIO DE DOMÍNIO` | Ação **observável**. Nunca `entender o conteúdo`, `concluir a aula`, `assistir à explicação` | `Classificar corretamente os dados de um caso sem confundir causa com consequência.` |

### 7.1.6 Cards Compreender × Memorizar

Dois cards maiores lado a lado. Divisão obrigatória em todos os módulos; conteúdo interno muda com o assunto.

| Card | Contém | Escrita |
|------|--------|---------|
| Você precisa compreender | Relações, mecanismos, porquês, aplicação | Frases completas e relacionais (`X interage com Y`, `A altera B`) |
| Você precisa memorizar | Termos, categorias, definições, distinções | Curta e declarativa (`termo = definição`, `X × Y`) |

### 7.1.7 Caixa "Regra-mãe da nota"

Fecha a página. Largura total.

- Fundo bege-claro · borda ou faixa lateral dourada · cantos arredondados · título em negrito · corpo em frases curtas

**Estilo de escrita — paralelismo:**

```
Conceito A explica...
Conceito B altera...
Conceito C mostra...
```

Curta, memorável, ritmada, conceitualmente precisa, aplicável ao restante da nota.

### 7.1.8 O que NÃO colocar

Explicação completa, questões, caso clínico detalhado, textos fixos de outros módulos.

---

## 7.2 ABA — Explicação do zero

**Papel pedagógico:** Aula teórica principal. Progressiva, acessível, permite avançar um conceito por vez, ler ou ouvir, revisar por bloco.

### 7.2.1 Cabeçalho da área

- Etiqueta `Explicação do zero` — azul sobre fundo azul-claro (`#EAF2FF`)
- Título serifado grande. Ex: `Construa o raciocínio em seis blocos` — usa verbo de construção
- Descrição sans-serif cinza-escuro. É **instrução de uso**, não introdução temática. Ex: `Avance um bloco de cada vez. Ao final de cada explicação, use a revisão para ler ou ouvir antes de seguir.`

### 7.2.2 Estrutura de cada bloco (obrigatória)

```
[nº] Número (quadrado preto, texto branco, cantos arredondados, tamanho constante)
     Título conceitual (serifado, uma ideia central)
     Subtítulo (sans-serif cinza, orientação ou regra mental)
     Corpo da explicação
     Elemento complementar (chips com setas, caixa azul) — opcional
     ─── divisor tracejado ───
     Botões `Revisão para ler` + `Revisão para ouvir`
```

### 7.2.3 Regra de título do bloco

Três formatos aceitos:

| Formato | Exemplo |
|---------|---------|
| Pergunta central | `O que é um fator de risco?` |
| Ação de raciocínio | `Como classificar as causas` |
| Ideia organizadora | `A primeira pergunta da Patologia` |

Evitar termos isolados (`Etiologia`) — o título indica a **função** do conceito no raciocínio.

### 7.2.4 Regra de corpo

- Parágrafos curtos com espaçamento amplo
- Linguagem médica correta, acessível
- Termos centrais em **negrito**; itálico só para relações semânticas
- Comparação entre conceitos, exemplos clínicos simples, causa → consequência
- Lógica-padrão: `Definição → Diferença → Aplicação → Exemplo → Síntese`

### 7.2.5 Sequência visual de conceitos (chips + setas)

Aparece quando um parágrafo abstrato pode virar cadeia lógica.

- Chips bege-claro · texto preto e forte · setas cinza · alinhamento horizontal
- Responsivo: quebra de linha, nunca rolagem horizontal

Ex: `Etiologia → patogênese → alterações moleculares e celulares → morfologia → manifestação clínica`

### 7.2.6 Caixa informativa azul

Para checklist, síntese operacional, regra prática ou lista de consulta rápida.

- Fundo azul muito claro (`#EAF2FF`) · faixa lateral azul forte · cantos arredondados · título em negrito · corpo compacto · largura total do card
- Azul = informação estrutural e orientação

### 7.2.7 Botões de revisão (por bloco)

| Botão | Estilo | Papel |
|-------|--------|-------|
| `Revisão para ler` | Fundo branco, borda clara, texto preto, ícone de documento | Ação secundária |
| `Revisão para ouvir` | Fundo preto, texto branco, ícone de reprodução | Contraste maior |

Cada botão abre **somente** a síntese do bloco correspondente.

### 7.2.8 Divisor antes das ações

Linha pontilhada/tracejada entre corpo e botões. Separa explicação e revisão, evita que botões pareçam parte do texto.

### 7.2.9 Regra de densidade

Um bloco = uma pergunta ou conceito central. Nunca bloco muito longo com vários assuntos. Se precisar de mais etapas, dividir em `conceito-base → classificação → diferença → interação → aplicação → síntese`. Número total de blocos varia conforme o assunto e aparece no título do cabeçalho.

### 7.2.10 Responsivo

Desktop: cards largos e verticais. Mobile: preserva o card; fluxos e chips quebram linha.

---

## 7.3 ABA — Entender × memorizar

**Papel pedagógico:** Síntese estruturada por **profundidade cognitiva**. Não é resumo genérico. Responde: o que compreender, o que memorizar, o que cai em prova, o que é aprofundamento, qual habilidade a banca testa.

### 7.3.1 Cabeçalho

- Etiqueta `Entender × memorizar` — bege ou dourado-claro, texto dourado-escuro
- Título serifado grande. Ex: `O que precisa ficar na sua cabeça` — linguagem direta com o aluno

### 7.3.2 Grade 2×2

```
┌─────────────────────────────────┬─────────────────────────────────┐
│ Compreenda — não apenas decore  │ Memorize sem hesitar            │
├─────────────────────────────────┼─────────────────────────────────┤
│ Essencial para a prova          │ Aprofundamento                  │
└─────────────────────────────────┴─────────────────────────────────┘
```

Alturas visualmente equilibradas no desktop. Mobile: coluna única na mesma ordem.

### 7.3.3 Especificação dos 4 cards

| Card | Fundo | Borda | Contém | Estilo de escrita |
|------|-------|-------|--------|-------------------|
| Compreenda — não apenas decore | Creme muito claro | Dourada | Relações que o aluno explica com as próprias palavras | Frases completas (`X interage com Y`) |
| Memorize sem hesitar | Branco | Clara | Termos, definições, classificações | Curta e declarativa (`termo = definição`, `X × Y`) |
| Essencial para a prova | Creme | Dourada | Pegadinhas, distinções, decisões, erros de interpretação | Frases que evitam determinismo |
| Aprofundamento | Azul-claro (`#EAF2FF`) | Azul suave | Conceitos adicionais (temporalidade, dose–resposta, plausibilidade, etc.) | Enriquecem sem serem primeiro nível |

Título serifado em todos. Corpo em lista com bullets (creme/dourado) ou lista direta (branco).

### 7.3.4 Hierarquia das cores (fixa entre módulos)

| Cor | Papel |
|-----|-------|
| Creme + dourado | Central + prova |
| Branco | Informação objetiva |
| Azul-claro | Aprofundamento |

### 7.3.5 Caixa "O que a banca quer saber"

Fecha a página. Largura total abaixo da grade.

- Fundo azul-claro · faixa lateral azul · título em negrito · texto direto

Traduz o conteúdo em **habilidade de avaliação**. Responde `Qual operação mental a questão está testando?`. **Não repete** os conceitos dos cards.

### 7.3.6 Regra de separação

Cada card tem função clara e não invade os outros:
- Compreender = relações · Memorizar = termos · Essencial para a prova = pegadinhas (não repete Memorizar) · Aprofundamento = conceitos adicionais

---

## 7.4 ABA — Raciocínio clínico

**Papel pedagógico:** Transforma teoria em interpretação de caso. Ensina a reconhecer síndrome, identificar terreno, separar doença de base × gatilho, construir mecanismo, interpretar dados, comparar diferenciais, responder em sequência, corrigir erros, consultar explicação final. Área mais extensa e aplicada do módulo.

### 7.4.1 Sequência da página (topo → base)

```
Abertura azul-clara
→ Caixa "O que você precisa fazer aqui"
→ Cards de vocabulário clínico (6)
→ Card escuro do caso + subcards Reconhecer/Explicar/Conduzir
→ 1. Primeiro, traduza o caso (8 cards de tradução)
→ 2. O que cada dado significa (cards de interpretação)
→ 3. Ligue o mecanismo ao paciente (blocos vermelho, brancos, verde + aviso)
→ 4. Com o que este quadro pode ser confundido (accordions)
→ 5. Perguntas para organizar o raciocínio (accordions com "No caso" e "Na prova")
→ 6. Erros comuns de quem está começando (cards vermelho-claros)
→ Bloco Explicação do professor
→ Base editorial
```

### 7.4.2 Abertura da área

Container azul-claro, borda azul suave, cantos amplos, padding generoso, largura central controlada.

- Etiqueta azul de nível curricular. Ex: `RACIOCÍNIO CLÍNICO PARA O CICLO BÁSICO`
- Título serifado grande — **padrão de transformação**: `Do [ponto inicial] ao [desfecho]: [ação]`. Ex: `Do risco crônico ao infarto: aprenda a pensar o caso inteiro`
- Descrição sans-serif informando sequência completa (chegada → mecanismo → prioridade → prevenção)

### 7.4.3 Caixa "O que você precisa fazer aqui"

Fundo azul ainda mais claro, borda azul, cantos arredondados, título azul-escuro, corpo cinza.

Delimita escopo pedagógico e evita virar prescrição/protocolo. No Ciclo Básico, prioridade é compreender mecanismo — não executar conduta.

### 7.4.4 Cards de vocabulário clínico (6, fixos)

`Achado clínico` · `Fator de risco` · `Mecanismo` · `Manifestação` · `Exame complementar` · `Conduta`

- Termo em dourado · definição em uma única frase · fundo branco · borda azul-clara · cantos arredondados
- Grade 3×2 no desktop

### 7.4.5 Card principal do caso clínico

Bloco editorial escuro.

- Fundo `#081321` · cantos arredondados · padding grande · contraste elevado
- Etiqueta: `CASO PARA INTEGRAR A BASE`
- Título/primeiro parágrafo grande e serifado, branco · dados complementares em cinza-claro · leitura contínua

**Ordem clínica narrativa (não lista solta):**
`Identificação → Fatores de risco → Queixa e duração → Sintomas → Sinais vitais → Exame → Imagem/anatomia → Biomarcador`

**Subcards Reconhecer · Explicar · Conduzir** (dentro do card escuro, empilhados):
- Fundo escuro ligeiramente mais claro · borda cinza · título branco negrito · descrição cinza-clara
- Reconhecer = síndrome/situação · Explicar = cadeia fisiopatológica · Conduzir = lógica das prioridades (nunca protocolo)

### 7.4.6 Seção 1 — Primeiro, traduza o caso

Número `1` em quadrado preto · título serifado · descrição: `Separe o enunciado em uma sequência simples: causa provável → mecanismo → alteração → manifestação.`

**8 cards de tradução, ordem obrigatória:**
`Síndrome clínica → Terreno de risco → Doença de base → Gatilho agudo → Mecanismo imediato → Lesão celular → Manifestação e prova → Causa completa`

- Card: número em azul-claro · título em negrito · explicação · fundo branco · borda bege-clara · grid interno (número · título · explicação)
- Cada explicação: cita o dado do caso, explica significado, posiciona na cadeia causal, diferencia das outras etapas
- **Card 8 (Causa completa):** integra `suscetibilidade + exposição + doença de base + gatilho + mecanismo + dano`. A etiologia completa é multifatorial e composta.

### 7.4.7 Seção 2 — O que cada dado significa

Número `2` · descrição: `Não decore a pista isolada. Pergunte qual mecanismo ela apoia e qual hipótese ela torna menos provável.`

**Estrutura dos cards:**
- Categoria em dourado, caixa alta (`SINTOMA`, `CONTEXTO`, `ELETROCARDIOGRAMA`, `BIOMARCADOR`, `ANATOMIA`, `PATOLOGIA`)
- Dado específico em negrito
- Interpretação em texto regular
- Fundo branco · borda clara · cantos arredondados · empilhados · padding amplo

**Regra de escrita — evitar determinismo:**
`Este dado aumenta a suspeita de...` · `Este dado localiza...` · `Este dado confirma lesão, mas não define sozinho...` · `Este dado precisa ser relacionado com...`

### 7.4.8 Seção 3 — Ligue o mecanismo ao paciente

Número `3` · descrição: `Leia a sequência como uma explicação de fisiopatologia. As decisões clínicas aparecem apenas para mostrar por que o mecanismo importa.`

| Bloco | Fundo | Borda | Título | Representa |
|-------|-------|-------|--------|-----------|
| Vermelho (prioridade imediata) | Vermelho muito claro | Vermelha | Vermelho-escuro | Urgência, risco, dano em progressão |
| Branco (mecanismo/complicações) | Branco | Clara | Preto | Lógica fisiopatológica |
| Verde (longo prazo) | `#E6F5EF` | Verde | Verde-escuro | Prevenção, controle crônico |

**Aviso de limite educacional** (obrigatório em qualquer menção de conduta):

Caixa fina neutra, fundo branco/cinza claro, borda discreta, texto menor:

> No Ciclo Básico, sua meta é explicar a relação causal. Não use este bloco como prescrição ou protocolo de atendimento.

### 7.4.9 Seção 4 — Com o que este quadro pode ser confundido

Número `4` · título serifado · descrição orientadora.

Lista de itens em accordion (triângulo lateral). Cada item abre individualmente e destaca a distinção que muda a resposta.

### 7.4.10 Seção 5 — Perguntas para organizar o raciocínio

Introdução: `Abra uma por vez. Responda antes de ler "No caso" e "Na prova".`

**Estado fechado:** card branco · borda clara · seta lateral · título em negrito.
**Estado aberto:** pergunta + orientação + caixa `No caso` + caixa `Na prova`.

| Campo | Contém |
|-------|--------|
| No caso | Aplicação específica ao caso apresentado |
| Na prova | Como o raciocínio aparece em questão, qual pista observar, qual erro evitar |

### 7.4.11 Seção 6 — Erros comuns

Número `6` · descrição: `O objetivo não é cobrar experiência clínica; é impedir que termos parecidos desmontem a sequência causal.`

- Fundo vermelho extremamente claro · borda vermelha suave · título vermelho-escuro · corpo cinza-escuro · cards empilhados
- **Regra de título:** formato declarativo direto `X não é Y.` (Ex: `Fator de risco não é diagnóstico`, `Placa grave não é sinônimo de placa culpada`)
- Estrutura interna: `Afirmação que corrige → Explicação do motivo → Consequência correta para o raciocínio`

### 7.4.12 Bloco "Explicação do professor"

- Fundo creme · borda dourada · cantos arredondados · título serifado
- Texto: `Leia a síntese depois de tentar reconstruir o caso com suas palavras.`
- Botão `Abrir explicação` (fundo claro, borda, texto preto) · Botão `Ouvir explicação` (fundo preto, texto branco)

Só deve ser consultado **depois** da tentativa ativa.

### 7.4.13 Base editorial

Caixa neutra ao final. Fundo cinza muito claro · borda discreta · texto menor · título inicial em negrito. Informa referências, livros-base e limites editoriais sem competir com o estudo.

### 7.4.14 Sistema de cores da aba (fixo)

| Cor | Papel |
|-----|-------|
| Azul-claro | Orientação, estrutura, conceito |
| Azul-marinho | Caso principal, imersão clínica |
| Dourado | Categorias, identificação editorial |
| Vermelho-claro | Urgência, risco, erro conceitual |
| Verde-claro | Prevenção, proteção, longo prazo |
| Branco | Explicação neutra, desenvolvimento do raciocínio |

### 7.4.15 Padrão central de cada dado clínico

```
Dado observado → O que representa → Qual mecanismo apoia → O que não prova sozinho → Como aparece em questão
```

### 7.4.16 Estilos de escrita por seção

Caso = narrativo · Etapas = analítico · Dados = interpretativo · Mecanismos = causal · Diferenciais = comparativo · Accordions = interrogativo · Erros = corretivo · Explicação do professor = sintético.

### 7.4.17 Responsivo

Desktop: cards largos, leitura vertical. Mobile: grades viram coluna única, accordions acessíveis por toque.

### 7.4.18 O que NÃO reutilizar entre módulos

Caso específico (infarto, etc.), números fixos de etapas/dados/diferenciais/perguntas, menções de tratamento sem aviso educacional. A estrutura geral permanece; o conteúdo é sempre do módulo atual.

---

## 7.5 ABA — O que confunde

**Descrição do botão (comportamento do +):** Ao clicar no `+` ao lado de cada palavra do glossário, o sistema abre o conteúdo daquele termo e mostra o que ele significa e como se aplica ao tema estudado. Quando aberto, o `+` vira um botão preto `−`. **Vários termos podem permanecer abertos ao mesmo tempo** — abrir um não fecha os demais.

**Papel pedagógico:** evitar erros por confusão de conceitos com nomes parecidos. Área com duas funções: (1) trocas de conceitos que derrubam em prova; (2) glossário interativo.

### 7.5.0 Estrutura da página

```
Etiqueta vermelha → Título → Grade de cards comparativos → Caixa "Pegadinha de linguagem"
→ Divisor → Etiqueta dourada do glossário → Título e instrução → Accordions de termos → Caixa "Como usar"
```

Superfície: card branco grande, borda clara, cantos arredondados, padding amplo.

### 7.5.1 Parte 1 — Trocas de conceitos

**Etiqueta superior:** `O que costuma confundir` — pill, fundo rosa/vermelho muito claro, texto vermelho-escuro, sans-serif pequena, peso forte. **Vermelho = confusão conceitual.**

**Título:** serifado grande, preto, alinhamento à esquerda. Ex: `Trocas de conceito que derrubam em prova`.

**Grade de cards comparativos** (2 colunas desktop, 1 mobile):

| Elemento | Estilo |
|----------|--------|
| Título | Dois conceitos com `×`. Sans-serif, negrito |
| Descrição | Diferença decisiva, comparativa, curta. Cinza-escuro |
| Fundo | branco |
| Borda | bege/cinza muito clara |
| Cantos | arredondados |
| Ícones | nenhum |
| Altura | equilibrada entre os cards |

Padrões de escrita: `X é... Y é...` · `X aumenta... Y determina...` · `X pode ocorrer sem... Y envolve...`.

Exemplos observados (Etiologia): `Etiologia × patogênese`, `Causa × fator de risco`, `Doença de base × gatilho`, `Genético × hereditário`, `Congênito × genético`, `Idiopático × "sem causa"`, `Iatrogênico × erro médico`, `Associação × causalidade`. Em outro módulo os pares mudam — estrutura visual permanece.

**Caixa "Pegadinha de linguagem":** fundo rosa/vermelho muito claro, faixa lateral vermelha, cantos arredondados, largura total, título preto negrito. Alerta para absolutos (`todo`, `sempre`, `nunca`, `necessariamente`, `exclui completamente`, `determina sozinho`).

### 7.5.2 Parte 2 — Glossário do tema

Separado da Parte 1 por espaço vertical amplo + divisor horizontal + nova etiqueta + novo título.

**Etiqueta:** `Glossário do tema` — pill, fundo bege/dourado-claro, texto dourado-escuro, pequena, peso forte.

**Título:** serifado grande. Ex: `Palavras que você precisa entender para não se perder`.

**Descrição:** `Abra os termos que apareceram nesta parte da nota. A definição vem em linguagem médica compreensível e com um exemplo aplicado ao conteúdo.`

**Grade de termos:** 2 colunas desktop, 1 mobile.

**Estado fechado:**
```
Nome do termo                                       +
```

- Fundo branco · borda clara · cantos arredondados · altura compacta · nome em negrito
- Botão `+` alinhado à direita, fundo bege muito claro, símbolo preto

**Estado aberto:**
```
Nome do termo                                       −
─────────────────────────────────────────────────────
O que significa: [definição geral]
Neste tema: [aplicação específica ao conteúdo]
```

- Botão `−` fundo preto, símbolo branco, mesma posição do `+`
- Divisor horizontal entre cabeçalho e conteúdo
- Rótulos `O que significa` e `Neste tema` em dourado-escuro e negrito
- Corpo em cinza-escuro, parágrafos curtos, entrelinha confortável

**Comportamento dos accordions:**
- Abertura e fechamento independentes
- Múltiplos abertos ao mesmo tempo
- Posição de cada card preservada na grade
- Cards de colunas diferentes não precisam ter mesma altura, mas grade continua alinhada

**Caixa final "Como usar":** fundo bege muito claro, faixa lateral dourada, cantos arredondados, largura total, texto pequeno, título inicial em negrito. Ex: `Como usar: sempre que uma alternativa empregar uma palavra que você não domina, volte ao glossário antes de decorar a resposta.`

### 7.5.3 Regra de conteúdo entre as partes

| Bloco | Papel |
|-------|-------|
| Comparações | Mostram a diferença decisiva |
| Glossário | Define o termo e aplica ao tema |
| Pegadinha de linguagem | Mostra como a banca distorce o conceito |
| Como usar | Ensina quando consultar o glossário |

### 7.5.4 Regras

- Termos e comparações mudam por módulo — nunca reutilizar os de Etiologia como fixos
- Não fechar automaticamente um termo ao abrir outro
- Manter etiqueta vermelha na Parte 1 (vermelho = confusão) e dourada no glossário (dourado = editorial)

---

## 7.6 ABA — Questões

**Papel pedagógico:** transforma conteúdo em sistema completo de treino, correção e revisão. Cada questão é teste + registro de confiança + diagnóstico do erro + explicação das alternativas + pegadinhas + mini revisão. **O erro não encerra — abre nova parte pedagógica.**

### 7.6.0 Estrutura da página

```
Escolha do tipo de treino
→ Card da questão (cabeçalho + enunciado + alternativas + badge)
→ Registro de confiança
→ Botão "Corrigir questão"
→ Mensagem de acerto/erro
→ Gabarito comentado alternativa por alternativa
→ 5 pegadinhas (accordions com 3 colunas)
→ Dica para gabaritar
→ Base editorial
→ Card "Revisão do conteúdo" (ler + ouvir)
→ Próxima questão abaixo (fluxo vertical)
```

### 7.6.1 Escolha do tipo de treino

Container grande bege muito claro. Etiqueta `SEU PRÓXIMO PASSO` dourada. Título serifado (`Escolha como você quer treinar agora`). Descrição sans-serif.

**Duas rotas lado a lado:**

| Rota | Número | Etiqueta | Título | Badge | Ação | Cor |
|------|--------|----------|--------|-------|------|-----|
| 1 (Fixação teórica) | `01` | `PARA FIRMAR A BASE` | `Fixar o conteúdo` | `30 questões` | `Começar pela teoria →` | Dourado (check dourado no canto quando selecionada) |
| 2 (Casos clínicos) | `02` | `PARA PENSAR COMO NA PROVA` | `Resolver casos clínicos` | `30 casos` | `Treinar raciocínio clínico →` | Azul |

**Selecionada:** borda dourada, fundo creme, número em card dourado-claro, contraste maior. **Não selecionada:** fundo branco, borda clara, número azul-claro.

**Limite:** não presumir que a estrutura interna dos casos clínicos é idêntica à fixação teórica sem referência.

### 7.6.2 Card da questão

**Cabeçalho:**
```
QUESTÃO 01                                FIXAÇÃO TEÓRICA
```
Número em azul caixa alta peso forte · categoria como badge cinza-claro, letras espaçadas.

**Enunciado:** sans-serif, preto, negrito, tamanho médio, alinhado à esquerda, separado dos metadados por espaço.

**Alternativas A–E:**
- Fundo branco · borda clara · cantos arredondados · padding · letra em negrito · texto preto
- **Linha inteira clicável** · quebra interna preserva alinhamento da letra
- Espaço regular entre alternativas

**Badge do padrão editorial da questão** (chip amarelo, pill, borda dourada, texto dourado-escuro pequeno):
`Padrão NeuroFix: fixação teórica · A–E comentadas · 5 pegadinhas · aula rápida`

### 7.6.3 Registro de confiança (obrigatório)

Título: `ANTES DE VER O GABARITO, REGISTRE SUA CONFIANÇA` (caixa alta, dourado-escuro, peso forte, espaçamento entre letras).

**Três cards lado a lado, mesma largura:**

| Opção | Subtexto |
|-------|----------|
| `Chutei` | `não consigo justificar` |
| `Fiquei em dúvida` | `eliminei, mas hesitei` |
| `Tenho certeza` | `consigo explicar por quê` |

**Não selecionado:** fundo branco, borda clara, texto preto, descrição cinza.
**Selecionado:** fundo escuro (preto/cinza-escuro), título branco, descrição cinza-clara, contraste elevado.

**Regra:** somente uma opção selecionada por questão.

### 7.6.4 Botão "Corrigir questão"

Fundo preto, texto branco, peso forte, cantos arredondados, alinhado à esquerda, largura ajustada ao conteúdo.

**Desabilitado até:** alternativa selecionada **E** confiança marcada.

### 7.6.5 Mensagem de resultado

Erro (exemplo): fundo vermelho muito claro, texto vermelho-escuro, ícone `X` vermelho, cantos arredondados, largura total.

> **Você errou, mas agora vai aprender também pelas alternativas.**
> Leia cada alternativa até compreender o conceito que ela testa e o motivo exato da eliminação.

**Tom:** nunca punitivo. Reconhece erro e converte em atividade de aprendizagem.

### 7.6.6 Gabarito comentado

Título: `Gabarito comentado`. Descrição: `Use esta etapa como parte do estudo: cada alternativa explica o conteúdo, mostra a confusão explorada pela banca e ensina um critério para questões semelhantes.`

**Estrutura de cada alternativa (card independente):**

```
[Letra] Alternativa X · Correta/Errada          [Badge do tema]
────────────────────────────────────────────────────────────
Explicação completa (5 passos abaixo)
────────────────────────────────────────────────────────────
Caixa "O que você precisa aprender aqui"
Caixa "Como reconhecer ou eliminar na prova"
```

**Cabeçalho:** letra em quadrado pequeno · título em negrito · badge do tema em bege pill · alinhamento horizontal.

**Explicação principal (5 passos obrigatórios):**
1. Cita o erro conceitual
2. Identifica a troca realizada
3. Apresenta a versão correta
4. Relaciona a alternativa ao enunciado
5. Explica em qual ponto deve ser eliminada

**Caixa "O que você precisa aprender aqui":** fundo bege/cinza muito claro, borda clara, título caixa alta dourado-escuro. Extrai regra conceitual da alternativa.

**Caixa "Como reconhecer ou eliminar na prova":** fundo amarelo muito claro, borda dourada, título caixa alta dourado-escuro. Estratégia prática de resolução.

**Estados visuais:**

| Estado | Fundo | Borda | Ícone |
|--------|-------|-------|-------|
| Errada, não escolhida | branco | clara | neutra |
| Correta | verde muito claro | verde | check branco em quadrado verde |
| Errada, escolhida pelo aluno | vermelho muito claro | vermelha | `X` branco em quadrado vermelho |

### 7.6.7 Cinco pegadinhas sobre o conteúdo

Grande seção amarela após alternativas comentadas.

**Cabeçalho:** título `5 PEGADINHAS SOBRE O CONTEÚDO DESTA QUESTÃO` (caixa alta) · descrição · badge `Tema cobrado: [tema]` · fundo amarelo-claro · borda dourada · ícone de alerta.

**Accordions numerados (5).** Estado fechado:
```
[nº] Pegadinha de prova X · Título                       +
```
Fundo branco · borda dourada muito clara · número em quadrado amarelo · título em negrito · botão `+` em círculo bege.

**Estado aberto** — 3 colunas:

| Coluna | Etiqueta | Fundo | Conteúdo |
|--------|----------|-------|----------|
| Erro | vermelha | rosa muito claro | Formulação enganosa da banca |
| Versão verdadeira | verde | verde muito claro | Correção conceitual |
| Mini revisão | azul | azul muito claro | Síntese curta para recuperação futura |

**Comportamento:** múltiplas pegadinhas abertas simultaneamente.

### 7.6.8 Dica final para gabaritar

Fundo amarelo muito claro, borda dourada, título caixa alta, texto direto, largura total.

Ex: `DICA PARA GABARITAR QUESTÕES SOBRE ETIOLOGIA E PATOGÊNESE — Pergunte: por que surgiu? Etiologia. Como se desenvolveu? Patogênese.`

### 7.6.9 Base editorial e revisão

**Base editorial:** linha discreta, texto pequeno cinza, baixo contraste, não ocupa atenção principal.

**Card "Revisão do conteúdo":** fundo preto, texto branco, cantos arredondados, layout horizontal (explicação à esquerda, botões à direita).
- Título: `Revisão do conteúdo`
- Descrição: `Uma explicação escrita, em linguagem de professor, para compreender o tema, fixar o raciocínio e reconhecer o mesmo conteúdo em outras questões.`
- Ações: `Revisão para ler` e `Revisão para ouvir` (ambos brancos com texto preto)

### 7.6.10 Continuação das questões

Próxima questão começa abaixo mantendo `número → categoria → enunciado → alternativas → confiança → correção → gabarito → pegadinhas → revisão`.

**Regra:** conteúdo expandido da questão anterior **permanece no fluxo vertical** — a próxima questão não substitui a anterior na mesma área.

### 7.6.11 Estilos de escrita por etapa

Enunciado = direto/avaliativo · Alternativas = plausíveis e próximas · Confiança = pessoal/autorreflexiva · Mensagem de erro = acolhedora/educativa · Gabarito = analítico/detalhado · Pegadinhas = corretivo/comparativo · Mini revisão = curta/recuperável · Dica final = memorável/aplicável.

### 7.6.12 Componentes sugeridos

`TrainingModeSelector` · `TrainingModeCard` · `QuestionCard` · `QuestionMetadata` · `AnswerOption` · `ConfidenceSelector` · `ConfidenceOption` · `CorrectQuestionButton` · `FeedbackBanner` · `CommentedAnswerSection` · `CommentedAlternativeCard` · `LearningTakeawayBox` · `ExamEliminationBox` · `QuestionTrapsPanel` · `TrapAccordion` · `TrapThreeColumnExplanation` · `QuestionFinalTip` · `EditorialSourcesLine` · `QuestionReviewBanner`

### 7.6.13 Responsivo

- Cards de modo de treino → empilhar em coluna
- Três opções de confiança → empilhar em coluna
- Três colunas das pegadinhas → sequência vertical
- Alternativa inteira permanece clicável (área de toque confortável)

### 7.6.14 Regras invioláveis

- Habilitar `Corrigir questão` só após alternativa **e** confiança marcadas
- Múltiplas pegadinhas abertas simultaneamente (não fechar ao abrir outra)
- Próxima questão não substitui a anterior — fluxo vertical
- Nada de textos fixos de Etiologia em outros módulos

---

## 7.7 ABA — Flashcards

**Descrição do botão:** Sistema de **recuperação ativa** com um cartão por vez. O aluno tenta responder antes de virar, depois classifica a própria lembrança em `Errei` · `Difícil` · `Lembrei` · `Dominei`. A classificação alimenta indicadores de progresso.

**Ideia central:** `O objetivo não é apenas reconhecer a resposta, mas recuperá-la sem consultar.`

### 7.7.0 Estrutura da página

```
Cabeçalho (etiqueta + título + descrição + contador total preto)
→ Faixa "Como estudar"
→ 4 indicadores de desempenho
→ Posição atual "X de Y" + barra de progresso
→ Flashcard (frente branca → verso azul-marinho)
→ Navegação (Anterior · Virar cartão · Próximo)
→ Classificação (Errei · Difícil · Lembrei · Dominei)
→ Mapa segmentado
→ Base editorial
```

Superfície: card branco · borda clara · cantos arredondados · padding amplo · largura central controlada · fundo bege muito claro.

### 7.7.1 Cabeçalho

**Etiqueta:** `Recuperação ativa` — pill · fundo verde muito claro (`#E6F5EF`) · texto verde-escuro · sans-serif pequena peso forte.

**Título:** serifado grande preto. Formato `[quantidade] flashcards para dominar [nome do tema]`. Ex: `40 flashcards para dominar Etiologia e fatores de risco`.

**Descrição:** `Responda antes de virar. Os cartões seguem uma sequência única para revisar, recuperar e aplicar o conteúdo estudado.` Explicita: (1) responder antes de virar; (2) ordem pedagógica (revisão → recuperação → aplicação), nunca aleatória.

**Contador total (card à direita):** fundo preto · número grande branco fonte serifada · descrição menor branco · alinhamento central. Ex:
```
40
cartões do tema
```

### 7.7.2 Faixa "Como estudar"

Fundo bege/dourado muito claro · faixa lateral dourada · cantos arredondados · largura total · título inicial em negrito.

Texto: `Como estudar: tente responder em voz alta, vire o cartão e classifique sua lembrança. O objetivo não é apenas reconhecer a resposta, mas recuperá-la sem consultar.`

Fluxo: tentar responder → virar → comparar → classificar.

### 7.7.3 Indicadores de desempenho (4 cards horizontais)

| Indicador | O que mede | Início | Atualização |
|-----------|-----------|--------|-------------|
| Respondidos | Cartões já classificados | `0` | +1 a cada classificação |
| Precisam voltar | `Errei` + `Difícil` | `0` | automática |
| Dominados | `Dominei` | `0` | automática |
| Padrão da nota | Total previsto (completude editorial) | `40/40` | não muda com o uso |

Cada card: fundo branco · borda clara · cantos arredondados · número preto negrito · descrição pequena cinza · 4 colunas de mesma largura. **Padrão da nota** = disponibilidade editorial, não progresso do usuário.

### 7.7.4 Posição atual e barra de progresso

**Posição:** `1 de 40` (texto pequeno, peso forte, à esquerda do cartão).
**Barra:** trilho cinza/bege · preenchimento azul + dourado nos trechos avançados · cantos arredondados. Calculada com base na **posição atual**, não na quantidade dominada.

### 7.7.5 Flashcard — Frente

- Etiqueta `PERGUNTA` — dourado-escuro, caixa alta, pequena, canto superior esquerdo
- Pergunta central serifada, grande, preta, alinhamento central (vertical e horizontal), largura controlada
- Card: fundo branco · borda bege-clara · cantos amplos · sombra discreta · altura elevada
- Orientação inferior: `Pense antes de virar` (pequeno, cinza, centro inferior)

### 7.7.6 Flashcard — Verso

Toda a superfície muda para escuro.

- Etiqueta `RESPOSTA` — dourado, caixa alta, canto superior esquerdo
- Resposta serifada, branco, grande, alinhamento central, entrelinha confortável, largura limitada
- Fundo azul-marinho quase preto (`#081321`) · cantos arredondados · contraste elevado
- Orientação inferior: `Classifique sua lembrança abaixo`

### 7.7.7 Navegação

| Botão | Estilo |
|-------|--------|
| `Anterior` | Fundo branco · borda clara · texto preto peso forte · cantos arredondados · largura menor |
| `Virar cartão` | Fundo preto · texto branco peso forte · cantos arredondados · ocupa maior parte da linha |
| `Próximo` | Fundo branco · borda clara · texto preto peso forte · cantos arredondados · largura menor |

**Regras:**
- Primeiro cartão: `Anterior` desabilitado
- Último cartão: `Próximo` desabilitado
- Ao clicar `Virar cartão`: pergunta → resposta, fundo branco → azul-marinho, `PERGUNTA` → `RESPOSTA`
- **O aluno não pode classificar antes de virar o cartão**

### 7.7.8 Classificação da lembrança (4 botões, mesma largura)

| Botão | Borda | Texto | Significado |
|-------|-------|-------|-------------|
| `Errei` | vermelha | vermelho-escuro | Não recuperou/respondeu errado — entra em "Precisam voltar" |
| `Difícil` | dourada | dourado-escuro | Lembrou parcialmente — volta antes dos dominados |
| `Lembrei` | azul | azul | Recuperou adequadamente, ainda não consolidado |
| `Dominei` | verde | verde | Respondeu com segurança |

Todos com fundo branco.

**Após classificar:**
- Contador `Respondidos` +1
- Segmento correspondente no mapa recebe a cor
- `Precisam voltar` ou `Dominados` atualizam
- Sistema avança automaticamente **ou** aguarda `Próximo` (conforme lógica do projeto)
- Classificação fica **registrada** ao retornar ao cartão

### 7.7.9 Mapa segmentado

- Cada cartão = pequena barra horizontal
- Distribuídos em duas linhas
- Não respondido: cinza · Respondido: cor da classificação (vermelho/dourado/azul/verde)
- Cartão atual pode receber destaque adicional

### 7.7.10 Base editorial

Faixa clara ao final. Fundo bege/cinza muito claro · texto pequeno baixo contraste · título inicial em negrito · cantos arredondados. Ex: `Base editorial: Robbins Patologia Básica; Robbins & Cotran; Reisner. Conteúdo autoral NeuroFix estruturado para recuperação ativa e aplicação em provas.`

### 7.7.11 Estilo de escrita dos cartões

**Perguntas:** curtas, diretas, um conceito por cartão, exigem recuperação, sem pistas excessivas.
**Respostas:** completas mas compactas (uma ou poucas frases), suficientes para explicar sem virar capítulo teórico.

### 7.7.12 Responsivo e regras invioláveis

- Empilhar/reorganizar Anterior · Virar · Próximo sem reduzir áreas de toque
- Mapa segmentado quebra em várias linhas
- Nunca habilitar classificação antes de virar
- Nunca sequência aleatória (ordem pedagógica é fixa)
- Nunca reutilizar flashcards de Etiologia como fixos em outros módulos

---

## 7.8 ABA — Véspera

**Papel pedagógico:** revisão ultrarrápida (~90 segundos), pensada para ser lida imediatamente antes da prova. Não há explicação longa, exercício ou aprofundamento — apenas termos essenciais + definições curtas.

### 7.8.0 Estrutura da página (um único card)

```
Etiqueta "Revisão de véspera"
→ Título com tema e duração
→ Lista de conceitos e definições (2 colunas, separadores pontilhados)
→ Regra de prova (última linha, apresenta uma ação)
```

**Sem interações.**

### 7.8.1 Card principal

Fundo creme ou bege muito claro · borda dourada · cantos arredondados · padding amplo · grande largura · sem sombras intensas. Dourado reforça síntese editorial importante.

### 7.8.2 Etiqueta

`Revisão de véspera` — pill · fundo dourado muito claro · texto dourado-escuro · pequena peso forte.

### 7.8.3 Título

Formato: `[Nome do tema] em [tempo estimado]`. Ex: `Etiologia e fatores de risco em 90 segundos`, `Inflamação aguda em 90 segundos`, `Lesão celular em 2 minutos`.

Serifado, grande, preto, alinhamento à esquerda. Tempo compatível com a quantidade real de conteúdo.

### 7.8.4 Lista de conceitos (2 colunas)

```
Termo (dourado-escuro)  | Definição resumida (preto)
```

**Coluna esquerda:** termo em dourado-escuro, sans-serif negrito, largura fixa, alinhamento à esquerda.
**Coluna direita:** definição em preto, linguagem direta, **uma frase por conceito**, sem parágrafos extensos.

**Separadores:** linha horizontal pontilhada/tracejada em dourado-claro entre cada linha. Organiza leitura, reforça formato de ficha.

**Termos observados (Etiologia):** `Etiologia` · `Patogênese` · `Fator de risco` · `Multifatorial` · `Modificável` · `Não modificável` · `Idiopático` · `Iatrogênico` · `Regra de prova`.

### 7.8.5 Estilo das definições

Frases curtas, ponto e vírgula quando necessário, oposição direta, sem exemplos longos, termos que o aluno já estudou. Exemplos:

- `Etiologia: Causas e fatores responsáveis pelo início e progressão da doença.`
- `Patogênese: Mecanismos que ligam a causa às alterações estruturais e funcionais.`
- `Fator de risco: Aumenta a probabilidade; não garante o desfecho.`

### 7.8.6 Regra de prova (última linha)

Apresenta uma **ação**, não uma definição. Ex: `Regra de prova: Classifique cada pista como causa, risco, gatilho, mecanismo ou consequência.`

Encerra a revisão com a operação mental central que o aluno deve usar na prova.

### 7.8.7 Regras invioláveis

A seção **NÃO deve**:
- Introduzir conceitos novos
- Conter explicações extensas ou citações longas
- Incluir questões completas
- Duplicar `Entender × memorizar`
- Exigir interação complexa

### 7.8.8 Responsivo

Mobile: termo acima da definição quando não houver largura; separadores preservados; sem rolagem horizontal.

---

## 7.9 ABA — Domínio e fontes

**Descrição do botão:** parte final de validação do módulo. Reúne (1) **critérios/ações** que demonstram domínio do conteúdo e (2) **livros, referências, padrão editorial e situação de revisão** da nota.

### 7.9.0 Estrutura da página

```
Parte 1 — Critérios de domínio (lista numerada)
→ Parte 2 — Base editorial desta nota (grade 2×2 de fontes)
→ Parte 3 — Status editorial (faixa dourada)
```

### 7.9.1 Observação sobre imagens de referência

As imagens começam **no meio** — só mostram os itens `4` e `5`. **Não inventar** os itens 1–3. Preservar dados existentes na aba; solicitar spec dos itens 1–3 quando necessário.

### 7.9.2 Parte 1 — Critérios de domínio

Lista de competências numeradas. Cada item:

```
[nº] Título (verbo de ação)
     Descrição observável
```

Card branco · borda clara · cantos arredondados · número em pequeno quadrado bege · título em negrito · descrição abaixo · layout horizontal · espaçamento vertical compacto.

**Verbos de ação aceitos:** `explicar`, `diferenciar`, `classificar`, `aplicar`, `resolver`, `reconhecer`, `evitar [confusão]`.

**Descrição obrigatoriamente observável.** Nunca vaga como `Entender o conteúdo`.

**Itens 4 e 5 observados:**
- `Aplicar` — `Resolver uma questão inédita com interação gene–ambiente.`
- `Evitar pegadinhas` — `Não confundir genético com hereditário, congênito ou determinístico.`

### 7.9.3 Parte 2 — Base editorial desta nota

**Título da seção:** `Base editorial desta nota` — serifado grande preto, alinhamento à esquerda, amplo espaço acima.

**Grade 2×2 de fontes.** Cada card:

```
Nome da fonte
Descrição de como ela foi utilizada
```

Fundo branco · borda bege-clara · cantos arredondados · padding amplo · título sans-serif negrito · descrição cinza-escuro · **mesma altura entre cards da mesma linha**.

**Fontes observadas (módulo Etiologia):**
- `Robbins Patologia Básica, 10ª edição` — `Introdução à Patologia no capítulo de lesão celular; distinção entre etiologia e patogênese; integração de causas genéticas e ambientais.`
- `Robbins & Cotran, 9ª edição` — `Fundamentos celulares, doenças genéticas, neoplasia e doenças ambientais como base para a classificação etiológica.`
- `Reisner — Patologia por estudos de casos` — `Fatores de risco como susceptibilidade, agentes etiológicos e conexão obrigatória com a condição do paciente.`
- `Padrão NeuroFix` — `Síntese autoral, linguagem progressiva, segmentação, recuperação ativa, questões e revisão. Revisão técnica profissional antes da publicação comercial.`

O card `Padrão NeuroFix` é **categoria diferente** dos cards bibliográficos — representa a organização pedagógica, autoria e processo de revisão.

**Regra de escrita:** cada card responde `Qual é a fonte? + Que parte do conteúdo ela fundamenta?`. Não basta a referência sem explicar a utilização.

### 7.9.4 Parte 3 — Status editorial

Faixa abaixo da grade. Fundo bege/dourado muito claro · faixa lateral dourada · cantos arredondados · título em negrito · texto preto · largura total.

**Exemplo observado:** `Status editorial — Conteúdo autoral concluído · referências registradas · revisão técnica formal pendente para selo de publicação.`

**Estados aceitos pelo componente:** `conteúdo em desenvolvimento` · `conteúdo autoral concluído` · `referências registradas` · `revisão técnica pendente` · `revisão técnica concluída` · `aprovado para publicação` · `conteúdo preservado` · `conteúdo reorganizado`.

**Regra crítica:** nunca marcar revisão técnica como concluída quando estiver pendente. Texto reflete o estado **real**.

### 7.9.5 Hierarquia visual entre as partes

| Parte | Papel |
|-------|-------|
| Critérios de domínio | O que o aluno deve conseguir fazer |
| Base editorial | De onde o conteúdo foi construído |
| Padrão NeuroFix | Como o conteúdo foi organizado |
| Status editorial | Em qual etapa de revisão está |

### 7.9.6 Estilo de escrita

Critérios = objetivo · Títulos das fontes = bibliográfico · Descrições = explicativo · Status = transparente. Nenhuma linguagem promocional; precisão sobre revisão e publicação.

### 7.9.7 Responsivo e regras invioláveis

- Mobile: critérios em coluna única · grade de fontes em coluna única · sem truncamento de títulos/descrições/status
- Nunca inventar critérios de domínio ausentes na referência
- Nunca reutilizar como fixas as fontes/descrições de Etiologia em outros módulos
- Nunca marcar revisão técnica concluída quando estiver pendente

---

## 7.10 DIFERENÇA ENTRE OS 3 ÚLTIMOS BOTÕES

| Botão | Função |
|-------|--------|
| Flashcards | Recuperar e classificar a lembrança |
| Véspera | Revisar rapidamente o núcleo do conteúdo |
| Domínio e fontes | Confirmar competências e consultar a base editorial |

---

## 8. COMPONENTES PADRONIZADOS

### AppShell
- `Sidebar` — `SidebarItem`
- `Topbar` — `Breadcrumb` — `GlobalSearch`

### Elementos editoriais
- `EditorialHero` — `SectionHeader` — `StatusBadge` — `MetadataChip`
- `PrimaryButton` — `SecondaryButton` — `ProgressBar`

### Página inicial
- `ContinueCard` — `DisciplineCard` — `StatsCard`

### Página de disciplina
- `GoldStandardBanner` — `CurriculumStrip`
- `DisciplineFilters` — `ModuleCard` — `MasterMap`
- `ComparisonChip` — `MicrotopicRow` — `FinalTestCard`

### Módulo
- `ModuleHero` — `LearningMethodHeader`
- `LearningPhaseSelector` — `ActivePhasePanel`
- `ModuleSectionTabs`

---

*Última atualização: 2026-07-23 — todas as 9 abas do módulo (7.1–7.9) expandidas com spec completa. 7.7 Flashcards (recuperação ativa, 4 classificações, mapa segmentado); 7.8 Véspera (revisão de 90s, 2 colunas com separadores dourados); 7.9 Domínio e fontes (critérios observáveis, grade 2×2 de fontes, status editorial variável).*
*Fonte visual: fotos do detalhamento inicial (páginas, módulo superior) + spec detalhada de cada uma das 9 abas.*
