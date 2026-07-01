export type FlashTipo = 'frente_verso' | 'lacuna' | 'multipla_escolha';
export type StudyMode = 'cartoes' | 'combinacao' | 'empilhador';

export interface FlashcardRow {
  id: string;
  user_id: string | null;
  tipo: FlashTipo | string;
  titulo: string | null;
  ciclo: string | null;
  materia: string | null;
  topic_id: string | null;
  subtopic_id: string | null;
  sub_subtopic_id: string | null;
  pergunta: string | null;
  resposta: string | null;
  texto_lacuna: string | null;
  opcoes: string[] | null;
  resposta_correta: string | null;
  status: string;
  updated_at: string | null;
  created_at: string | null;
}

export interface FlashcardReviewRow {
  id: string;
  user_id: string;
  flashcard_id: string;
  dificuldade: string | null;
  next_review_date: string;
  acertos_seguidos: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface MatterStats {
  total: number;
  novos: number;
  revisar: number;
  fixacao: number;
}

export interface MatterAggregate {
  materia: string;
  ciclo: string;
  total: number;
  novos: number;
  revisar: number;
  fixacao: number;
  flashcards: FlashcardRow[];
}

const ACCENT_PALETTE = ['gold', 'blue', 'green', 'violet'] as const;
export type MatterAccent = (typeof ACCENT_PALETTE)[number];

const MATTER_ICONS: Record<string, string> = {
  brain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5c-2-2-5-2-6.5 0C3 5.5 2 8 3 10c-1 1-1 3 .5 4C3 16 4.5 17.5 6.5 17.5 7 19 8.5 20 10.5 19.5 11 20.5 12 21 12 21"/><path d="M12 5c2-2 5-2 6.5 0C21 5.5 22 8 21 10c1 1 1 3-.5 4C21 16 19.5 17.5 17.5 17.5 17 19 15.5 20 13.5 19.5 13 20.5 12 21 12 21"/><line x1="12" y1="5" x2="12" y2="21"/></svg>',
  pill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>',
  microbe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>',
  molecule: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><line x1="8.5" y1="12" x2="15.5" y2="6.8"/><line x1="8.5" y1="12" x2="15.5" y2="17.2"/><circle cx="12" cy="12" r="1.5"/></svg>',
  flask: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18h8"/><path d="M3 21h18"/><path d="M14 21v-5"/><path d="M9 3v9"/><path d="M14 3v4"/><path d="M7 5h8"/><circle cx="11" cy="14" r="3"/></svg>',
  bone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 4.8v4.1a4.7 4.7 0 0 0 9.4 0V4.8"/><path d="M6.8 4H4.4M14.6 4h-2.4"/><path d="M9.5 13.6v2.1a4.3 4.3 0 0 0 8.6 0v-1.2"/><circle cx="19.2" cy="12.4" r="1.8"/></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/></svg>',
};

const ICON_KEYS = Object.keys(MATTER_ICONS);

const MATTER_ICON_HINTS: Array<{ pattern: RegExp; icon: string }> = [
  { pattern: /(neuro|cerebr|nervos)/i, icon: 'brain' },
  { pattern: /(farma|farmaco|f[aá]rmac)/i, icon: 'pill' },
  { pattern: /(cardio|cora[cç][aã]o|circula)/i, icon: 'heart' },
  { pattern: /(micro|bact|v[ií]rus|fungo|parasit)/i, icon: 'microbe' },
  { pattern: /(bioqu|enzima|metaboli|gli[cb]ol)/i, icon: 'molecule' },
  { pattern: /(pato|c[eé]lula|tecid|histo)/i, icon: 'flask' },
  { pattern: /(anatom|esquelet|osso|articul)/i, icon: 'bone' },
];

function normalizeKey(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getMatterIconSvg(name: string): string {
  if (!name) return MATTER_ICONS.book;
  for (const hint of MATTER_ICON_HINTS) {
    if (hint.pattern.test(name)) return MATTER_ICONS[hint.icon];
  }
  const key = normalizeKey(name);
  const idx = hashString(key) % ICON_KEYS.length;
  return MATTER_ICONS[ICON_KEYS[idx]];
}

export function getMatterAccent(name: string): MatterAccent {
  const lower = normalizeKey(name);
  if (/(neuro|nervos|cerebr|pato|tecid)/.test(lower)) return 'gold';
  if (/(farma|cardio|micro|sangue|imun)/.test(lower)) return 'blue';
  if (/(bioqu|enzima|metaboli|nutri|verde)/.test(lower)) return 'green';
  if (/(anatom|esquelet|articul|psiqu)/.test(lower)) return 'violet';
  const idx = hashString(lower) % ACCENT_PALETTE.length;
  return ACCENT_PALETTE[idx];
}

export function slugifyMatter(name: string): string {
  return normalizeKey(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sem-nome';
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function computeStats(flashcards: FlashcardRow[], reviews: FlashcardReviewRow[]): MatterStats {
  const reviewByFlash = new Map<string, FlashcardReviewRow>();
  for (const r of reviews) reviewByFlash.set(r.flashcard_id, r);

  const today = todayISO();
  let novos = 0;
  let revisar = 0;
  let respondidos = 0;

  for (const f of flashcards) {
    const r = reviewByFlash.get(f.id);
    if (!r) { novos++; continue; }
    respondidos++;
    if (r.next_review_date <= today) revisar++;
  }

  const total = flashcards.length;
  const fixacao = total > 0 ? Math.round((respondidos / total) * 100) : 0;
  return { total, novos, revisar, fixacao };
}

export function normalizeCiclo(value: string | null | undefined): string {
  const v = (value ?? '').trim();
  if (!v) return 'Ciclo Básico';
  const lower = v.toLowerCase();
  if (lower.includes('clín') || lower.includes('clin')) return 'Ciclo Clínico';
  if (lower.includes('intern')) return 'Internato';
  return 'Ciclo Básico';
}
