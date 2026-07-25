// Tipos e constantes do ciclo ativo — seguro para importar em client components.

export type CycleStage =
  | 'understand'
  | 'retrieve'
  | 'apply'
  | 'correct'
  | 'review'
  | 'prove'
  | 'mastered';

export const CYCLE_STAGES: Array<{
  id: CycleStage;
  label: string;
  hint: string;
  suggestTab: string;
}> = [
  { id: 'understand', label: '1. Entender', hint: 'Leia a explicação do zero.', suggestTab: 'explain' },
  { id: 'retrieve', label: '2. Recuperar', hint: 'Reconstrua o raciocínio sem consultar.', suggestTab: 'learning' },
  { id: 'apply', label: '3. Aplicar', hint: 'Responda as questões de treino.', suggestTab: 'questions' },
  { id: 'correct', label: '4. Corrigir', hint: 'Revise as pegadinhas e o que confunde.', suggestTab: 'confusions' },
  { id: 'review', label: '5. Revisar', hint: 'Passe pelos flashcards.', suggestTab: 'flashcards' },
  { id: 'prove', label: '6. Provar', hint: 'Feche a nota com a véspera.', suggestTab: 'eve' },
];

export type NoteCycleState = {
  stage: CycleStage;
  stages_completed: CycleStage[];
  updated_at: string;
};
