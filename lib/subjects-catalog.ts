// Catálogo estático V73 (extraído de public/v73/index.html, linhas 2046-2062).
// Fase futura: mover para tabela Supabase com policies de leitura pública
// (admin escreve, todo authenticated lê). Por ora fica local para renderização
// determinística e sem custo de query.

export type SubjectStage = 'basic' | 'clinical' | 'internship' | 'enamed' | 'residency';
export type SubjectStatus = 'live' | 'building' | 'preserved';

export type Subject = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: string;
  accent: string;
  soft: string;
  status: SubjectStatus;
  statusLabel: string;
  summary: string;
  category: 'disease' | 'clinical' | 'basic';
  stage: SubjectStage;
};

// Paleta oficial NeuroFix — accents restritos a preto/dourado por status.
const ACCENT_LIVE = '#0A0A0A';
const SOFT_LIVE = '#F2F2F2';
const ACCENT_BUILDING = '#C9A24E';
const SOFT_BUILDING = '#FBF4E3';

export const SUBJECT_CATALOG: Subject[] = [
  { id: 'pathology', title: 'Patologia Médica', eyebrow: 'Núcleo completo NeuroFix', description: 'Uma formação progressiva em mecanismos da doença, diagnóstico e patologia dos órgãos.', icon: 'P', accent: ACCENT_LIVE, soft: SOFT_LIVE, status: 'live', statusLabel: 'Em desenvolvimento', summary: '39 aulas · 372 microassuntos', category: 'disease', stage: 'basic' },
  { id: 'microbiology', title: 'Microbiologia', eyebrow: 'Caderno reorganizado', description: 'Estrutura, classificação, virulência e principais grupos bacterianos e fúngicos em uma disciplina própria.', icon: 'µ', accent: ACCENT_LIVE, soft: SOFT_LIVE, status: 'live', statusLabel: 'Conteúdo reorganizado', summary: '2 aulas já estruturadas', category: 'disease', stage: 'basic' },
  { id: 'immunology', title: 'Imunologia', eyebrow: 'Caderno reorganizado', description: 'Imunidade inata e adaptativa, células, órgãos linfoides, imunoglobulinas, complemento e hipersensibilidades.', icon: 'I', accent: ACCENT_LIVE, soft: SOFT_LIVE, status: 'live', statusLabel: 'Conteúdo reorganizado', summary: '1 aula já estruturada', category: 'disease', stage: 'basic' },
  { id: 'infectology', title: 'Infectologia e Parasitologia', eyebrow: 'Conteúdo anterior preservado', description: 'Helmintos, protozoários, HIV e mecanismos de infecção permanecem disponíveis em seu próprio caderno.', icon: '✣', accent: ACCENT_LIVE, soft: SOFT_LIVE, status: 'live', statusLabel: 'Conteúdo preservado', summary: '3 aulas já estruturadas', category: 'disease', stage: 'basic' },
  { id: 'pharmacology', title: 'Farmacologia Médica', eyebrow: 'Matéria cadastrada', description: 'Princípios farmacológicos, mecanismos de ação, efeitos adversos, interações e aplicação clínica.', icon: 'Rx', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'disease', stage: 'basic' },
  { id: 'semiology', title: 'Semiologia Médica', eyebrow: 'Matéria cadastrada', description: 'Anamnese, exame físico, raciocínio clínico e interpretação dos principais sinais e sintomas.', icon: 'S', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'clinical', stage: 'basic' },
  { id: 'pediatrics', title: 'Semiologia Pediátrica e Puericultura', eyebrow: 'Matéria cadastrada', description: 'Avaliação pediátrica, crescimento, desenvolvimento, exame físico e acompanhamento da criança.', icon: '♡', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'clinical', stage: 'basic' },
  { id: 'anatomy', title: 'Anatomia Médica', eyebrow: 'Matéria cadastrada', description: 'Estruturas, relações anatômicas, correlações clínicas e reconhecimento espacial do corpo humano.', icon: 'A', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'physiology', title: 'Fisiologia Médica', eyebrow: 'Matéria cadastrada', description: 'Funcionamento dos sistemas explicado com lógica, integração e correlação clínica.', icon: 'ƒ', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'biochemistry', title: 'Bioquímica', eyebrow: 'Matéria cadastrada', description: 'Metabolismo, enzimas, vias bioquímicas e suas relações com saúde, doença e exames laboratoriais.', icon: 'B', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'histology', title: 'Histologia', eyebrow: 'Matéria cadastrada', description: 'Tecidos e órgãos em microscopia, com reconhecimento visual e correlação com a função.', icon: 'H', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'embryology', title: 'Embriologia', eyebrow: 'Matéria cadastrada', description: 'Desenvolvimento humano, formação dos sistemas e correlação com anomalias congênitas.', icon: 'E', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'cellbiology', title: 'Biologia Celular', eyebrow: 'Matéria cadastrada', description: 'Estrutura, organelas, sinalização, ciclo celular e bases celulares indispensáveis à Medicina.', icon: '◉', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'genetics', title: 'Genética e Citogenética', eyebrow: 'Matéria cadastrada', description: 'Herança, alterações cromossômicas, genética molecular e interpretação aplicada à prática médica.', icon: 'G', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'basic', stage: 'basic' },
  { id: 'familymedicine', title: 'Medicina da Família', eyebrow: 'Matéria preservada no caderno', description: 'Cuidado longitudinal, prevenção, atenção primária e abordagem integral da pessoa e da família.', icon: '✚', accent: ACCENT_BUILDING, soft: SOFT_BUILDING, status: 'building', statusLabel: 'Em estruturação', summary: 'Conteúdo será desenvolvido', category: 'clinical', stage: 'basic' },
];

export const STAGES: Array<{ id: SubjectStage; label: string }> = [
  { id: 'basic', label: 'Ciclo Básico' },
  { id: 'clinical', label: 'Ciclo Clínico' },
  { id: 'internship', label: 'Internato' },
  { id: 'enamed', label: 'Enamed' },
  { id: 'residency', label: 'Residência' },
];

// Copy oficial de cada etapa (extraído de NeuroFix_Med_v70_LIMPO_FINAL.html, l.2451–2477).
// `cards` só existe para etapas ainda sem disciplinas — usado no bloco "Lançamento em breve".
export type StageMeta = {
  title: string;
  description: string;
  countLabel: string;
  searchPlaceholder: string;
  cards?: Array<[string, string]>;
};

export const STAGE_META: Record<SubjectStage, StageMeta> = {
  basic: {
    title: 'Ciclo Básico',
    description:
      'O Ciclo Básico constrói a base científica que permite compreender o corpo saudável antes de estudar a doença. É nessa etapa que o acadêmico conecta estrutura, função, mecanismos celulares e os primeiros fundamentos médicos — conhecimentos indispensáveis para raciocinar com segurança no Ciclo Clínico, no Internato e nas provas futuras.',
    countLabel: 'disciplinas reunidas<br>no Ciclo Básico',
    searchPlaceholder: 'Buscar uma disciplina do Ciclo Básico...',
  },
  clinical: {
    title: 'Ciclo Clínico',
    description:
      'É a etapa em que os fundamentos do Ciclo Básico começam a ser conectados aos sistemas do corpo, aos sinais, aos sintomas, aos exames e às hipóteses diagnósticas. O acadêmico aprende a reconhecer como os mecanismos estudados aparecem no paciente, sem perder a base que explica cada manifestação.',
    countLabel: 'disciplinas cadastradas<br>no Ciclo Clínico',
    searchPlaceholder: 'Buscar no Ciclo Clínico...',
    cards: [
      ['Do mecanismo ao paciente', 'Conectar fisiopatologia, sinais, sintomas e exames sem decorar listas soltas.'],
      ['Raciocínio por sistemas', 'Organizar o estudo por problemas clínicos e construir hipóteses progressivamente.'],
      ['Questões clínicas graduais', 'Aplicar a base em casos compatíveis com esta fase da formação.'],
    ],
  },
  internship: {
    title: 'Internato',
    description:
      'É a fase de imersão nos cenários reais de cuidado. O conhecimento passa a ser usado para definir prioridades, comunicar-se com a equipe, formular condutas supervisionadas e agir com segurança diante do paciente.',
    countLabel: 'disciplinas cadastradas<br>no Internato',
    searchPlaceholder: 'Buscar no Internato...',
    cards: [
      ['Prioridade e segurança', 'Aprender o que precisa ser reconhecido e feito primeiro em cada situação.'],
      ['Conduta passo a passo', 'Transformar conhecimento em decisões clínicas organizadas e supervisionadas.'],
      ['Casos de prática', 'Treinar cenários próximos da rotina de ambulatório, enfermaria e urgência.'],
    ],
  },
  enamed: {
    title: 'Enamed',
    description:
      'É a trilha de integração do conhecimento construído ao longo do curso. Aqui, o acadêmico reúne conteúdos de diferentes áreas, revisa competências e treina a aplicação do que aprendeu em situações de prova.',
    countLabel: 'trilhas cadastradas<br>para o Enamed',
    searchPlaceholder: 'Buscar uma trilha do Enamed...',
    cards: [
      ['Revisão integrada', 'Unir conteúdos que foram estudados separadamente durante a graduação.'],
      ['Competências em prova', 'Treinar interpretação, tomada de decisão e aplicação do conhecimento.'],
      ['Revisão por lacunas', 'Direcionar o estudo para o que ainda não está consolidado.'],
    ],
  },
  residency: {
    title: 'Residência',
    description:
      'É a etapa de preparação de maior exigência, com aprofundamento por especialidades, casos mais complexos, estratégia de prova e correção sistemática das lacunas que impedem um desempenho competitivo.',
    countLabel: 'trilhas cadastradas<br>para Residência',
    searchPlaceholder: 'Buscar uma trilha de Residência...',
    cards: [
      ['Questões avançadas', 'Treinar enunciados densos, alternativas plausíveis e decisões de maior complexidade.'],
      ['Revisão por especialidade', 'Organizar o conteúdo conforme os temas e áreas mais cobrados.'],
      ['Estratégia e desempenho', 'Corrigir erros, revisar com prioridade e transformar conhecimento em acerto.'],
    ],
  },
};

export function subjectsByStage(stage: SubjectStage): Subject[] {
  return SUBJECT_CATALOG.filter((s) => s.stage === stage);
}

export function findSubject(id: string): Subject | undefined {
  return SUBJECT_CATALOG.find((s) => s.id === id);
}
