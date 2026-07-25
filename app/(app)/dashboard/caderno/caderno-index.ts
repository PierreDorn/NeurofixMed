// Índice LEVE do bloco de notas — só nomes de matéria/tema/subtema.
// Usado pela árvore na Sidebar (todas as rotas de (app)), portanto
// precisa ser minúsculo. O conteúdo pesado (aula, resumo, questões...)
// vive em caderno-data.ts e só é carregado no dashboard via next/dynamic.

export type MateriaIndex = {
  nome: string;
  temas: { nome: string; subtemas: string[] }[];
};

export const cadernoIndex: MateriaIndex[] = [
  {
    nome: 'Patologia Médica',
    temas: [
      { nome: 'Helmintos', subtemas: ['Ascaris lumbricoides', 'Taenia solium'] },
      { nome: 'Hipersensibilidades', subtemas: ['Tipo I'] },
    ],
  },
  {
    nome: 'Fisiologia',
    temas: [
      { nome: 'Sistema Renina Angiotensina Aldosterona', subtemas: ['Visão geral'] },
    ],
  },
  {
    nome: 'Farmacologia',
    temas: [
      { nome: 'Anti-inflamatórios', subtemas: ['AINEs'] },
    ],
  },
  { nome: 'Anatomia', temas: [] },
  { nome: 'Semiologia', temas: [] },
  { nome: 'Medicina da Família', temas: [] },
];
