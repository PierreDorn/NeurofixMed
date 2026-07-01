import type { Discipline, FlashcardStat, SummaryItem, FlashItem } from './types';

export const DISCIPLINES: Record<string, Discipline> = {
  patologia: {
    name: 'Patologia', cycle: 'Ciclo básico',
    desc: 'Lesão celular, inflamação, reparo tecidual e bases das doenças.',
    topicos: 4, resumos: 22, questoes: 110, cards: 220,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 21h18"/><path d="M14 21v-5"/><path d="M9 3v9"/><path d="M14 3v4"/><path d="M7 5h8"/><circle cx="11" cy="14" r="3"/></svg>`,
    topics: [
      { title: 'Inflamação', subtopics: [
        { name: 'Inflamação Aguda', subs: ['Mediadores Químicos','Células Inflamatórias','Exsudato e Transudato','Sinais Cardinais'] },
        { name: 'Inflamação Crônica', subs: ['Características gerais','Células predominantes','Exemplos clínicos'] },
        { name: 'Granuloma', subs: ['Formação do granuloma','Granuloma caseoso','Granuloma não caseoso'] },
      ]},
      { title: 'Neoplasias', subtopics: [
        { name: 'Oncogênese', subs: ['Proto-oncogenes','Genes supressores de tumor','Instabilidade genômica'] },
        { name: 'Carcinogênese', subs: ['Agentes químicos','Agentes físicos','Vírus oncogênicos'] },
        { name: 'Classificação de tumores', subs: ['Tumores benignos','Tumores malignos','Grau e estadiamento'] },
      ]},
      { title: 'Lesão Celular', subtopics: [
        { name: 'Necrose', subs: ['Necrose coagulativa','Necrose liquefativa','Necrose caseosa','Gangrena'] },
        { name: 'Apoptose', subs: [] },
      ]},
      { title: 'Distúrbios Hemodinâmicos', subtopics: [
        { name: 'Edema', subs: ['Edema por aumento de pressão hidrostática','Edema por hipoproteinemia','Edema linfático'] },
        { name: 'Trombose e Embolia', subs: ['Tríade de Virchow','Tipos de trombo','Tromboembolismo pulmonar'] },
      ]},
    ],
  },
  farmacologia: {
    name: 'Farmacologia', cycle: 'Ciclo básico',
    desc: 'Fármacos, mecanismos de ação, farmacocinética e efeitos adversos.',
    topicos: 5, resumos: 18, questoes: 90, cards: 180,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`,
    topics: [
      { title: 'Farmacocinética', subtopics: [
        { name: 'Absorção', subs: ['Biodisponibilidade','Vias de administração','Fatores que afetam absorção'] },
        { name: 'Distribuição', subs: ['Volume de distribuição','Ligação proteica','Barreira hematoencefálica'] },
        { name: 'Metabolismo', subs: ['CYP450','Reações fase I e II','Indutores e inibidores'] },
        { name: 'Excreção', subs: [] },
      ]},
      { title: 'Farmacodinâmica', subtopics: [
        { name: 'Receptores', subs: ['Agonistas','Antagonistas','Relação dose-resposta'] },
        { name: 'Eficácia e Potência', subs: ['Eficácia máxima','Potência relativa','Índice terapêutico'] },
      ]},
    ],
  },
  neurologia: {
    name: 'Neurologia', cycle: 'Ciclo básico',
    desc: 'Sistema nervoso, impulsos, sinapses e bases neurofuncionais.',
    topicos: 5, resumos: 14, questoes: 70, cards: 140,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c-2-2-5-2-6.5 0C3 5.5 2 8 3 10c-1 1-1 3 .5 4C3 16 4.5 17.5 6.5 17.5 7 19 8.5 20 10.5 19.5 11 20.5 12 21 12 21"/><path d="M12 5c2-2 5-2 6.5 0C21 5.5 22 8 21 10c1 1 1 3-.5 4C21 16 19.5 17.5 17.5 17.5 17 19 15.5 20 13.5 19.5 13 20.5 12 21 12 21"/><line x1="12" y1="5" x2="12" y2="21"/></svg>`,
    topics: [
      { title: 'Neurofisiologia básica', subtopics: [
        { name: 'Potencial de ação', subs: ['Fases do potencial de ação','Canais iônicos','Período refratário'] },
        { name: 'Sinapse', subs: [] },
      ]},
      { title: 'Sistema Nervoso Autônomo', subtopics: [
        { name: 'Simpático', subs: ['Receptores adrenérgicos','Noradrenalina','Respostas fisiológicas'] },
        { name: 'Parassimpático', subs: ['Receptores muscarínicos','Acetilcolina','Respostas fisiológicas'] },
      ]},
    ],
  },
  cardiologia: {
    name: 'Cardiologia', cycle: 'Ciclo clínico',
    desc: 'Ritmos, insuficiência cardíaca, semiologia e condutas essenciais.',
    topicos: 4, resumos: 10, questoes: 50, cards: 100,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    topics: [
      { title: 'Insuficiência Cardíaca', subtopics: [
        { name: 'Fisiopatologia', subs: ['Disfunção sistólica','Disfunção diastólica','Mecanismos compensatórios'] },
        { name: 'Tratamento', subs: [] },
      ]},
    ],
  },
  microbiologia: {
    name: 'Microbiologia', cycle: 'Ciclo básico',
    desc: 'Bactérias, vírus, fungos, parasitas e raciocínio infeccioso.',
    topicos: 5, resumos: 16, questoes: 80, cards: 160,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
    topics: [
      { title: 'Bacteriologia', subtopics: [
        { name: 'Gram-positivos', subs: ['Staphylococcus','Streptococcus','Enterococcus'] },
        { name: 'Gram-negativos', subs: [] },
      ]},
    ],
  },
  bioquimica: {
    name: 'Bioquímica', cycle: 'Ciclo básico',
    desc: 'Metabolismo, enzimas, glicólise, ciclos energéticos e integração.',
    topicos: 6, resumos: 20, questoes: 100, cards: 200,
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><line x1="8.5" y1="12" x2="15.5" y2="6.8"/><line x1="8.5" y1="12" x2="15.5" y2="17.2"/><circle cx="12" cy="12" r="1.5"/></svg>`,
    topics: [
      { title: 'Metabolismo de Carboidratos', subtopics: [
        { name: 'Glicólise', subs: ['Etapas da glicólise','Regulação','Produtos finais'] },
        { name: 'Ciclo de Krebs', subs: ['Reações do ciclo','NADH e FADH2','Regulação'] },
        { name: 'Gliconeogênese', subs: [] },
      ]},
    ],
  },
};

export const FLASHCARD_STATS: Record<string, FlashcardStat> = {
  neurologia:    { review: 12, newCards: 8,  mastered: 63,  total: 140 },
  farmacologia:  { review: 7,  newCards: 11, mastered: 130, total: 180 },
  cardiologia:   { review: 18, newCards: 5,  mastered: 30,  total: 100 },
  microbiologia: { review: 0,  newCards: 24, mastered: 0,   total: 160 },
  bioquimica:    { review: 0,  newCards: 6,  mastered: 176, total: 200 },
  patologia:     { review: 5,  newCards: 14, mastered: 121, total: 220 },
};

export const INITIAL_SUMMARIES: SummaryItem[] = [
  {
    matter: 'Patologia', topic: 'Inflamação Aguda e Crônica',
    subtopic: 'Inflamação aguda', subsubtopic: 'Mediadores químicos',
    content: 'Resumo estratégico sobre sinais cardinais, mediadores químicos, resposta vascular, resposta celular e diferenças entre inflamação aguda e crônica.',
    youtube: '', fileName: 'Resumo modelo NeuroFix',
    instructions: 'Foco em prova, diagnóstico diferencial e exemplos clínicos.',
  },
  {
    matter: 'Neurologia', topic: 'Neurofisiologia básica',
    subtopic: 'Potencial de ação', subsubtopic: 'Fases do potencial de ação',
    content: 'Resumo sobre repouso, despolarização, repolarização, hiperpolarização e participação dos canais de sódio e potássio.',
    youtube: '', fileName: '', instructions: 'Explicar como se fosse para revisão rápida antes da prova.',
  },
  {
    matter: 'Neurologia', topic: 'Neurofisiologia básica',
    subtopic: 'Sinapse', subsubtopic: 'Neurotransmissores',
    content: 'Resumo sobre sinapse química, sinapse elétrica, liberação de neurotransmissores e receptores pós-sinápticos.',
    youtube: '', fileName: '', instructions: 'Mostrar exemplos clínicos simples.',
  },
  {
    matter: 'Neurologia', topic: 'Sistema Nervoso Autônomo',
    subtopic: 'Simpático', subsubtopic: '',
    content: 'Resumo geral sobre o sistema simpático, receptores adrenérgicos e respostas fisiológicas principais.',
    youtube: '', fileName: '', instructions: 'Resumo sem subsubtópico para aparecer direto no subtópico.',
  },
];

export const INITIAL_FLASHCARDS: FlashItem[] = [
  {
    matter: 'Neurologia', topic: 'Neurofisiologia básica',
    subtopic: 'Potencial de ação', subsubtopic: 'Fases do potencial de ação',
    content: 'Cards sobre repouso, despolarização, repolarização, hiperpolarização e canais de sódio e potássio.',
    youtube: '', fileName: '', instructions: 'Perguntas curtas, diretas e focadas em prova.',
    cardCount: 24, style: 'Pergunta e resposta',
  },
  {
    matter: 'Farmacologia', topic: 'Farmacocinética',
    subtopic: 'Absorção de fármacos', subsubtopic: '',
    content: 'Cards sobre vias de administração, biodisponibilidade, absorção e fatores que alteram a concentração plasmática.',
    youtube: '', fileName: '', instructions: 'Criar cards objetivos com exemplos clínicos.',
    cardCount: 18, style: 'Pergunta e resposta',
  },
];

export function getCycleFromDiscipline(key: string): 'basico' | 'clinico' {
  const d = DISCIPLINES[key];
  if (!d) return 'basico';
  return d.cycle.toLowerCase().includes('clínico') || d.cycle.toLowerCase().includes('clinico') ? 'clinico' : 'basico';
}

export function countResumeUnitsInTopic(topic: { subtopics: Array<{ subs: string[] }> }): number {
  return topic.subtopics.reduce((total, sub) => total + 1 + (sub.subs?.length || 0), 0);
}
