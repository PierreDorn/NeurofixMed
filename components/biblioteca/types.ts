export interface DeepLink {
  topicId?: string;
  subtopicId?: string;
  subSubtopicId?: string;
}

export type StudyView = 'biblioteca' | 'flashcards';
export type CycleKey = 'basico' | 'clinico';
export type PanelMode = 'library' | 'flashcards';

export interface SubSubtopic {
  name: string;
}

export interface Subtopic {
  name: string;
  subs: string[];
}

export interface Topic {
  title: string;
  subtopics: Subtopic[];
}

export interface Discipline {
  name: string;
  cycle: string;
  desc: string;
  topicos: number;
  resumos: number;
  questoes: number;
  cards: number;
  icon: string;
  topics: Topic[];
}

export interface FlashcardStat {
  review: number;
  newCards: number;
  mastered: number;
  total: number;
}

export interface DisciplinePanelState {
  open: boolean;
  key: string;
  mode: PanelMode;
}

export interface SummaryItem {
  matter: string;
  topic: string;
  subtopic: string;
  subsubtopic: string;
  content: string;
  youtube: string;
  fileName: string;
  instructions: string;
}

export interface FlashItem extends SummaryItem {
  cardCount: number;
  style: string;
}
